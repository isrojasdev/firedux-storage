// import firebaseConfig from "./firebaseConfig.js";
import app from "firebase/compat/app";
import "firebase/compat/firestore"; // <- needed if using firestore
import "firebase/compat/database"; // < - needed if using firebase (database in eral time)
import "firebase/compat/storage";

export let firebaseInstance = {
  app: null,
  // database: null,
  // functions: null,
  // auth: null,
  firestore: null,
};

export const initializeFirebase = (firebaseConfig) => {
  if (!app.apps.length) {
    app.initializeApp(firebaseConfig);
  }

  // Guarda la instancia de Firebase para su uso posterior
  firebaseInstance = {
    app: app,
    // database: app.database(), // < - needed if using firebase (database in eral time)
    // functions: app.functions(), // <- needed if using functions
    // auth: app.auth(), // <- needed if using auth
    firestore: app.firestore(), // <- needed if using firestore
  };

  return firebaseInstance; // Devuelve la instancia de Firebase
};
