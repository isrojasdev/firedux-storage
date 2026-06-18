import { obtainRealTime } from "./RealTime.js";
import {
  getDocumentById,
  getCollectionData,
  addDocument,
  removeDocument,
  updateDocument,
} from "./Database.js";
import { uploadFile, removeFile } from "./Storage.js";
import {
  signInEmail,
  signUpEmail,
  signInGoogle,
  signInFacebook,
  signOutUser,
  resetPassword,
} from "./auth.js";
import { getSchema } from "../schemas/schemaRegistry.js";

const WRITE_QUERY_TYPES = ["addDocument", "updateDocument"];

// queryTypes that require a collectionName
const COLLECTION_QUERY_TYPES = [
  "obtainRealTime",
  "getDocumentById",
  "getCollectionData",
  "addDocument",
  "removeDocument",
  "updateDocument",
];

const validateDocument = (collectionName, queryType, documentData) => {
  const schema = getSchema(collectionName);
  if (!schema) return;

  const result = schema.safeParse(documentData);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.length ? i.path.join(".") + ": " : ""}${i.message}`)
      .join("\n");
    throw new Error(
      `[firedux-storage] Validation failed for collection "${collectionName}" (${queryType}):\n${issues}`
    );
  }
};

/**
 * Executes a list of queries asynchronously, handling errors individually.
 * @param {Array} queryList - List of query objects to execute.
 * @returns {Promise<Array>} Results array with { result, status } or { error, status }.
 */
export const executeQueries = async (queryList) => {
  if (!Array.isArray(queryList) || queryList.length === 0) {
    console.warn("Invalid query list: Expected a non-empty array.");
    return [];
  }

  const queryPromises = queryList.map(async (query, index) => {
    try {
      if (!query.queryType) {
        console.warn(`Invalid query at index ${index}: Missing 'queryType'.`);
        return { error: "Invalid query structure", status: "failed" };
      }

      if (COLLECTION_QUERY_TYPES.includes(query.queryType) && !query.collectionName) {
        console.warn(
          `Invalid query at index ${index}: '${query.queryType}' requires 'collectionName'.`
        );
        return { error: "Invalid query structure", status: "failed" };
      }

      const result = await querySelector(query);
      return { result, status: "succeeded" };
    } catch (error) {
      console.error(`Error processing query at index ${index}: ${error.message}`);
      return { error: error.message, status: "failed" };
    }
  });

  return Promise.all(queryPromises);
};

const querySelector = async ({
  queryType,
  collectionName,
  documentId,
  whereCondition,
  orderByCondition,
  limitCondition,
  storeAs,
  keyReference,
  documentData,
  // auth params
  email,
  password,
  // storage params
  file,
  fileName,
  folder,
  fileUrl,
}) => {
  if (WRITE_QUERY_TYPES.includes(queryType) && documentData) {
    validateDocument(collectionName, queryType, documentData);
  }

  switch (queryType) {
    // ── Firestore ──────────────────────────────────────────────────────────
    case "obtainRealTime":
      await obtainRealTime(
        collectionName,
        whereCondition || false,
        limitCondition || false,
        orderByCondition || false,
        storeAs || false,
        keyReference || []
      );
      break;

    case "getDocumentById":
      return await getDocumentById({ collectionName, id: documentId });

    case "getCollectionData":
      return await getCollectionData(
        collectionName,
        whereCondition || false,
        limitCondition || false,
        orderByCondition || false,
        storeAs || false,
        keyReference || []
      );

    case "addDocument":
      if (!documentData) {
        console.warn("Missing 'documentData' for addDocument query.");
        return;
      }
      return await addDocument({ collectionName, state: documentData });

    case "removeDocument":
      if (!documentId) {
        console.warn("Missing 'documentId' for removeDocument query.");
        return;
      }
      return await removeDocument({ collectionName, id: documentId });

    case "updateDocument":
      if (!documentId || !documentData) {
        console.warn("Missing 'documentId' or 'documentData' for updateDocument query.");
        return;
      }
      return await updateDocument({ collectionName, id: documentId, state: documentData });

    // ── Auth ───────────────────────────────────────────────────────────────
    case "signInEmail":
      return await signInEmail({ email, password });

    case "signUpEmail":
      return await signUpEmail({ email, password });

    case "signInGoogle":
      return await signInGoogle();

    case "signInFacebook":
      return await signInFacebook();

    case "signOut":
      return await signOutUser();

    case "resetPassword":
      return await resetPassword({ email });

    // ── Storage ────────────────────────────────────────────────────────────
    case "uploadFile":
      if (!file || !fileName || !folder) {
        console.warn("Missing 'file', 'fileName', or 'folder' for uploadFile query.");
        return;
      }
      return await uploadFile({ file, fileName, folder });

    case "deleteFile":
      if (!fileUrl) {
        console.warn("Missing 'fileUrl' for deleteFile query.");
        return;
      }
      return await removeFile({ fileUrl });

    default:
      console.warn(`Unrecognized query type: ${queryType}`);
      break;
  }
};
