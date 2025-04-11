import { createCollection, deleteCollection, getCollections, updateCollection } from "../config/graphql.config";
import { CreateCollection, UpdateCollectionById } from "../validators/collection.validator";

// get all collections

export const getAllCollectionsService = async (token:string) => {
  try {
    const result = await getCollections(token);
    return result;
  } catch (error: any) {
    throw error;
  }
};


// create a new collection
export const createCollectionService = async (collection: CreateCollection,platform:"as"|"gp",token:string) => {
  try {
    const result = await createCollection(collection, platform,token);
    if (Object.keys(result).includes("errors")) {
      throw new Error(result.errors[0].message);
    }
    return result;
  } catch (error: any) {
    throw error;
  }
};

// update a collection

export const updateCollectionService = async (collectionId: string, collection: UpdateCollectionById, platform:"as"|"gp",token:string) => {
  try {
    const result = await updateCollection(collection, platform, collectionId,token);
    return result;
  } catch (error: any) {
    throw error;
  }
};

// delete a collection

export const deleteCollectionService = async (collectionId: string, platform:"as"|"gp", token:string) => {
  try {
    const result = await deleteCollection(platform, collectionId,token);
    return result;
  } catch (error: any) {
    throw error;
  }
};