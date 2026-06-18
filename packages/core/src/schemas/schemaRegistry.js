const registry = new Map();

export const registerSchemas = (schemas) => {
  Object.entries(schemas).forEach(([collectionName, schema]) => {
    registry.set(collectionName, schema);
  });
};

export const getSchema = (collectionName) => registry.get(collectionName);

export const clearRegistry = () => registry.clear();
