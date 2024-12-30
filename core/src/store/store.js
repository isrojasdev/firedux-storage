import { configureStore } from "@reduxjs/toolkit";

import firestoreReducer from "../slices/firestoreSlice.js";
import storageReducer from "../slices/storageSlice.js";

const store = configureStore({
  reducer: {
    // Define a top-level state field named `firestore`, handled by `firestoreReducer`
    firestore: firestoreReducer,
    storage: storageReducer,
  },
});

export default store;
