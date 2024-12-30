import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { firebaseInstance } from "../firebase/firebase.js";
const db = firebaseInstance.firestore;

const firestoreAdapter = createEntityAdapter();

const initialState = firestoreAdapter.getInitialState({
  collection: {},
  document: {},
  insert: { status: null },
  update: {},
  status: "idle",
  error: null,
});

// Serializador de objetos
const serializarObjeto = async (array) => {
  let promesa2 = await new Promise(async (resolve, reject) => {
    let array_serializado = [];

    // si es un arreglo vacio porqeu la coleccion no tiene datos o no existe la resolvemos en automatico
    if (array.length <= 0) {
      resolve(array);
    }

    // ciclamos el objeto mandado
    await array.map(async (objeto) => {
      // copiamos el valor acyual del ciclo
      let copiaObjeto = { ...objeto };

      // obteniendo los tipos de datos en la respuesta
      let promesa = await new Promise(async (resolve, reject) => {
        for (let clave in copiaObjeto) {
          // serializamos
          let string = JSON.stringify(copiaObjeto[clave]);
          let serializado = JSON.parse(string);

          // reasignamos el valor
          copiaObjeto[clave] = serializado;
        }
        // integramos al nuevo array serializado
        resolve(copiaObjeto);
      });

      array_serializado.push(promesa);
      resolve(array_serializado);
    });
  });

  return await promesa2;
};

// Thunk functions for get a document to a collection
// TODO: en la consulta get agregar como parametro la o las claves del objeto que son referencias en la db
export const getDocument = createAsyncThunk(
  "firestore/getDocument",
  async ({ collectionName, id = null }) => {
    try {
      const snapShot = await db.collection(collectionName).doc(id).get();

      return { ...snapShot.data(), id: snapShot.id };
    } catch (error) {
      return { error, status: "failed" };
    }
  }
);

// TODO: Terminar las funcionalidades del get al igual que con el realtime, condicoion where, retorno por base de condicion, reinicio si esta vacios
// Thunk functions for get all documents to a collection
export const getCollection = createAsyncThunk(
  "firestore/getCollection",
  async ({ collectionName, whereCondicion = null }) => {
    // data to return from database
    var data = [];

    try {
      // evaluate params for queries to database
      var whereFuncion = null;

      if (whereCondicion !== null) {
        var iterator = whereCondicion.values();
        whereFuncion = where(
          iterator.next().value,
          iterator.next().value,
          iterator.next().value
        );
      }

      const q = query(collection(db, collectionName), whereFuncion);

      const querySnapshot = await getDocs(q);
      await querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });

      return data;
    } catch (error) {
      return { error, status: "failed" };
    }
  }
);

// Thunk functions for add a document to a collection
export const setDocument = createAsyncThunk(
  "firestore/setDocument",
  async ({ collectionName, state }) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), state);

      return docRef;
    } catch (error) {
      return { error, status: "failed" };
    }
  }
);

// Thunk functions for delete a document to a collection
export const deleteDocument = createAsyncThunk(
  "firestore/deleteDocument",
  async ({ collectionName, id }) => {
    try {
      await deleteDoc(doc(db, collectionName, id));

      return true;
    } catch (error) {
      return { error, status: "failed" };
    }
  }
);

// Thunk functions for edit a document
export const editDocument = createAsyncThunk(
  "firestore/editDocument",
  async ({ collectionName, id, state }) => {
    try {
      await updateDoc(doc(db, collectionName, id), state);

      return true;
    } catch (error) {
      return { error, status: "failed" };
    }
  }
);

// Thunk functions for edit a document
export const getCollectionRealTime = createAsyncThunk(
  "firestore/getCollectionRealTime",
  async ({ docs, collectionName, condicionWhere, storeAs }) => {
    console.log("real time redux");
    try {
      // serializamos la respuesta
      let serializado = await serializarObjeto(docs);

      // evaluamos si la consulta se mando una forma especifica de guardarlo
      let name = storeAs ? storeAs : collectionName;

      console.log({ docs: serializado, collectionName: name, condicionWhere });
      // regresamos los datos serializados y en su defecto con el nombre de la colleccion a guardar
      return { docs: serializado, collectionName: name, condicionWhere };
    } catch (error) {
      return { error, status: "failed" };
    }
  }
);

const firestoreSlice = createSlice({
  name: "firestore",
  initialState,
  reducers: {
    // reducer for get documnets of a collection in real time
  },
  extraReducers: (builder) => {
    builder
      // control de estado de la promesa para getDocument
      .addCase(getDocument.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getDocument.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.document = action.payload;
      })
      .addCase(getDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // control de estado de la promesa para getCollection
      .addCase(getCollection.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCollection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.collection[action.meta.arg.collectionName] = action.payload;
      })
      .addCase(getCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // control de estado de la promesa para getCollectionRealTime
      .addCase(getCollectionRealTime.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCollectionRealTime.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log({ state, action });
        if (action.meta.arg.storeAs) {
          state.collection[action.meta.arg.storeAs] = action.payload;
        } else {
          state.collection[action.meta.arg.collectionName] = action.payload;
        }

        console.log({ state });
        return state;
      })
      .addCase(getCollectionRealTime.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // control de estado de la promesa para setDocument
      .addCase(setDocument.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(setDocument.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.insert = action.payload;
      })
      .addCase(setDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // control de estado de la promesa para deleteDocument
      .addCase(deleteDocument.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // control de estado de la promesa para editDocument
      .addCase(editDocument.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(editDocument.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.update = action.payload;
      })
      .addCase(editDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default firestoreSlice.reducer;
