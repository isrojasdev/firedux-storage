// functions
import { consultas } from "./actions/Consults.js";
import { obtenerDocumento, obtenerCollecion } from "./actions/Database.js";
import { obtenerRealTime } from "./actions/RealtTime.js";

// constructor app firebase
import { initializeFirebase } from "./firebase/firebase.js";

// Exporta el objeto firedux
export {
  consultas,
  obtenerCollecion,
  obtenerDocumento,
  obtenerRealTime,
  initializeFirebase,
};
