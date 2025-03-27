import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_BUCKET = "pdfwiz";
const REGION = "ap-south-1";
const ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY;
const SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
  }
})

const uploadFile = async (file: File) => {

  if (!file) {
    console.error("No file provided for upload");
    return null;
  }

  try {
    const fileHash = await generateFileHash(file);
    const fileKey = `uploads/${fileHash}_${file.name}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileKey,
      ContentType: file.type
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    console.log("Uploading to:", uploadUrl);

    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });

    console.log("File uploaded successfully!", fileKey);

    return fileKey;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};

// ✅ Function to generate SHA-256 hash of file (ensures uniqueness)
const generateFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join(""); // Convert to hex string
};

export default uploadFile;
