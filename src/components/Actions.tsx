import React from "react";

interface ActionsProps {
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  extractedText: string | null;
  setExtractedText: React.Dispatch<React.SetStateAction<string | null>>;
  extractedImages: string[];
  setExtractedImages: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFiles: File[];
}

const Actions: React.FC<ActionsProps> = ({
  setSelectedFiles,
  extractedText,
  setExtractedText,
  extractedImages,
  setExtractedImages,
  selectedFiles,
}) => {
  // Function to download extracted text as a .txt file
  const handleDownloadText = () => {
    if (!extractedText || selectedFiles.length === 0) {
      alert("No extracted text available to download.");
      return;
    }

    const originalFileName = selectedFiles[0].name.replace(/\.pdf$/, "");

    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${originalFileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to download extracted images
  const handleDownloadImages = () => {
    if (extractedImages.length === 0) {
      alert("No extracted images available to download.");
      return;
    }

    extractedImages.forEach((imageUrl, index) => {
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = `extracted_image_${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  // Function to reset extracted text, images, and selected files
  const handleReset = () => {
    setSelectedFiles([]);
    setExtractedText(null);
    setExtractedImages([]);
  };

  return (
    <div className="mt-6 flex space-x-4" style={{ "fontFamily": "Poppins" }}>
      {extractedText && (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md"
          onClick={handleDownloadText}
        >
          Download Text
        </button>
      )}

      {extractedImages.length > 0 && (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={handleDownloadImages}
        >
          Download Images
        </button>
      )}

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
