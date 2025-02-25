import React from "react";

interface ActionsProps {
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  extractedText: string | null;
  setExtractedText: React.Dispatch<React.SetStateAction<string | null>>;
  selectedFiles: File[]; // Get the selected files to extract the name
}

const Actions: React.FC<ActionsProps> = ({
  setSelectedFiles,
  extractedText,
  setExtractedText,
  selectedFiles,
}) => {
  // Function to download extracted text as a .txt file
  const handleDownload = () => {
    if (!extractedText || selectedFiles.length === 0) {
      alert("No extracted text available to download.");
      return;
    }

    // Extract original file name without extension
    const originalFileName = selectedFiles[0].name.replace(/\.pdf$/, "");

    // Create a text file with extracted text
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${originalFileName}.txt`; // Use original name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to reset extracted text area and selected files
  const handleReset = () => {
    setSelectedFiles([]);
    setExtractedText(null);
  };

  return (
    <div className="mt-6 flex space-x-4">
      <button
        className="px-4 py-2 bg-green-600 text-white rounded-md"
        onClick={handleDownload}
        disabled={!extractedText}
      >
        Download
      </button>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded-md"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
};

export default Actions;
