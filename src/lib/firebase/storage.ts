import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";
import { compressImage } from "@/lib/imageUtils";

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

/**
 * Upload an image from a URL (including internal paths like /products/...)
 * Fetches the image, compresses it (MB → KB), and uploads to Firebase Storage
 * Compression maintains visual quality while significantly reducing file size
 */
export const uploadImageFromUrl = async (
  imageUrl: string,
  storagePath: string
): Promise<string> => {
  try {
    // For internal URLs, construct full URL using window.location.origin
    let fullUrl = imageUrl;
    if (imageUrl.startsWith('/')) {
      // This runs client-side, so we can use window.location.origin
      if (typeof window !== 'undefined') {
        fullUrl = `${window.location.origin}${imageUrl}`;
      } else {
        throw new Error('Cannot fetch internal URL on server side');
      }
    }

    // Fetch the image
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    // Get the blob
    const blob = await response.blob();

    // Determine file extension from content type or URL
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = contentType.split('/')[1] || 'jpg';

    // Create a File from the blob
    const filename = `uploaded_${Date.now()}.${extension}`;
    const originalFile = new File([blob], filename, { type: contentType });

    // Log original size
    const originalSizeKB = (originalFile.size / 1024).toFixed(1);
    console.log(`Original image size: ${originalSizeKB}KB`);

    // Compress the image (maintains quality, reduces size from MB to KB)
    // Uses high quality settings to preserve resolution
    const compressedFile = await compressImage(originalFile, {
      maxSizeMB: 0.5, // Target 500KB max
      maxWidthOrHeight: 1600, // Higher resolution to maintain quality
      quality: 0.85, // High quality compression
    });

    // Log compressed size
    const compressedSizeKB = (compressedFile.size / 1024).toFixed(1);
    const reduction = ((1 - compressedFile.size / originalFile.size) * 100).toFixed(0);
    console.log(`Compressed image: ${originalSizeKB}KB → ${compressedSizeKB}KB (${reduction}% reduction)`);

    // Upload compressed file to Firebase Storage
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, compressedFile);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload image from URL');
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error: any) {
    // If object not found, consider it deleted
    if (error.code === 'storage/object-not-found') return;
    throw new Error(error.message || "Failed to delete file");
  }
};

/**
 * Deletes a file from storage using its full download URL
 */
export const deleteFileFromUrl = async (downloadUrl: string): Promise<void> => {
  if (!downloadUrl) return;

  try {
    // Extract path from URL
    // Format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?alt=...
    const baseUrl = "firebasestorage.googleapis.com";
    if (!downloadUrl.includes(baseUrl)) return;

    let path = downloadUrl.split(`${baseUrl}/v0/b/`)[1];
    // Remove bucket name if present in split (it shouldn't be based on above split, but careful of regex)
    // actually split gives: [prefix, bucket/o/path?params] or [prefix, bucketname/o/path...] depending on structure
    // Let's rely on the structure: .../o/[encodedPath]?

    const pathStartIndex = downloadUrl.indexOf("/o/") + 3;
    const pathEndIndex = downloadUrl.indexOf("?");

    if (pathStartIndex < 3) return; // "/o/" not found

    const encodedPath = pathEndIndex !== -1
      ? downloadUrl.substring(pathStartIndex, pathEndIndex)
      : downloadUrl.substring(pathStartIndex);

    const decodedPath = decodeURIComponent(encodedPath);

    await deleteFile(decodedPath);
    console.log(`Deleted file from storage: ${decodedPath}`);
  } catch (error) {
    console.error("Error deleting file from storage:", error);
    // Don't throw, just log. We don't want to break the main flow if cleanup fails.
  }
};




