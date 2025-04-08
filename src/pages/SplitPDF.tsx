import { useState, useEffect } from "react";
import { FaGoogleDrive } from "react-icons/fa";
import { initializeGoogleAPIs, pickFileFromGoogleDrive } from "../utils/googleDrive";
import { renderPdfPages } from "../utils/pdfPreview";

const SplitPDF = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewPages, setPreviewPages] = useState<string[][]>([]);

  useEffect(() => {
    // Load Google APIs when the component mounts
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
        // Add the selected file to your list
        setSelectedFiles(prev => [...prev, selectedFile]);
        console.log("Selected file from Google Drive:", selectedFile);
      }
    } catch (error) {
      console.error("Google Drive file selection failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);

      const previews = await Promise.all(fileArray.map(file => renderPdfPages(file)));
      setPreviewPages(prev => [...prev, ...previews]);
    }
  };

  return (
      <div className='max-w-3xl mx-auto text-center mt-10 p-6'>
          <h1 className='text-4xl text-center font-bold'>Split PDF files</h1>
          <p className='text-lg text-gray-600 mt-4'>
              Effortlessly split a large PDF into multiple smaller files with
              just a few clicks.
          </p>

          {/* File Upload Section */}
          <div className='mt-6 flex flex-col items-center space-y-4'>
              {/* Upload Button */}
              <label className='bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer shadow-md hover:bg-blue-700 transition'>
                  Select PDF files
                  <input
                      type='file'
                      accept='.pdf'
                      multiple
                      className='hidden'
                      onChange={handleLocalFileUpload}
                  />
              </label>

              {/* Google Drive and Dropbox icons */}
              <div className='flex space-x-6'>
                  <button
                      onClick={handleGoogleDriveUpload}
                      disabled={!isGoogleLoaded || isLoading}
                      className={`text-gray-600 hover:text-gray-900 transition ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                      <FaGoogleDrive className='text-4xl' />
                  </button>
              </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
              <div className='mt-8'>
                  <h2 className='text-xl font-semibold'>
                      Selected Files ({selectedFiles.length})
                  </h2>
                  <ul className='mt-2 text-left'>
                      {selectedFiles.map((file, index) => (
                          <li
                              key={index}
                              className='border p-2 rounded my-1 flex justify-between'
                          >
                              <span>{file.name}</span>
                              <button
                                  onClick={() =>
                                      setSelectedFiles((files) =>
                                          files.filter((_, i) => i !== index)
                                      )
                                  }
                                  className='text-red-500'
                              >
                                  Remove
                              </button>
                          </li>
                      ))}
                  </ul>

                  {previewPages.length > 0 && (
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
                          {previewPages.map((pages, fileIndex) =>
                              pages.map((img, pageIndex) => (
                                  <div
                                      key={`${fileIndex}-${pageIndex}`}
                                      className='relative border rounded shadow'
                                  >
                                      <img
                                          src={img}
                                          alt={`Page ${pageIndex + 1}`}
                                          className='w-full'
                                      />
                                      <div className='absolute top-1 left-1 bg-white text-xs px-1 rounded'>
                                          Page {pageIndex + 1}
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  )}

                  {/* Split Button */}
                  <button className='mt-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition'>
                      Split PDFs
                  </button>
              </div>
          )}

          {isLoading && (
              <div className='mt-4'>
                  <p>Loading...</p>
              </div>
          )}
      </div>
  );
};

export default SplitPDF;
