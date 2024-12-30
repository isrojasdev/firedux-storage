import {
  collection,
  query,
  onSnapshot,
  where,
  limit,
  orderBy,
  getDoc,
} from "firebase/firestore";

import { getCollectionRealTime } from "../slices/firestoreSlice.js";

import { firebaseInstance } from "../firebase/firebase.js";
import store from "../store/store.js";

export const obtainRealTime = async (
  collectionName,
  condicionWhere = false,
  condicionalLimit = false,
  condicionalOrderBy = false,
  storeAs = false,
  keyReference = []
) => {
  const db = firebaseInstance.firestore;
  let parametrosQuery = {};

  console.log({ firebaseInstance, db });
  try {
    // evaluamos si tiene condicional where para estructurarla
    if (condicionWhere) {
      if (condicionWhere.every(Array.isArray)) {
        condicionWhere.map((condicon, index) => {
          return (parametrosQuery[`where${index}`] = where(
            condicon[0],
            condicon[1],
            condicon[2]
          ));
        });
      } else {
        parametrosQuery.where = where(
          condicionWhere[0],
          condicionWhere[1],
          condicionWhere[2]
        );
      }
    }

    // evaluamos si tiene limite de consulta para estructurarlo
    if (condicionalLimit) parametrosQuery.limit = limit(condicionalLimit);

    // evaluamos si se le mando un formato de orden
    if (condicionalOrderBy)
      parametrosQuery.order = orderBy(
        condicionalOrderBy[0],
        condicionalOrderBy[1]
      );

    // hacemos la referencia para hacer la consulta
    let q = query(
      collection(db, collectionName),
      ...Object.values(parametrosQuery)
    );

    // realizamos la consulta a la db
    onSnapshot(
      q,
      async (querySnapshot) => {
        let docs = [];
        querySnapshot.forEach(async (doc) => {
          // TODO: hacer evaluacion de referencias individuales, sin que sea un array de referencias si no una referencia simple
          //evaluamos si tiene una referencia y que la referencia mandad exista
          if (keyReference.length > 0 && doc.data()[keyReference]) {
            let references = await Promise.all(
              //ciclamos el arreglo de referencias
              doc.data()[keyReference].map(async (ref) => {
                //obtenemos el documento
                const refDoc = await getDoc(ref);

                // regresamos la informacion del documento y el id
                return { id: refDoc.id, ...refDoc.data() };
              })
            );

            let document = {
              ...doc.data(),
              id: doc.id,
            };

            document[keyReference] = references;

            // agregamos a el array de datos la data del documento mas el id del documento
            docs.push(document);
          } else {
            // agregamos a el array de datos la data del documento mas el id del documento
            docs.push({ ...doc.data(), id: doc.id });
          }

          // evaluamos que el tamaño de los documentos sea igual al de la consulta
          if (docs.length === querySnapshot.size) {
            // ejecutamos el thunk de consulta realtime
            let res = await store.dispatch(
              getCollectionRealTime({
                docs,
                collectionName,
                condicionWhere,
                storeAs,
              })
            );

            // guardamos el resultado del thunks y una respuesta positiva
            return { success: true, res };
          }
        });

        // la colleccion consultada esta vacia
        if (querySnapshot.size === 0) {
          // ejecutamos el thunk de consulta realtime
          let res = await store.dispatch(
            getCollectionRealTime({
              docs,
              collectionName,
              condicionWhere,
              storeAs,
            })
          );

          console.log({ res });
          // guardamos el resultado del thunks y una respuesta positiva
          return { success: true, res };
        }
      },
      (error) => {
        // ocurrio un error de consulta con la db
        return { success: false, error };
      }
    );
  } catch (error) {
    // ocurrio un error inseperado
    return { success: false, error };
  }
};
