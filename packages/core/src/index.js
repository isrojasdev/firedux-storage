import { initializeStore } from "./store/store.js";

// Functions
import { executeQueries } from "./actions/Queries.js";
import { initializeFirebase } from "./firebase/firebase.js";
import { registerSchemas } from "./schemas/schemaRegistry.js";

export { z } from "zod";

// Firebase Initialization Wrapper
let store = null;

/**
 * Initializes Firedux Storage with Firebase.
 * @param {Object} firebaseConfig - Firebase configuration object.
 * @param {Object} [options={}] - Optional configuration.
 * @param {Object} [options.schemas] - Zod schemas keyed by collection name.
 */
const initializeFiredux = (firebaseConfig, options = {}) => {
  initializeFirebase(firebaseConfig);
  if (options.schemas) {
    registerSchemas(options.schemas);
  }
  store = initializeStore();
};

// Export Firedux object
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

export default FireduxStorage;
export { executeQueries, initializeFiredux };
