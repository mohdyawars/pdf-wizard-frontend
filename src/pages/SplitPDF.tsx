import { useState } from "react";
// import { initializeGoogleAPIs, pickFileFromGoogleDrive } from "../utils/googleDrive";
import { renderPdfPages } from "../utils/pdfPreview";
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import Alert from '../components/Alert';



// Spinner component
const Spinner = () => (
  <div className='flex justify-center items-center'>
    <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600'></div>
  </div>
);

// Define a more specific type for splitResultPages
interface SplitResultPage {
  url: string;
}

const SplitPDF = () => {
  // const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewPages, setPreviewPages] = useState<string[][]>([]);
  const [splitMode, setSplitMode] = useState<'range' | 'pages'>('range');
  const [pageRanges, setPageRanges] = useState<string>('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [splitResultPages, setSplitResultPages] = useState<SplitResultPage[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);


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
      setIsLoading(true);
      const fileArray = Array.from(files);

      // Check for non-PDF files
      const nonPdfFiles = fileArray.filter(file => file.type !== 'application/pdf');
      if (nonPdfFiles.length > 0) {
        setAlertMessage('Please upload only PDF files.');
        setIsLoading(false);
        return;
      }

      setSelectedFiles(prev => [...prev, ...fileArray]);

      const previews = await Promise.all(fileArray.map(file => renderPdfPages(file)));
      setPreviewPages(prev => [...prev, ...previews]);
      setIsLoading(false);
    }
  };

  const handleSplitAndPrepareDownload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file first');
      return;
    }

    setIsLoading(true);
    try {
      const file = selectedFiles[0];
      const pdfData = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfData);
      const zip = new JSZip();

      if (splitMode === 'range') {
        const mergedPdf = await PDFDocument.create();
        const [start, end] = pageRanges.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          const [copiedPage] = await mergedPdf.copyPages(pdfDoc, [i - 1]);
          mergedPdf.addPage(copiedPage);
        }
        const mergedPdfBytes = await mergedPdf.save();
        zip.file('merged.pdf', mergedPdfBytes);
      } else {
        for (const pageIndex of selectedPages) {
          const singlePagePdf = await PDFDocument.create();
          const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [pageIndex - 1]);
          singlePagePdf.addPage(copiedPage);
          const singlePagePdfBytes = await singlePagePdf.save();
          zip.file(`page_${pageIndex}.pdf`, singlePagePdfBytes);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      setSplitResultPages([{ url }]);
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert('Failed to split PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update preview selection logic
  const handlePreviewSelect = (index: number) => {
    setSelectedPages((prev) =>
      prev.includes(index + 1)
        ? prev.filter((p) => p !== index + 1)
        : [...prev, index + 1]
    );
  };

  return (
      <div className='flex flex-col md:flex-row min-h-screen'>
          {/* Left Sidebar - Split Options */}
          <div className='w-full md:w-1/4 bg-gray-100 p-4 md:p-6 border-b md:border-b-0 md:border-r'>
              <h2 className='text-lg md:text-xl font-semibold mb-4'>
                  Split Options
              </h2>

              {/* Split Mode Selection */}
              <div className='mb-6'>
                  <label className='block text-sm font-medium mb-2'>
                      Split Mode
                  </label>
                  <div className='flex space-x-4'>
                      <button
                          className={`px-4 py-2 rounded text-sm ${
                              splitMode === 'range'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200'
                          }`}
                          onClick={() => setSplitMode('range')}
                      >
                          Range
                      </button>
                      <button
                          className={`px-4 py-2 rounded text-sm ${
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
              {/* {splitMode === 'pages' && (
                  <div className='mb-6'>
                      <label className='block text-sm font-medium mb-2'>
                          Select Pages
                      </label>
                      <div className='grid grid-cols-4 sm:grid-cols-6 gap-2'>
                          {previewPages[0]?.map((_, index) => (
                              <button
                                  key={index}
                                  className={`p-2 border rounded text-sm ${
                                      selectedPages.includes(index + 1)
                                          ? 'bg-green-600 text-white'
                                          : 'bg-white'
                                  }`}
                                  onClick={() => handlePreviewSelect(index)}
                              >
                                  {index + 1}
                              </button>
                          ))}
                      </div>
                  </div>
              )} */}

              {/* Display Selected Range or Pages */}
              <div className='mb-6 border-dashed border-2 border-gray-300 p-4'>
                  <h3 className='text-lg font-semibold mb-2'>Range 1</h3>
                  <div className='flex flex-wrap gap-2'>
                      {splitMode === 'range' ? (
                          <p className='text-sm text-gray-700'>
                              {pageRanges
                                  ? `Page ${pageRanges.replace(
                                        '-',
                                        ' - Page '
                                    )}`
                                  : 'No range selected'}
                          </p>
                      ) : (
                          <>
                              {selectedPages.length > 0 ? (
                                  selectedPages.map((page, index) => (
                                      <span
                                          key={index}
                                          className='p-2 border rounded text-sm bg-gray-200'
                                      >
                                          Page {page}
                                      </span>
                                  ))
                              ) : (
                                  <p className='text-sm text-gray-700'>
                                      No pages selected
                                  </p>
                              )}
                          </>
                      )}
                  </div>
              </div>

              {/* Split Button */}
              <button
                  onClick={handleSplitAndPrepareDownload}
                  disabled={isLoading}
                  className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                  {isLoading ? 'Splitting...' : 'Split PDF'}
              </button>

              {/* Merge Button */}
              {/* <button
                  onClick={handleMerge}
                  disabled={isLoading || splitMode !== 'range' || !pageRanges}
                  className={`w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 mt-4 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                  {isLoading ? 'Merging...' : 'Merge PDF'}
              </button> */}

              {/* Download Zip Button */}
              {splitResultPages.length > 0 && (
                  <button
                      onClick={() => {
                          const a = document.createElement('a');
                          a.href = splitResultPages[0].url;
                          a.download = 'merged_pdfs.zip';
                          a.click();
                          URL.revokeObjectURL(splitResultPages[0].url);
                      }}
                      className='w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 mt-4'
                  >
                      Download as Zip
                  </button>
              )}

          </div>

          {/* Right Side - File Upload and Preview */}
          <div className='flex-1 p-4 md:p-6 overflow-auto'>
              <h1 className='text-2xl md:text-4xl font-bold mb-4'>
                  Split PDF files
              </h1>
              <p className='text-base md:text-lg text-gray-600 mb-6'>
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
              {isLoading ? (
                  <Spinner />
              ) : (
                  previewPages.length > 0 && (
                      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                          {splitMode === 'range' ? (
                              <>
                                  <div className='border rounded p-2'>
                                      <img
                                          src={previewPages[0][0]}
                                          alt='Page 1'
                                          className='w-full h-52 object-contain'
                                      />
                                      <p className='text-center mt-2 text-sm'>
                                          Page 1
                                      </p>
                                  </div>
                                  <div className='flex justify-center items-center'>
                                      <span className='text-gray-500'>
                                          -----
                                      </span>
                                  </div>
                                  <div className='border rounded p-2'>
                                      <img
                                          src={
                                              previewPages[0][
                                                  previewPages[0].length - 1
                                              ]
                                          }
                                          alt={`Page ${previewPages[0].length}`}
                                          className='w-full h-52 object-contain'
                                      />
                                      <p className='text-center mt-2 text-sm'>
                                          Page {previewPages[0].length}
                                      </p>
                                  </div>
                              </>
                          ) : (
                              previewPages[0]?.map((img, index) => (
                                  <div
                                      key={index}
                                      onClick={() => handlePreviewSelect(index)}
                                      className={`relative border rounded p-2 cursor-pointer transition ${
                                          selectedPages.includes(index + 1)
                                              ? 'border-green-500 ring-2 ring-green-500'
                                              : 'hover:border-blue-400'
                                      }`}
                                  >
                                      <img
                                          src={img}
                                          alt={`Page ${index + 1}`}
                                          className='w-full h-52 object-contain'
                                      />
                                      <p className='text-center-2 text-sm'>
                                          Page {index + 1}
                                      </p>

                                      {selectedPages.includes(index + 1) && (
                                          <div className='absolute top-1 left-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded shadow'>
                                              ✓
                                          </div>
                                      )}
                                  </div>
                              ))
                          )}
                      </div>
                  )
              )}

              {/* Split Result Section */}
              {/* {splitMode === 'pages' && splitResultPages.length > 0 && (
                  <div className='mt-10'>
                      <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                          Split Results
                      </h2>
                      <ul className='space-y-3'>
                          {splitResultPages.map((page, index) => (
                              <li
                                  key={index}
                                  className='flex flex-col sm:flex-row justify-between items-start sm:items-center border p-3 rounded shadow-sm'
                              >
                                  <span className='mb-2 sm:mb-0'>
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
              )} */}
          </div>
          {alertMessage && <Alert message={alertMessage} type="error" onClose={() => setAlertMessage(null)} />}
      </div>
  );
};

export default SplitPDF;
