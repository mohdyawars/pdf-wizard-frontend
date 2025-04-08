import axios from "axios";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL: string = "http://43.205.239.69:80";

export const extractTextFromPdf = async (fileKey: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/pdfs/extract-text/`,
      { fileKey: fileKey },
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error extracting text", error);
    throw error;
  }
};

export const extractImagesFromPdf = async (fileKey: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/pdfs/extract-images/`,
      { fileKey: fileKey },
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error extracting images", error);
    throw error;
  }
}

export const mergePdfs = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("pdfs", file);
  });

  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/pdfs/merge/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error merging PDFs:", error);
    throw error;
  }
};

export const splitPdf = async (fileKey: string) => {
  try {
    const formData = new FormData();
    formData.append("fileKey", fileKey);

    const response = await axios.post(`${API_BASE_URL}/api/v1/pdfs/split/`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return response.data;
  } catch (error) {
    console.error("Error splitting PDF:", error);
    throw error;
  }
};

