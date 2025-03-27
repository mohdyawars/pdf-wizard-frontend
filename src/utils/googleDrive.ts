const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPE = "https://www.googleapis.com/auth/drive.readonly";

let tokenClient: google.accounts.oauth2.TokenClient | null = null;

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

// Comprehensive initialization of all required Google APIs
export const initializeGoogleAPIs = async (): Promise<void> => {
  try {
    // Load Google Identity Services
    const gisPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });

    // Load Google API client
    const gapiPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.gapi.load("client", () => {
          resolve();
        });
      };
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });

    // Wait for both APIs to load
    await Promise.all([gisPromise, gapiPromise]);

    // Load the picker API
    return new Promise((resolve, reject) => {
      window.gapi.load("picker", {
        callback: resolve,
        onerror: reject
      });
    });
  } catch (error) {
    console.error("Failed to initialize Google APIs:", error);
    throw error;
  }
};

// Get OAuth token for Google Drive access
export const getGoogleDriveToken = async (): Promise<string> => {
  try {
    if (!window.google || !window.google.accounts) {
      throw new Error("Google accounts API not loaded.");
    }

    return new Promise((resolve, reject) => {
      if (!tokenClient) {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          callback: (response: any) => {
            if (response.error) {
              console.error("Google Sign-in error:", response.error);
              reject(new Error(response.error));
            } else {
              resolve(response.access_token);
            }
          },
        });
      }

      // Use an empty prompt to avoid showing the consent screen if the user has already granted permissions
      // tokenClient.requestAccessToken({ prompt: "" });
    });
  } catch (error) {
    console.error("Error getting Google Drive token:", error);
    throw error;
  }
};

// Main function to open the Google Drive picker
export const openGoogleDrivePicker = async (): Promise<any> => {
  try {
    // Make sure all APIs are properly loaded
    await initializeGoogleAPIs();

    // Get an OAuth token
    const accessToken = await getGoogleDriveToken();

    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.picker) {
        reject(new Error("Google Picker API is not loaded."));
        return;
      }

      // Create a file view
      const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
      view.setMimeTypes("application/vnd.google-apps.file,application/vnd.google-apps.document,application/vnd.google-apps.spreadsheet,application/pdf");

      // Create and configure the picker
      const picker = new window.google.picker.PickerBuilder()
        .setAppId(CLIENT_ID.split('-')[0]) // Extract the app ID from the client ID
        .setOAuthToken(accessToken)
        .setDeveloperKey(API_KEY)
        .addView(view)
        .setCallback((data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            resolve(data.docs[0]);
          } else if (data.action === window.google.picker.Action.CANCEL) {
            resolve(null);
          }
        })
        .setOrigin(window.location.protocol + '//' + window.location.host)
        .setSize(800, 600)
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        .build();

      picker.setVisible(true);
    });
  } catch (error) {
    console.error("Error opening Google Drive picker:", error);
    throw error;
  }
};

// Helper function to create a complete integration
export const pickFileFromGoogleDrive = async (): Promise<any> => {
  try {
    // Initialize everything and open picker
    await initializeGoogleAPIs();
    const selectedFile = await openGoogleDrivePicker();

    if (!selectedFile) {
      console.log("No file selected");
      return null;
    }

    console.log("Selected file:", selectedFile);
    return selectedFile;
  } catch (error) {
    console.error("Error picking file from Google Drive:", error);
    throw error;
  }
};
