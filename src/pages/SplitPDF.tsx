import { useState } from "react";
// import { initializeGoogleAPIs, pickFileFromGoogleDrive } from "../utils/googleDrive";
import { renderPdfPages } from "../utils/pdfPreview";
import { splitPdf } from "../api";


const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

const SplitPDF = () => {
  // const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewPages, setPreviewPages] = useState<string[][]>([]);
  const [splitMode, setSplitMode] = useState<'range' | 'pages'>('range');
  const [pageRanges, setPageRanges] = useState<string>('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [splitResultPages, setSplitResultPages] = useState<any[]>([]);


  // useEffect(() => {
  //   const loadApis = async () => {
  //     try {
  //       await initializeGoogleAPIs();
  //       // setIsGoogleLoaded(true);
  //     } catch (error) {
  //       console.error("Failed to load Google APIs:", error);
  //     }
  //   };

  //   loadApis();
  // }, []);

  // const handleGoogleDriveUpload = async () => {
  //   if (!isGoogleLoaded) {
  //     console.error("Google API not loaded");
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     const selectedFile = await pickFileFromGoogleDrive();

  //     if (selectedFile) {
  //       // Add the selected file to your list
  //       setSelectedFiles(prev => [...prev, selectedFile]);
  //       console.log("Selected file from Google Drive:", selectedFile);
  //     }
  //   } catch (error) {
  //     console.error("Google Drive file selection failed:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLocalFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);

      const previews = await Promise.all(fileArray.map(file => renderPdfPages(file)));
      setPreviewPages(prev => [...prev, ...previews]);
    }
  };

  const handleSplit = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file first');
      return;
    }

    if (splitMode === 'range') {
      // Validate page range format
      const range = pageRanges.split('-');
      if (range.length !== 2 || isNaN(Number(range[0])) || isNaN(Number(range[1]))) {
        alert('Please enter a valid page range (e.g., 1-3)');
        return;
      }
    }

    setIsLoading(true);
    try {
      const file = selectedFiles[0];
      let result;

      if (splitMode === 'range') {
        const [start, end] = pageRanges.split('-').map(Number);
        result = await splitPdf(file, start, end);

      } else {
        // For individual page selection, use min and max of selected pages
        const start = Math.min(...selectedPages);
        const end = Math.max(...selectedPages);
        result = await splitPdf(file, start, end);
      }

      if (result?.data?.pages) {
        console.log('Split pages:', result.data.pages);
        setSplitResultPages(result.data.pages);
      
        // Optionally auto-open in new tab
        // result.data.pages.forEach((page: any) => {
        //   window.open(page.url, '_blank');
        // });
      }
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert('Failed to split PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className='flex h-screen'>
          {/* Left Sidebar - Split Options */}
          <div className='w-1/4 bg-gray-100 p-6 border-r'>
              <h2 className='text-xl font-semibold mb-4'>Split Options</h2>

              {/* Split Mode Selection */}
              <div className='mb-6'>
                  <label className='block text-sm font-medium mb-2'>
                      Split Mode
                  </label>
                  <div className='flex space-x-4'>
                      <button
                          className={`px-4 py-2 rounded ${
                              splitMode === 'range'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200'
                          }`}
                          onClick={() => setSplitMode('range')}
                      >
                          Range
                      </button>
                      <button
                          className={`px-4 py-2 rounded ${
                              splitMode === 'pages'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200'
                          }`}
                          onClick={() => setSplitMode('pages')}
                      >
                          Pages
                      </button>
                  </div>
              </div>

              {/* Range Input */}
              {splitMode === 'range' && (
                  <div className='mb-6'>
                      <label className='block text-sm font-medium mb-2'>
                          Page Ranges
                      </label>
                      <input
                          type='text'
                          value={pageRanges}
                          onChange={(e) => setPageRanges(e.target.value)}
                          placeholder='e.g., 1-3,5,7-9'
                          className='w-full p-2 border rounded'
                      />
                      <p className='text-xs text-gray-500 mt-1'>
                          Enter page ranges separated by commas (e.g.,
                          1-3,5,7-9)
                      </p>
                  </div>
              )}

              {/* Page Selection */}
              {splitMode === 'pages' && (
                  <div className='mb-6'>
                      <label className='block text-sm font-medium mb-2'>
                          Select Pages
                      </label>
                      <div className='grid grid-cols-4 gap-2'>
                          {previewPages[0]?.map((_, index) => (
                              <button
                                  key={index}
                                  className={`p-2 border rounded ${
                                      selectedPages.includes(index + 1)
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-white'
                                  }`}
                                  onClick={() => {
                                      setSelectedPages((prev) =>
                                          prev.includes(index + 1)
                                              ? prev.filter(
                                                    (p) => p !== index + 1
                                                )
                                              : [...prev, index + 1]
                                      );
                                  }}
                              >
                                  {index + 1}
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              {/* Split Button */}
              <button
                  onClick={handleSplit}
                  disabled={isLoading}
                  className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                  {isLoading ? 'Splitting...' : 'Split PDF'}
              </button>
          </div>

          {/* Right Side - File Upload and Preview */}
          <div className='flex-1 p-6 overflow-auto'>
              <h1 className='text-4xl font-bold mb-4'>Split PDF files</h1>
              <p className='text-lg text-gray-600 mb-6'>
                  Effortlessly split a large PDF into multiple smaller files
                  with just a few clicks.
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
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      {previewPages[0]?.map((img, index) => (
                          <div key={index} className='border rounded p-2'>
                              <img
                                  src={img}
                                  alt={`Page ${index + 1}`}
                                  className='w-full'
                              />
                              <p className='text-center mt-2'>
                                  Page {index + 1}
                              </p>
                          </div>
                      ))}
                  </div>
              )}

              {/* Split Result Section */}
              {splitResultPages.length > 0 && (
                  <div className='mt-10'>
                      <h2 className='text-2xl font-semibold mb-4'>
                          Split Results
                      </h2>
                      <ul className='space-y-3'>
                          {splitResultPages.map((page, index) => (
                              <li
                                  key={index}
                                  className='flex justify-between items-center border p-3 rounded shadow-sm'
                              >
                                  <span>
                                      Page {page.page_number} - {page.filename}
                                  </span>
                                  <a
                                      href={`${API_BASE_URL}${page.url}`}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition'
                                  >
                                      View in New Tab
                                  </a>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
          </div>
      </div>
  );
};

export default SplitPDF;
