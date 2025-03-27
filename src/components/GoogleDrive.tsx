import React, { useState, useEffect } from "react";
import { loadGAPIClient, signInWithGoogle, uploadFileToGoogleDrive } from "../utils/googleDrive";


const GooglDrive = () => {
  const [authToken, setAuhToken] = useState<string | null>(null);

  useEffect(() => {
    loadGAPIClient();
  }, []);

  const handleSignIn = async () => {
    const token = await signInWithGoogle();
    setAuhToken(token);
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!authToken) {
      return console.error("User not authenticated");
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedFile = uploadFileToGoogleDrive(file, authToken);
    console.log("Uploaded file", uploadedFile);
  }

  return (
    <div className="flex flex-col items-center">
      {!authToken ? (
        <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign in with Google
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <input type="file" onChange={handleFileUpload} className="my-4" />
          <button onClick={() => setAuhToken(null)} className="bg-red-500 text-white px-4 py-2 rounded">
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default GooglDrive;
