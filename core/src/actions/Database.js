import {
  getDocument,
  getCollection,
  setDocument,
  deleteDocument,
  editDocument,
} from "../slices/firestoreSlice.js";

import store from "../store/store.js";
// import useRealtime from "../Hooks/useRealtime";
// import useStorage from "../Hooks/useStorage";

// obtener documento
export const obtenerDocumento = async ({ collectionName, id }) => {
  let res = await store.dispatch(
    getDocument({
      collectionName: collectionName,
      id: id,
    })
  );

  return res.payload;
};

/**
 * Obtener colleccion de firebase
 * @param {nombre de la colleccion a obtener} collectionName
 * @param {condicion where que debe de cumplir} condicionWhere
 * @returns datos obtenidos de la consulta en forma de array
 */
export const obtenerCollecion = async (collectionName, condicionWhere) => {
  let collection = obtenerState();

  // guardamos la coleccion qeu queremos obtener
  let result = collection[collectionName];

  // verificamos i la colleccion existe
  if (!result) {
    // si no existe la obtnemos
    let res = await store.dispatch(
      getCollection({
        collectionName: collectionName,
        whereCondicion: condicionWhere,
      })
    );

    // reasignamos el valor de result con los datos obtenidos
    result = res.payload.data;
  }

  return result;
};

// funcion para obtener un estado en el redux
const obtenerState = () => {
  const { firestore } = store.getState();

  return firestore.collection;
};
