import { useState } from 'react';
import Hero from './Hero';
import FileUpload from './FileUpload';
import FeatureSelection from './FeatureSelection';
import ProcessingSelection from './ProcessingSelection';

const Pdfwizard = () => {
    const [selectedFeature, setSelectedFeature] = useState('text');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Handle file selection
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
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
                selectedFeature='text'
                setSelectedFeature={setSelectedFeature}
            />

            <ProcessingSelection selectedFeature={selectedFeature} />

            {/* Actions */}
            <div className='mt-6 flex space-x-4'>
                <button className='px-4 py-2 bg-green-600 text-white rounded-md'>
                    Download
                </button>
                <button
                    className='px-4 py-2 bg-red-600 text-white rounded-md'
                    onClick={() => setSelectedFiles([])}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Pdfwizard;
