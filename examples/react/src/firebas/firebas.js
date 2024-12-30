import { initializeFirebase } from "firedux-storage";

// Configuración de Firebase del usuario
const userConfig = {
  apiKey: "AIzaSyDr-VvZHE5j1D-Hih_n2I4e09bowApMBZ8",
  authDomain: "aga-carpetas.firebaseapp.com",
  projectId: "aga-carpetas",
  storageBucket: "aga-carpetas.appspot.com",
  messagingSenderId: "711595800028",
  appId: "1:711595800028:web:3271b41bed7ed198098b19",
};

// Inicializa Firebase
export const firebaseInstance = initializeFirebase(userConfig);
