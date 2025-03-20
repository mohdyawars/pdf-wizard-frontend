import { useState } from "react";
import Hero from "./Hero";
import FileUpload from "./FileUpload";
import FeatureSelection from "./FeatureSelection";
import ProcessingSelection from "./ProcessingSelection";
import Actions from "./Actions";
import Alert from "./Alert";
import { extractImagesFromPdf, extractTextFromPdf } from "../api";
import { mergePdfs } from "../api";
import uploadFile from "../utils/uploadFile";



// const API_BASE_URL: string = "http://43.205.239.69:80";
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

const Pdfwizard = () => {
  const [selectedFeature, setSelectedFeature] = useState("text");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [mergedPdf, setMergedPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ key: string; size: number; lastModified: number }[]>([]);

  // Handle file selection
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles = Array.from(event.target.files);

    // Remove duplicates from selectedFiles
    const uniqueFiles = newFiles.filter(newFile =>
      !selectedFiles.some(existingFile =>
        existingFile.name === newFile.name &&
        existingFile.size === newFile.size &&
        existingFile.lastModified === newFile.lastModified
      )
    );

    if (uniqueFiles.length === 0) {
      setAlert({ message: "These files are already selected.", type: "warning" });
      return;
    }

    setSelectedFiles(prev => [...prev, ...uniqueFiles]);
  };

  // Handle text extraction
  const handleExtractText = async () => {
    if (selectedFiles.length === 0) {
      setAlert({ message: "Please select a PDF file first.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      // ✅ Pass uploadedFiles to check for duplicates
      const fileKey = await uploadFile(selectedFiles[0]);

      if (!fileKey) {
        setAlert({ message: "File upload failed!", type: "error" });
        setLoading(false);
        return;
      }

      const result = await extractTextFromPdf(fileKey);
      console.log(result);

      if (result && result.data.status === "success") {
        const textContent = Object.values(result.data.content).join("\n\n");
        setExtractedText(textContent);
      } else {
        setExtractedText("Failed to extract text.");
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedText("Error extracting text.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageExtraction = async () => {
    if (selectedFiles.length === 0) {
      setAlert({ message: "Please select a PDF file first.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const file = selectedFiles[0];
      const fileKey = await handleUploadToS3(file);

      if (!fileKey) {
        setAlert({ message: "File upload failed!", type: "error" });
        setLoading(false);
        return;
      }

      // 🔍 Extract images
      const result = await extractImagesFromPdf(fileKey);
      console.log(result);

      if (result?.data?.status === "success" && Array.isArray(result?.data?.images) && result.data.images.length > 0) {
        const imageUrls = result.data.images.map((img: { url: string }) =>
          img.url.startsWith("http") ? img.url : `${API_BASE_URL}/${img.url}`
        );
        setExtractedImages(imageUrls);
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

      console.error(result);

      if (result && result.data) {
        const fileUrl = result.data.startsWith("http") ? result.data : `${API_BASE_URL}${result.data}`;

        console.error("Opening file in new tab:", fileUrl);

        // Open the merged PDF only in a new tab
        window.open(fileUrl, "_blank");

        setAlert({ message: "PDFs merged successfully!", type: "success" });
      } else {
        setAlert({ message: "Failed to merge PDFs.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: "An error occurred while merging PDFs.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadToS3 = async (file: File) => {
    setAlert(null);

    // ✅ Check if file is already uploaded using size + lastModified (more accurate)
    const existingFile = uploadedFiles.find(f => f.size === file.size && f.lastModified === file.lastModified);
    if (existingFile) {
      console.log("File already uploaded:", existingFile.key);
      return existingFile.key; // Reuse the existing fileKey
    }

    // 🔄 Upload if not uploaded yet
    const fileKey = await uploadFile(file);
    if (fileKey) {
      setUploadedFiles(prev => [...prev, { key: fileKey, size: file.size, lastModified: file.lastModified }]); // Store file details
      setAlert({ message: "File uploaded successfully", type: "success" });
      return fileKey;
    } else {
      setAlert({ message: "Upload failed", type: "error" });
      return null;
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-" style={{ "fontFamily": "Poppins" }}>
      <Hero />

      <FileUpload
        handleFileUpload={handleFileUpload}
        selectedFiles={selectedFiles}
        uploadFile={async (file) => {
          const fileKey = await handleUploadToS3(file);
          if (fileKey) {
            console.log("Uploaded file key:", fileKey);
            return fileKey; // Ensure the component receives the uploaded file reference
          }
          return null;
        }}
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
