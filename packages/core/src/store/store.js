import { configureStore } from "@reduxjs/toolkit";
import firestoreReducer from "../slices/firestoreSlice.js";
import storageReducer from "../slices/storageSlice.js";
import { firebaseInstance } from "../firebase/firebase.js";

let store = null;

/**
 * Initializes the Redux store after Firebase is initialized.
 */
export const initializeStore = () => {
  if (!firebaseInstance.db) {
    throw new Error("Firestore has not been initialized yet.");
  }

  store = configureStore({
    reducer: {
      firestore: firestoreReducer,
      storage: storageReducer,
    },
  });

  return store;
};

/**
 * Ensures that the store is initialized before accessing it.
 */
export const getStore = () => {
  if (!store) {
    throw new Error(
      "Redux store has not been initialized. Call initializeStore first."
    );
  }
  return store;
};
