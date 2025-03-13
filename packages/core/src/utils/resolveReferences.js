import { getDoc } from "firebase/firestore";

/**
 * Resolves document references inside Firestore documents.
 * @param {Object} documentData - The document data.
 * @param {Array} keyReference - Array of reference fields to resolve.
 * @returns {Promise<Object>} - The document with resolved references.
 */
export const resolveReferences = async (documentData, keyReference) => {
  if (keyReference.length > 0 && documentData[keyReference]) {
    let references = await Promise.all(
      documentData[keyReference].map(async (ref) => {
        const refDoc = await getDoc(ref);
        return { id: refDoc.id, ...refDoc.data() };
      })
    );

    documentData[keyReference] = references;
  }

  return documentData;
};
