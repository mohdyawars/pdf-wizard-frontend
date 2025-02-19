import React from 'react';

interface ActionsProps {
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const Actions: React.FC<ActionsProps> = ({ setSelectedFiles }) => {
    return (
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
    );
};

export default Actions;
