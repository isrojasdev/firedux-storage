import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export let firebaseInstance = {
  app: null,
  // database: null,
  // functions: null,
  // auth: null,
  firestore: null,
};

export const initializeFirebase = (firebaseConfig) => {
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  firebaseInstance = {
    app,
    db,
  };

  return firebaseInstance;
};
