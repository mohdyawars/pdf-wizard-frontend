import axios from 'axios';

const API_BASE_URL: string = 'http://127.0.0.1:8000';
console.log('API_BASE_URL:', API_BASE_URL);

export const extractTextFromPdf = async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/pdfs/extract-text/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error extracting text', error);
        throw error;
    }
};
