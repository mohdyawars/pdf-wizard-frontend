import { useState, useEffect } from "react";
import { FaGoogleDrive } from "react-icons/fa";
import { PDFDocument, rgb } from "pdf-lib";
import { initializeGoogleAPIs, pickFileFromGoogleDrive } from "../utils/googleDrive";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set the worker path using Vite's public directory
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "/pdf.worker.min.js",
  import.meta.url
).toString();

// TODO
const EditPDF = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [textAnnotations, setTextAnnotations] = useState<{ x: number; y: number; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadApis = async () => {
      try {
        await initializeGoogleAPIs();
        setIsGoogleLoaded(true);
      } catch (error) {
        console.error("Failed to load Google APIs:", error);
      }
    };
    loadApis();
  }, []);

  const handleGoogleDriveUpload = async () => {
    if (!isGoogleLoaded) {
      console.error("Google API not loaded");
      return;
    }

    setIsLoading(true);
    try {
      const selectedFile = await pickFileFromGoogleDrive();
      if (selectedFile) {
        setSelectedFiles(prev => [...prev, selectedFile]);
        console.log("Selected file from Google Drive:", selectedFile);
      }
    } catch (error) {
      console.error("Google Drive file selection failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);

      // Read the first file as PDF
      const reader = new FileReader();
      reader.readAsArrayBuffer(fileArray[0]);
      reader.onload = () => {
        setPdfData(reader.result as ArrayBuffer);
      };
    }
  };

  const addTextAnnotation = () => {
    setTextAnnotations([...textAnnotations, { x: 50, y: 50, text: "New Text" }]);
  };

  const savePDF = async () => {
    if (!pdfData) return;

    const pdfDoc = await PDFDocument.load(pdfData);
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    textAnnotations.forEach(({ x, y, text }) => {
      firstPage.drawText(text, { x, y: height - y, size: 20, color: rgb(1, 0, 0) });
    });

    const editedPdfBytes = await pdfDoc.save();
    const blob = new Blob([editedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto text-center mt-10 p-6">
      <h1 className="text-4xl font-bold">Edit PDF files</h1>
      <p className="text-lg text-gray-600 mt-4">
        Effortlessly modify your PDFs by adding text, images, annotations, or redacting content in just a few clicks.
      </p>

      {/* File Upload Section */}
      <div className="mt-6 flex flex-col items-center space-y-4">
        <label className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer shadow-md hover:bg-blue-700 transition">
          Select PDF files
          <input type="file" accept=".pdf" multiple className="hidden" onChange={handleLocalFileUpload} />
        </label>

        <div className="flex space-x-6">
          <button
            onClick={handleGoogleDriveUpload}
            disabled={!isGoogleLoaded || isLoading}
            className={`text-gray-600 hover:text-gray-900 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FaGoogleDrive className="text-4xl" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      {pdfData && (
        <div className="mt-6 border relative">
          <Document file={pdfData}>
            <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>

          {/* Text Annotations */}
          {textAnnotations.map((item, index) => (
            <div
              key={index}
              className="absolute bg-white px-2 py-1 border cursor-move"
              style={{ left: `${item.x}px`, top: `${item.y}px` }}
            >
              {item.text}
            </div>
          ))}
        </div>
      )}

      {/* Buttons for Editing */}
      <div className="mt-6">
        <button onClick={addTextAnnotation} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Text
        </button>
        <button onClick={savePDF} className="ml-2 px-4 py-2 bg-green-600 text-white rounded">
          Save PDF
        </button>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Selected Files ({selectedFiles.length})</h2>
          <ul className="mt-2 text-left">
            {selectedFiles.map((file, index) => (
              <li key={index} className="border p-2 rounded my-1 flex justify-between">
                <span>{file.name}</span>
                <button
                  onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading && <div className="mt-4"><p>Loading...</p></div>}
    </div>
  );
};

export default EditPDF;
