import {
  getDocument,
  getCollection,
  setDocument,
  deleteDocument,
  editDocument,
} from "../slices/firestoreSlice.js";

import { getStore } from "../store/store.js";

/**
 * Retrieve a single document from Firestore
 * @param {string} collectionName - The name of the collection
 * @param {string} id - The ID of the document to retrieve
 * @returns {Promise<Object>} The retrieved document data
 */
export const getDocumentById = async ({ collectionName, id }) => {
  try {
    const store = getStore();
    const res = await store.dispatch(
      getDocument({
        collectionName,
        id,
      })
    );

    return res.payload;
  } catch (error) {
    console.error("Error fetching document:", error);
    return { error, status: "failed" };
  }
};

/**
 * Retrieve a collection from Firestore
 * @param {string} collectionName - The name of the collection
 * @param {Array|boolean} [whereCondition=false] - Optional query condition
 * @param {number|boolean} [limitCondition=false] - Maximum number of documents (optional).
 * @param {Array|boolean} [orderByCondition=false] - Ordering condition [field, direction] (optional).
 * @param {String|boolean} [storeAs=false] - Optional name save in state (optional).
 * @param {Array|boolean} [keyReference=false] - Key refernece in te internal document [keyReference] (optional).
 * @returns {Promise<Array>} Array of documents in the collection
 */
export const getCollectionData = async (
  collectionName,
  whereCondition = false,
  limitCondition = false,
  orderByCondition = false,
  storeAs = false,
  keyReference = []
) => {
  try {
    const store = getStore();

    // Dispatch the action to fetch the collection
    const res = await store.dispatch(
      getCollection({
        collectionName,
        whereCondition,
        limitCondition,
        orderByCondition,
        storeAs,
        keyReference,
      })
    );

    return res.payload;
  } catch (error) {
    console.error("🔥 Error fetching collection:", error);
    return { error, status: "failed" };
  }
};

/**
 * Add a new document to a Firestore collection
 * @param {string} collectionName - The name of the collection
 * @param {Object} state - The document data to insert
 * @returns {Promise<Object>} The inserted document reference
 */
export const addDocument = async ({ collectionName, state }) => {
  try {
    const store = getStore();
    const res = await store.dispatch(
      setDocument({
        collectionName,
        state,
      })
    );

    return res.payload;
  } catch (error) {
    console.error("Error adding document:", error);
    return { error, status: "failed" };
  }
};

/**
 * Delete a document from a Firestore collection
 * @param {string} collectionName - The name of the collection
 * @param {string} id - The ID of the document to delete
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const removeDocument = async ({ collectionName, id }) => {
  try {
    const store = getStore();
    const res = await store.dispatch(
      deleteDocument({
        collectionName,
        id,
      })
    );

    return res.payload;
  } catch (error) {
    console.error("Error deleting document:", error);
    return { error, status: "failed" };
  }
};

/**
 * Update an existing document in a Firestore collection
 * @param {string} collectionName - The name of the collection
 * @param {string} id - The ID of the document to update
 * @param {Object} state - The updated data for the document
 * @returns {Promise<boolean>} True if updated successfully
 */
export const updateDocument = async ({ collectionName, id, state }) => {
  try {
    const store = getStore();
    const res = await store.dispatch(
      editDocument({
        collectionName,
        id,
        state,
      })
    );

    return res.payload;
  } catch (error) {
    console.error("Error updating document:", error);
    return { error, status: "failed" };
  }
};
