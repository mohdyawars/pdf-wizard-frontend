import { useState } from "react";
import Hero from "./Hero";
import FileUpload from "./FileUpload";
import FeatureSelection from "./FeatureSelection";
import ProcessingSelection from "./ProcessingSelection";
import Actions from "./Actions";
import Alert from "./Alert";
import { extractImagesFromPdf, extractTextFromPdf } from "../api";
import { mergePdfs } from "../api";



// const API_BASE_URL: string = "http://43.205.239.69:80";
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

const Pdfwizard = () => {
  const [selectedFeature, setSelectedFeature] = useState("text");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [mergedPdf, setMergedPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Handle file selection
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  // Handle text extraction
  const handleExtractText = async () => {
    if (selectedFiles.length === 0) {
      setAlert({ message: "Please select a PDF file first.", type: "error" });
      return;
    }

    setLoading(true);
    const result = await extractTextFromPdf(selectedFiles[0]);
    setLoading(false);

    if (result && result.data.status === "success") {
      const textContent = Object.values(result.data.content).join("\n\n");
      setExtractedText(textContent);
    } else {
      setExtractedText("Failed to extract text.");
    }
  };

  const handleImageExtraction = async () => {
    if (selectedFiles.length === 0) {
      setAlert({ message: "Please select a PDF file first.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const result = await extractImagesFromPdf(selectedFiles[0]);

      if (result?.data?.status === "success" && Array.isArray(result?.data?.images) && result.data.images.length > 0) {
        const imageUrls = result.data.images.map((img: { url: string }) =>
          img.url.startsWith("http") ? img.url : `${API_BASE_URL}${img.url}`
        );        setExtractedImages(imageUrls);
        setAlert({ message: "Images extracted successfully", type: "success" });
      } else {
        setExtractedImages([]);
        setAlert({ message: "No images found in the PDF.", type: "error" });
      }
    } catch (error) {
      console.error("Error extracting images:", error);
      setAlert({ message: "An error occurred while extracting images.", type: "error" });
    } finally {
      setLoading(false);
    }
  };


  // Handle merging pdf
  const handleMergePdfs = async () => {
    if (selectedFiles.length < 2) {
      setAlert({ message: "Please select at least 2 PDF files to merge", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const result = await mergePdfs(selectedFiles);

      console.log(result)

      if (result && result.data) {
        const fileUrl = result.data.startsWith("http") ? result.data : `${API_BASE_URL}${result.data}`;

        console.log(fileUrl)

        const fileResponse = await fetch(fileUrl);
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch PDF: ${fileResponse.statusText}`);
        }

        const blob = await fileResponse.blob();

        const file = new File([blob], "merged.pdf", { type: "application/pdf" });

        console.log(file)

        setMergedPdf(file);

        const url = URL.createObjectURL(blob);
        console.log(url)
        const a = document.createElement("a");
        a.href = url;
        a.download = "merged.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setAlert({ message: "PDFs merged successfully!", type: "success" });
      } else {
        setAlert({ message: "Failed to merge PDFs.", type: "error" });
      }
    } catch (error) {
      setAlert({ message: "An error occurred while merging PDFs.", type: "error" });
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-">
      <Hero />

      <FileUpload
        handleFileUpload={handleFileUpload}
        selectedFiles={selectedFiles}
      />

      <FeatureSelection
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
      />

      <ProcessingSelection
        selectedFeature={selectedFeature}
        extractedText={extractedText}
        extractedImages={extractedImages} // Pass extracted images here
        loading={loading}
      />

      {selectedFeature === "text" && (
        <>
          <button
            onClick={handleExtractText}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md mt-4"
          >
            {loading ? "Extracting..." : "Extract Text"}
          </button>
        </>
      )}

      {selectedFeature === "images" && (
        <button
          onClick={handleImageExtraction}
          disabled={loading}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md mt-4"
        >
          {loading ? "Extracting Images..." : "Extract Images"}
        </button>
      )}

      {selectedFeature === "merge" && (
        <button
          onClick={handleMergePdfs}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md mt-4"
        >
          {loading ? "Merging..." : "Merge PDFs"}
        </button>
      )}

      <Actions
        setSelectedFiles={setSelectedFiles}
        extractedText={extractedText}
        setExtractedText={setExtractedText}
        extractedImages={extractedImages}
        setExtractedImages={setExtractedImages}
        selectedFiles={selectedFiles}
      />
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
    </div>
  );
};

export default Pdfwizard;
