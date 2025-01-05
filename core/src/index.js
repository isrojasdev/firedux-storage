// store redux
import store from "./store/store.js";

// functions
import { executeQueries } from "./actions/Queries.js";
// import { obtenerDocumento, obtenerCollecion } from "./actions/Database.js";
// import { obtainRealTime } from "./actions/RealTime.js";

// constructor app firebase
import { initializeFirebase } from "./firebase/firebase.js";

// Exporta el objeto firedux
export {
  executeQueries,
  // obtenerCollecion,
  // obtenerDocumento,
  // obtainRealTime,
  initializeFirebase,
  store,
};
