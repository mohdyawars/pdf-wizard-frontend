import React, { useState } from "react";

interface FileUploadProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFiles: File[];
  uploadFile: (file: File) => Promise<string | null>; // Returns file URL or null
}

const FileUpload: React.FC<FileUploadProps> = ({
  handleFileUpload,
  selectedFiles,
  uploadFile,
}) => {
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploadQueue, setUploadQueue] = useState<Set<string>>(new Set()); // Track ongoing uploads

  const handleUpload = async (file: File) => {
    if (uploadQueue.has(file.name)) return; // Prevent duplicate upload
    setUploadQueue((prev) => new Set(prev).add(file.name));

    setUploadingFile(file.name);
    const fileUrl = await uploadFile(file);

    if (fileUrl) {
      setUploadedFiles((prev) => [...prev, { name: file.name, url: fileUrl }]);
    }

    setUploadingFile(null);
    setUploadQueue((prev) => {
      const updatedQueue = new Set(prev);
      updatedQueue.delete(file.name);
      return updatedQueue;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg" style={{ "fontFamily": "Poppins" }}>
      {/* Drag & Drop / File Input */}
      <label className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="file"
          multiple
          accept=".pdf"
          className="hidden"
          onChange={handleFileUpload}
        />
        <p className="text-gray-600 text-center">Click to upload PDFs or drag & drop</p>
      </label>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-gray-700 font-semibold">Selected Files ({selectedFiles.length}):</h3>
          <ul className="list-disc list-inside text-gray-600 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <li key={index} className="truncate flex justify-between items-center">
                {file.name}
                {/* <button */}
                {/*   className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm disabled:opacity-50" */}
                {/*   onClick={() => handleUpload(file)} */}
                {/*   disabled={uploadingFile === file.name || uploadQueue.has(file.name)} */}
                {/* > */}
                {/*   {uploadingFile === file.name ? "Uploading..." : "Upload"} */}
                {/* </button> */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="text-gray-700 font-semibold">Uploaded Files:</h3>
          <ul className="text-gray-600 max-h-40 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex justify-between items-center">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 truncate">
                  {file.name}
                </a>
                <span className="text-green-500 text-sm">✓</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
