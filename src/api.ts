import axios from "axios";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL: string = "http://43.205.239.69:80";

export const extractTextFromPdf = async (file: File) => {
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/pdfs/extract-text/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error extracting text", error);
    throw error;
  }
};

export const extractImagesFromPdf = async (file: File) => {
  const formData = new FormData;
  formData.append("pdf", file);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/pdfs/extract-images/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
