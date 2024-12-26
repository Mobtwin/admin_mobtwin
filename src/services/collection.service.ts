import { createCollection, updateCollection } from "../config/graphql.config";
import { CreateCollection, UpdateCollectionById } from "../validators/collection.validator";

// create a new collection
export const createCollectionService = async (collection: CreateCollection,platform:"as"|"gp") => {
  try {
    const result = await createCollection(collection, platform);
    return result;
  } catch (error: any) {
    throw error;
  }
};

// update a collection

export const updateCollectionService = async (collectionId: string, collection: UpdateCollectionById, platform:"as"|"gp") => {
  try {
    const result = await updateCollection(collection, platform, collectionId);
    return result;
  } catch (error: any) {
    throw error;
  }
};