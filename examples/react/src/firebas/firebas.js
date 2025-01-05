import { initializeFirebase } from "firedux-storage";

// Configuración de Firebase del usuario
const userConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

// Inicializa Firebase
export const firebaseInstance = initializeFirebase(userConfig);
