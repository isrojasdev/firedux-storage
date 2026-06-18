// Import required functions
import { obtainRealTime } from "./RealTime.js";
import {
  getDocumentById,
  getCollectionData,
  addDocument,
  removeDocument,
  updateDocument,
} from "./Database.js";
import { getSchema } from "../schemas/schemaRegistry.js";

const WRITE_QUERY_TYPES = ["addDocument", "updateDocument"];

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
 *
 * @param {Array} queryList - List of queries to be executed.
 * @returns {Promise<Array>} - Resolves when all queries complete, returns results or errors.
 */
export const executeQueries = async (queryList) => {
  // Validate that queryList is an array and contains elements
  if (!Array.isArray(queryList) || queryList.length === 0) {
    console.warn("Invalid query list: Expected a non-empty array.");
    return [];
  }

  // 🚀 Convert queries into promises
  const queryPromises = queryList.map(async (query, index) => {
    try {
      // Validate query properties
      if (!query.queryType || !query.collectionName) {
        console.warn(
          `Invalid query at index ${index}: Missing 'queryType' or 'collectionName'.`
        );
        return { error: "Invalid query structure", status: "failed" };
      }

      // Execute query and return result
      const result = await querySelector(query);

      return { result, status: "succeeded" };
    } catch (error) {
      console.error(
        `Error processing query at index ${index}: ${error.message}`
      );
      return { error: error.message, status: "failed" };
    }
  });

  // 🚀 Run all queries in parallel and wait for them to finish
  return Promise.all(queryPromises);
};

/**
 * Selects and executes the appropriate query based on the query type.
 *
 * @param {Object} query - The query object containing the query type and parameters.
 * @param {string} query.queryType - The type of query to execute.
 * @param {string} query.collectionName - The name of the collection for the query.
 */
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
}) => {
  if (WRITE_QUERY_TYPES.includes(queryType) && documentData) {
    validateDocument(collectionName, queryType, documentData);
  }

  switch (queryType) {
    case "obtainRealTime":
      // Executes a real-time query with optional conditions
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
      // Fetches a single document by ID
      return await getDocumentById({ collectionName, id: documentId });

    case "getCollectionData":
      // Fetches a collection with optional filters
      return await getCollectionData(
        collectionName,
        whereCondition || false,
        limitCondition || false,
        orderByCondition || false,
        storeAs || false,
        keyReference || []
      );

    case "addDocument":
      // Adds a new document to the collection
      if (!documentData) {
        console.warn("Missing 'documentData' for addDocument query.");
        return;
      }
      return await addDocument({ collectionName, state: documentData });

    case "removeDocument":
      // Deletes a document by ID
      if (!documentId) {
        console.warn("Missing 'documentId' for removeDocument query.");
        return;
      }
      return await removeDocument({ collectionName, id: documentId });

    case "updateDocument":
      // Updates an existing document by ID
      if (!documentId || !documentData) {
        console.warn(
          "Missing 'documentId' or 'documentData' for updateDocument query."
        );
        return;
      }
      return await updateDocument({
        collectionName,
        id: documentId,
        state: documentData,
      });

    default:
      // Log a warning for unrecognized query types
      console.warn(`Unrecognized query type: ${queryType}`);
      break;
  }
};
