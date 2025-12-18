import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

export const uploadFile = async (
  path: string,
  file: File
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message || "Failed to upload file");
  }
};

export const uploadMultipleFiles = async (
  path: string,
  files: File[]
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      const filePath = `${path}/${Date.now()}_${index}_${file.name}`;
      return uploadFile(filePath, file);
    });
    return await Promise.all(uploadPromises);
  } catch (error: any) {
    throw new Error(error.message || "Failed to upload files");
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete file");
  }
};




