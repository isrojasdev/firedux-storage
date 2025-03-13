import { onSnapshot } from "firebase/firestore";
import { getCollectionRealTime } from "../slices/firestoreSlice.js";
import { firebaseInstance } from "../firebase/firebase.js";
import { getStore } from "../store/store.js";

import { buildQuery } from "../utils/buildQueryParameters.js";
import { resolveReferences } from "../utils/resolveReferences.js";

export const obtainRealTime = async (
  collectionName,
  whereCondition = false,
  limitCondition = false,
  orderByCondition = false,
  storeAs = false,
  keyReference = []
) => {
  const db = firebaseInstance.db;

  try {
    const store = getStore();
    let q = buildQuery(
      db,
      collectionName,
      whereCondition,
      limitCondition,
      orderByCondition
    );

    onSnapshot(q, async (querySnapshot) => {
      let docs = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          let documentData = { ...doc.data(), id: doc.id };
          return await resolveReferences(documentData, keyReference);
        })
      );

      let res = await store.dispatch(
        getCollectionRealTime({
          docs,
          collectionName,
          whereCondition,
          storeAs,
        })
      );

      return { success: true, res };
    });
  } catch (error) {
    console.error("🔥 Firestore RealTime Error:", error);
    return { success: false, error };
  }
};
