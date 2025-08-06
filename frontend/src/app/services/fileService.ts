import axios from "axios";
import { supabase } from "../util/supabaseClient";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const getAccessToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("User is not authenticated");
  }
  return session.access_token;
};

export const fetchFileListFromServer = async () => {
  try {
    const accessToken = await getAccessToken();

    const res = await axios.get(`${BACKEND_URL}/getFiles`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.files || [];
  } catch (error) {
    console.error("Error fetching file list", error);
    throw error;
  }
};

export const downloadFileFromServer = async (fileName: string) => {
  try {
    const accessToken = await getAccessToken();

    const res = await axios.get(`${BACKEND_URL}/download`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        file: fileName,
      },
      responseType: "blob",
    });
    if (res.status !== 200) {
      throw new Error("Failed to download file");
    }
    // Create a URL for the blob and trigger download
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file", error);
    throw error;
  }
};

export const deleteFileFromServer = async (fileName: string) => {
  try {
    const accessToken = await getAccessToken();

    const res = await axios.delete(`${BACKEND_URL}/delete/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        file: fileName,
      },
    });
    return res.status === 200;
  } catch (error) {
    console.error("Error deleting file", error);
    throw error;
  }
};

export const uploadFileToServer = async (file: File) => {
  try {
    const accessToken = await getAccessToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${BACKEND_URL}/upload/`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("File uploaded successfully:", res.data);

    return res.data;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};
