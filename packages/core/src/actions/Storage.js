import { setFile, deleteFile } from "../slices/storageSlice.js";
import { getStore } from "../store/store.js";

/**
 * Upload a file to Firebase Storage.
 * @param {File} file - The file object to upload.
 * @param {string} fileName - Base name for the file (a random suffix is appended).
 * @param {string} folder - Storage folder path.
 * @returns {Promise<string|false>} Download URL on success, false on failure.
 */
export const uploadFile = async ({ file, fileName, folder }) => {
  try {
    const store = getStore();
    const res = await store.dispatch(setFile({ file, name: fileName, folder }));
    return res.payload;
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error, status: "failed" };
  }
};

/**
 * Delete a file from Firebase Storage by its download URL.
 * @param {string} fileUrl - The download URL of the file to delete.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export const removeFile = async ({ fileUrl }) => {
  try {
    const store = getStore();
    const res = await store.dispatch(deleteFile({ urlFile: fileUrl }));
    return res.payload;
  } catch (error) {
    console.error("Error deleting file:", error);
    return { error, status: "failed" };
  }
};
