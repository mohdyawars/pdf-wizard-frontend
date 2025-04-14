import { useState, useEffect } from "react";
// import { FaGoogleDrive } from "react-icons/fa";
import { initializeGoogleAPIs } from "../utils/googleDrive";
import Alert from '../components/Alert';
import { renderPdfPages } from '../utils/pdfPreview';
import { API_BASE_URL, compressPdf } from '../api';
// import { FaGoogleDrive } from "react-icons/fa";

const CompressPDF = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [previewPages, setPreviewPages] = useState<string[][]>([]);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Google APIs when the component mounts
    const loadApis = async () => {
      try {
        await initializeGoogleAPIs();
      } catch (error) {
        console.error("Failed to load Google APIs:", error);
      }
    };

    loadApis();
  }, []);

  const handleLocalFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Check for non-PDF files
      const nonPdfFiles = fileArray.filter(file => file.type !== 'application/pdf');
      if (nonPdfFiles.length > 0) {
        setAlertMessage('Please upload only PDF files.');
        return;
      }

      setSelectedFiles(prev => [...prev, ...fileArray]);

      const previews = await Promise.all(fileArray.map(file => renderPdfPages(file)));
      setPreviewPages(prev => [...prev, ...previews]);
    }
  };

  const handleCompressPDF = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file first');
      return;
    }

    setIsLoading(true);
    try {
      const file = selectedFiles[0];
      const response = await compressPdf(file);

      // Extract the URL from the new response format
      const url = `${API_BASE_URL}/${response.data.url}`;
      setCompressedPdfUrl(url);
    } catch (error) {
      console.error('Error compressing PDF:', error);
      alert('Failed to compress PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className='flex flex-col md:flex-row min-h-screen'>
          <div className='w-full md:w-1/4 bg-gray-100 p-4 md:p-6 border-b md:border-b-0 md:border-r'>
              <h2 className='text-lg md:text-xl font-semibold mb-4'>
                  Compress Options
              </h2>

              {/* Compression Level Selection */}
              <div className='mb-6'>
                  <label className='block text-sm font-medium mb-2'>
                      Compression Level
                  </label>
                  <div className='flex space-x-4'>
                      <label className='flex items-center'>
                          <input
                              type='radio'
                              name='compressionLevel'
                              value='low'
                              className='form-radio'
                          />
                          <span className='ml-2'>Low</span>
                      </label>
                      <label className='flex items-center'>
                          <input
                              type='radio'
                              name='compressionLevel'
                              value='medium'
                              className='form-radio'
                          />
                          <span className='ml-2'>Medium</span>
                      </label>
                      <label className='flex items-center'>
                          <input
                              type='radio'
                              name='compressionLevel'
                              value='high'
                              className='form-radio'
                          />
                          <span className='ml-2'>High</span>
                      </label>
                  </div>
              </div>

              {/* Google Drive Upload
              <button
                  onClick={handleGoogleDriveUpload}
                  disabled={!isGoogleLoaded || isLoading}
                  className={`text-gray-600 hover:text-gray-900 transition ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                  <FaGoogleDrive className='text-4xl' />
              </button> */}

              {/* Compress Button */}
              {selectedFiles.length > 0 && (
                  <button
                      onClick={handleCompressPDF}
                      disabled={isLoading}
                      className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4 ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                      {isLoading ? 'Compressing...' : 'Compress PDF'}
                  </button>
              )}

              {/* Download button for compressed PDF */}
              {compressedPdfUrl && (
                  <a
                      href={compressedPdfUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 mt-4 block text-center'
                  >
                      Download Compressed PDF
                  </a>
              )}
          </div>

          <div className='flex-1 p-4 md:p-6 overflow-auto'>
              <h1 className='text-2xl md:text-4xl font-bold mb-4'>
                  Compress PDF files
              </h1>
              <p className='text-base md:text-lg text-gray-600 mb-6'>
                  Effortlessly reduce the size of your PDF files while
                  maintaining quality with just a few clicks.
              </p>

              {/* File Upload Section */}
              <div className='mb-6'>
                  <label className='bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer shadow-md hover:bg-blue-700 transition inline-block'>
                      Select PDF files
                      <input
                          type='file'
                          accept='.pdf'
                          multiple
                          className='hidden'
                          onChange={handleLocalFileUpload}
                      />
                  </label>
              </div>


              {/* Preview Section */}
              {previewPages.length > 0 && (
                  <div className='relative border rounded p-2'>
                      <img
                          src={previewPages[0][0]}
                          alt='Page 1'
                          className='w-full h-52 object-contain'
                      />
                      <div className='absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition-opacity'>
                          <p>Size: {(selectedFiles[0].size / 1024).toFixed(2)} KB</p>
                          <p>Pages: {previewPages[0].length}</p>
                      </div>
                  </div>
              )}
          </div>

          {alertMessage && (
              <Alert
                  message={alertMessage}
                  type='error'
                  onClose={() => setAlertMessage(null)}
              />
          )}
      </div>
  );
};

export default CompressPDF;
