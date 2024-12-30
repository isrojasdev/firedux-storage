// Import the 'obtainRealTime' function from the RealTime.js module
import { obtainRealTime } from "./RealTime.js";

/**
 * Executes a list of queries sequentially in an asynchronous manner.
 *
 * @param {Array} queryList - List of queries to be executed.
 */
export const executeQueries = async (queryList) => {
  // Validate that queryList is an array and contains elements
  if (!Array.isArray(queryList) || queryList.length === 0) {
    console.warn("Invalid query list: Expected a non-empty array.");
    return;
  }

  // Process each query sequentially using a for...of loop
  for (const [index, query] of queryList.entries()) {
    try {
      // Validate that each query has the required properties
      if (!query.queryType || !query.collectionName) {
        console.warn(
          `Invalid query at index ${index}: Missing 'queryType' or 'collectionName'.`
        );
        continue;
      }

      // Execute the current query
      await querySelector(query);
    } catch (error) {
      console.error(
        `Error processing query at index ${index}: ${error.message}`
      );
    }
  }
};

/**
 * Selects the appropriate query to execute based on the query type.
 *
 * @param {Object} query - The query object containing the query type and collection name.
 * @param {string} query.queryType - The type of query to execute.
 * @param {string} query.collectionName - The name of the collection for the query.
 */
const querySelector = async ({ queryType, collectionName }) => {
  switch (queryType) {
    case "obtainRealTime":
      // Executes a real-time query on the specified collection
      await obtainRealTime(collectionName);
      break;

    default:
      // Log a warning for unrecognized query types
      console.warn(`Unrecognized query type: ${queryType}`);
      break;
  }
};
