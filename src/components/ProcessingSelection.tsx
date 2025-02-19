import React from 'react';

interface ProcessingSelectionProps {
    selectedFeature: string;
}

const ProcessingSelection: React.FC<ProcessingSelectionProps> = ({
    selectedFeature,
}) => {
    return (
        <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-6'>
            {selectedFeature === 'text' && (
                <p className='text-gray-700'>
                    📜 Extracted text will appear here...
                </p>
            )}
            {selectedFeature === 'images' && (
                <p className='text-gray-700'>
                    🖼 Extracted images will be shown here...
                </p>
            )}
            {selectedFeature === 'merge' && (
                <p className='text-gray-700'>
                    📂 Arrange and merge PDFs here...
                </p>
            )}
        </div>
    );
};

export default ProcessingSelection;
