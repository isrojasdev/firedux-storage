import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { firebaseInstance } from "../firebase/firebase.js";

import { buildQuery } from "../utils/buildQueryParameters.js";
import { resolveReferences } from "../utils/resolveReferences.js";

const firestoreAdapter = createEntityAdapter();

const initialState = firestoreAdapter.getInitialState({
  collection: {},
  document: {},
  insert: { status: null },
  update: {},
  status: "idle",
  error: null,
});

// Function to get Firestore instance safely
const getFirestoreInstance = () => {
  if (!firebaseInstance.db) {
    throw new Error("Firestore has not been initialized yet.");
  }

  return firebaseInstance.db;
};

/**
 * Serializes an array of objects by converting nested data into JSON format.
 * @param {Array} array - The array of objects to serialize.
 * @returns {Promise<Array>} - The serialized array.
 */
const serializeObject = async (array) => {
  if (!Array.isArray(array) || array.length === 0) return array;

  let serializedArray = [];

  for (let item of array) {
    let copy = { ...item };

    for (let key in copy) {
      let stringified = JSON.stringify(copy[key]);
      copy[key] = JSON.parse(stringified);
    }

    serializedArray.push(copy);
  }

  return serializedArray;
};

/**
 * Fetches a document from Firestore.
 * @param {Object} params - Parameters for the query.
 * @param {string} params.collectionName - The name of the collection.
 * @param {string} [params.id=null] - The ID of the document to retrieve.
 * @returns {Promise<Object>} - The document data.
 */
export const getDocument = createAsyncThunk(
  "firestore/getDocument",
  async ({ collectionName, id = null }) => {
    try {
      const db = getFirestoreInstance();
      const snapShot = await db.collection(collectionName).doc(id).get();
      return { ...snapShot.data(), id: snapShot.id };
    } catch (error) {
      console.error(error);
      return { error, status: "failed" };
    }
  }
);

/**
 * Fetches all documents from a Firestore collection with optional filters.
 * @param {Object} params - Query parameters.
 * @param {string} params.collectionName - The name of the collection.
 * @param {Array|null} [params.whereCondition=false] - A condition for filtering the collection.
 * @param {number|boolean} [params.limitCondition=false] - Maximum number of documents (optional).
 * @param {Array|boolean} [params.orderByCondition=false] - Ordering condition [field, direction] (optional).
 * @param {Array} keyReference - Array of reference fields that need to be resolved (optional).
 * @returns {Promise<Array>} - Array of documents.
 */
export const getCollection = createAsyncThunk(
  "firestore/getCollection",
  async ({
    collectionName,
    whereCondition = false,
    limitCondition = false,
    orderByCondition = false,
    storeAs = false,
    keyReference = [],
  }) => {
    let data = [];

    try {
      const db = getFirestoreInstance();
      const q = buildQuery(
        db,
        collectionName,
        whereCondition,
        limitCondition,
        orderByCondition
      );

      const querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        let documentData = { ...doc.data(), id: doc.id };
        documentData = await resolveReferences(documentData, keyReference);
        data.push(documentData);
      }

      let serialized = await serializeObject(data);
      let name = storeAs || collectionName;

      return { docs: serialized, collectionName: name, whereCondition };
    } catch (error) {
      console.error("🔥 Firestore Fetch Error:", error);
      return { error, status: "failed" };
    }
  }
);

/**
 * Adds a new document to a Firestore collection.
 * @param {Object} params - Query parameters.
 * @param {string} params.collectionName - The name of the collection.
 * @param {Object} params.state - The document data.
 * @returns {Promise<Object>} - The added document reference.
 */
export const setDocument = createAsyncThunk(
  "firestore/setDocument",
  async ({ collectionName, state }) => {
    try {
      const db = getFirestoreInstance();

      const newDocRef = doc(collection(db, collectionName));
      await setDoc(newDocRef, state);

      return { id: newDocRef.id, ...state };
    } catch (error) {
      console.error(error);
      return { error, status: "failed" };
    }
  }
);

/**
 * Deletes a document from a Firestore collection.
 * @param {Object} params - Query parameters.
 * @param {string} params.collectionName - The name of the collection.
 * @param {string} params.id - The ID of the document to delete.
 * @returns {Promise<boolean>} - True if successful.
 */
export const deleteDocument = createAsyncThunk(
  "firestore/deleteDocument",
  async ({ collectionName, id }) => {
    try {
      const db = getFirestoreInstance();
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (error) {
      console.error(error);
      return { error, status: "failed" };
    }
  }
);

/**
 * Updates a document in a Firestore collection.
 * @param {Object} params - Query parameters.
 * @param {string} params.collectionName - The name of the collection.
 * @param {string} params.id - The ID of the document to update.
 * @param {Object} params.state - The updated document data.
 * @returns {Promise<boolean>} - True if successful.
 */
export const editDocument = createAsyncThunk(
  "firestore/editDocument",
  async ({ collectionName, id, state }) => {
    try {
      const db = getFirestoreInstance();
      await updateDoc(doc(db, collectionName, id), state);
      return true;
    } catch (error) {
      console.error(error);
      return { error, status: "failed" };
    }
  }
);

/**
 * Fetches a Firestore collection in real-time.
 * @param {Object} params - Query parameters.
 * @param {Array} params.docs - The documents to process.
 * @param {string} params.collectionName - The name of the collection.
 * @param {Array|null} [params.whereCondition] - A filtering condition.
 * @param {string|null} [params.storeAs] - Optional alias for storing data.
 * @returns {Promise<Object>} - The serialized collection data.
 */
export const getCollectionRealTime = createAsyncThunk(
  "firestore/getCollectionRealTime",
  async ({ docs, collectionName, whereCondition, storeAs }) => {
    try {
      let serialized = await serializeObject(docs);
      let name = storeAs || collectionName;

      return { docs: serialized, collectionName: name, whereCondition };
    } catch (error) {
      console.error(error);
      return { error, status: "failed" };
    }
  }
);

const firestoreSlice = createSlice({
  name: "firestore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDocument.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDocument.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.document = action.payload;
      })
      .addCase(getDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getCollection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCollection.fulfilled, (state, action) => {
        state.status = "succeeded";
        const storeKey =
          action.meta.arg.storeAs || action.meta.arg.collectionName;
        state.collection[storeKey] = action.payload;
      })
      .addCase(getCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getCollectionRealTime.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCollectionRealTime.fulfilled, (state, action) => {
        state.status = "succeeded";
        const storeKey =
          action.meta.arg.storeAs || action.meta.arg.collectionName;
        state.collection[storeKey] = action.payload;
      })
      .addCase(getCollectionRealTime.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(setDocument.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setDocument.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.insert = action.payload;
      })
      .addCase(setDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteDocument.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDocument.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(editDocument.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editDocument.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.update = action.payload;
      })
      .addCase(editDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default firestoreSlice.reducer;
