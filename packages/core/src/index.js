import { initializeStore } from "./store/store.js";

// Functions
import { executeQueries } from "./actions/Queries.js";
import { initializeFirebase } from "./firebase/firebase.js";
import { registerSchemas } from "./schemas/schemaRegistry.js";

export { z } from "zod";

// Firebase Initialization Wrapper
let store = null;

/**
 * @typedef {{ apiKey: string, authDomain: string, projectId: string, storageBucket: string, messagingSenderId: string, appId: string }} FirebaseConfig
 * @typedef {{ schemas?: Record<string, import('zod').ZodTypeAny> }} FireduxOptions
 */

/**
 * Initializes Firedux Storage with Firebase and optional Zod schemas.
 * Must be called once before any `executeQueries` call.
 * @param {FirebaseConfig} firebaseConfig - Firebase project configuration.
 * @param {FireduxOptions} [options={}] - Optional configuration.
 * @returns {void}
 */
const initializeFiredux = (firebaseConfig, options = {}) => {
  initializeFirebase(firebaseConfig);
  if (options.schemas) {
    registerSchemas(options.schemas);
  }
  store = initializeStore();
};

const FireduxStorage = {
  executeQueries,
  initializeFiredux,
  get store() {
    if (!store) {
      throw new Error(
        "Firedux store has not been initialized. Call initializeFiredux first."
      );
    }
    return store;
  },
};

export { FireduxStorage, executeQueries, initializeFiredux };
