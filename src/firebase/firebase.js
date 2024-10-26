import firebaseConfig from "./firebaseConfig";
import app from "firebase/compat/app";
import "firebase/compat/firestore"; // <- needed if using firestore
import "firebase/compat/database"; // < - needed if using firebase (database in eral time)
import "firebase/compat/storage";

let firebase = {
  app: null,
  // database: null,
  // functions: null,
  // auth: null,
  firestore: null,
};

if (!app.apps.length) {
  app.initializeApp(firebaseConfig);
  firebase = {
    app: app,
    // database: app.database(), // < - needed if using firebase (database in eral time)
    // functions: app.functions(), // <- needed if using functions
    // auth: app.auth(), // <- needed if using auth
    firestore: app.firestore(), // <- needed if using firestore
  };
} else {
  firebase = {
    app: app,
    // database: app.database(), // < - needed if using firebase (database in eral time)
    // functions: app.functions(), // <- needed if using functions
    // auth: app.auth(), // <- needed if using auth
    firestore: app.firestore(), // <- needed if using firestore
  };
}

export default firebase;
