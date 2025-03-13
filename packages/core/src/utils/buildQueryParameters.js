import { where, limit, orderBy, collection, query } from "firebase/firestore";

/**
 * Builds Firestore query parameters dynamically.
 * @param {Object} db - Firestore instance.
 * @param {string} collectionName - The collection to query.
 * @param {Array|boolean} whereCondition - Filtering conditions (optional).
 * @param {number|boolean} limitCondition - Max number of documents (optional).
 * @param {Array|boolean} orderByCondition - Ordering condition [field, direction] (optional).
 * @returns {Object} A Firestore query.
 */
export const buildQuery = (
  db,
  collectionName,
  whereCondition,
  limitCondition,
  orderByCondition
) => {
  let queryParameters = [];

  // 🔥 Process "where" conditions
  if (whereCondition) {
    if (Array.isArray(whereCondition) && whereCondition.every(Array.isArray)) {
      whereCondition.forEach((condition) => {
        queryParameters.push(where(condition[0], condition[1], condition[2]));
      });
    } else {
      queryParameters.push(
        where(whereCondition[0], whereCondition[1], whereCondition[2])
      );
    }
  }

  // 🔥 Apply "limit"
  if (limitCondition) queryParameters.push(limit(limitCondition));

  // 🔥 Apply "orderBy"
  if (orderByCondition) {
    queryParameters.push(orderBy(orderByCondition[0], orderByCondition[1]));
  }

  return query(collection(db, collectionName), ...queryParameters);
};
