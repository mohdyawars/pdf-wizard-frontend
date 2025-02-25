import { useState } from "react";
import Hero from "./Hero";
import FileUpload from "./FileUpload";
import FeatureSelection from "./FeatureSelection";
import ProcessingSelection from "./ProcessingSelection";
import Actions from "./Actions";
import Alert from "./Alert";
import { extractTextFromPdf } from "../api";
import { mergePdfs } from "../api";



const API_BASE_URL: string = "http://127.0.0.1:8000";

const Pdfwizard = () => {
  const [selectedFeature, setSelectedFeature] = useState("text");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mergedPdf, setMergedPdf] = useState<File | null>(null);
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

  // Handle merging pdf
  const handleMergePdfs = async () => {
    if (selectedFiles.length < 2) {
      setAlert({ message: "Please select at least 2 PDF files to merge", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const result = await mergePdfs(selectedFiles);

      if (result && result.data) {  // ✅ Ensure API response contains the file path
        const fileUrl = `${API_BASE_URL}${result.data}`; // ✅ Convert relative path to full URL

        // ✅ Fetch the actual PDF file
        const fileResponse = await fetch(fileUrl);
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch PDF: ${fileResponse.statusText}`);
        }

        const blob = await fileResponse.blob();

        // ✅ Convert Blob to File (optional, for state management)
        const file = new File([blob], "merged.pdf", { type: "application/pdf" });

        // ✅ Store the merged PDF in state (if needed)
        setMergedPdf(file);

        // ✅ Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "merged.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setAlert({ message: "PDFs merged successfully!", type: "success" }); // ✅ Tailwind Alert
      } else {
        setAlert({ message: "Failed to merge PDFs.", type: "error" });
      }
    } catch (error) {
      setAlert({ message: "An error occurred while merging PDFs.", type: "error" });
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
        selectedFiles={selectedFiles}
      />
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
    </div>
  );
};

export default Pdfwizard;
