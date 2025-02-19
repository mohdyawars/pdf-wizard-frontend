import React from 'react';

interface FileUploadProps {
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedFiles: File[];
}

const FileUpload: React.FC<FileUploadProps> = ({
    handleFileUpload,
    selectedFiles,
}) => {
    return (
        <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg'>
            <label className='w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'>
                <input
                    type='file'
                    multiple
                    className='hidden'
                    onChange={handleFileUpload}
                />
                <p className='text-gray-600'>
                    Click to upload PDF or drag & drop
                </p>
            </label>

            {selectedFiles.length > 0 && (
                <div className='mt-4'>
                    <h3 className='text-gray-700 font-semibold'>
                        Selected Files:
                    </h3>
                    <ul className='list-disc list-inside text-gray-600'>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
