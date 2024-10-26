import { configureStore } from "@reduxjs/toolkit";

import firestoreReducer from "./Redux/Features/Firestore/firestoreSlice";
import storageReducer from "./Redux/Features/Storage/storageSlice";

const store = configureStore({
  reducer: {
    // Define a top-level state field named `firestore`, handled by `firestoreReducer`
    firestore: firestoreReducer,
    storage: storageReducer,
  },
});

export default store;
