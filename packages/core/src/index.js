import { initializeStore } from "./store/store.js";

// Functions
import { executeQueries } from "./actions/Queries.js";
import { initializeFirebase } from "./firebase/firebase.js";

// Firebase Initialization Wrapper
let store = null;

/**
 * Initializes Firedux Storage with Firebase.
 * @param {Object} firebaseConfig - Firebase configuration object.
 */
const initializeFiredux = (firebaseConfig) => {
  initializeFirebase(firebaseConfig);
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
