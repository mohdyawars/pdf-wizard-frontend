import { useState } from 'react';
import Hero from './Hero';
import FileUpload from './FileUpload';
import FeatureSelection from './FeatureSelection';
import ProcessingSelection from './ProcessingSelection';
import Actions from './Actions';
import { extractTextFromPdf } from '../api';

const Pdfwizard = () => {
    const [selectedFeature, setSelectedFeature] = useState('text');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Handle file selection
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    // Handle text extraction
    const handleExtractText = async () => {
        if (selectedFiles.length === 0) {
            alert('Please select a PDF file first.');
            return;
        }

        setLoading(true);
        const result = await extractTextFromPdf(selectedFiles[0]);
        setLoading(false);

        if (result && result.data.status === 'success') {
            const textContent = Object.values(result.data.content).join('\n\n');
            setExtractedText(textContent);
        } else {
            setExtractedText('Failed to extract text.');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
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

            {selectedFeature === 'text' && (
                <button
                    onClick={handleExtractText}
                    disabled={loading}
                    className='px-4 py-2 bg-blue-600 text-white rounded-md mt-4'
                >
                    {loading ? 'Extracting...' : 'Extract Text'}
                </button>
            )}

            <Actions setSelectedFiles={setSelectedFiles} />
        </div>
    );
};

export default Pdfwizard;
