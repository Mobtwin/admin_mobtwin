import { Response } from "express";
import { CreateCollectionRequest, DeleteCollectionByIdRequest, UpdateCollectionByIdRequest } from "../validators/collection.validator";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { createCollectionService, deleteCollectionService, getAllCollectionsService, updateCollectionService } from "../services/collection.service";
import { logEvents } from "../middlewares/logger";
import { COLLECTION_TABLE } from "../constant/collection.constant";
import { invalidateCache } from "../middlewares/cache.middleware";
import { PaginationQueryRequest } from "../validators/pagination.validator";
import { generateSignedUrl } from "../config/bucket.config";

// get all collections
export const getAllCollectionsController = async (req: PaginationQueryRequest, res: Response) => {
  try {
    // authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    //get all collections
    getAllCollectionsService(user.token||"")
      .then(async(value) => {
        const resultsWithImages = await Promise.all(value.map(async(collection: any) => {
          if (collection.poster && !collection.poster.startsWith("http://")) {
            const image = await generateSignedUrl(collection.poster, 60);
            return {...collection, posterWithUrl: image };
          }
          return {...collection, posterWithUrl: collection.poster };
        }));
        return sendSuccessResponse(res, resultsWithImages, "Collections fetched successfully!", 200);
      }).catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
      });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// create a new collection
export const createCollectionController = async (
  req: CreateCollectionRequest,
  res: Response
) => {
  try {
    // authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;

    //create collection
    createCollectionService(req.body, req.query.platform,req.user.token||"")
      .then(async(value) => {
        const posterUrl = await generateSignedUrl(value.data.createCollection.poster, 60);
        const collection = {
          ...value.data.createCollection,
          posterWithUrl: posterUrl,
        }
        logEvents(
          `Collection: ${collection.name} created by ${user.role}: ${user.userName}`,
          "actions.log"
        );
        invalidateCache(COLLECTION_TABLE)
          .then(() => {
            return sendSuccessResponse(
              res,
              collection,
              "Collection created successfully!",
              201
            );
          })
          .catch((error) => {
            return sendErrorResponse(
              res,
              error,
              `Error: ${error.message}`,
              400
            );
          });
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
      });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// update a collection

export const updateCollectionController = async (
  req: UpdateCollectionByIdRequest,
  res: Response
) => {
    try {
    // authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    const collectionId = req.params.id;
    const collection = req.body;
    updateCollectionService(collectionId, collection, req.query.platform,req.user.token||"").then((value) => {
        logEvents(
            `Collection: ${value.name} updated by ${user.role}: ${user.userName}`,
            "actions.log"
        );
        invalidateCache(COLLECTION_TABLE)
           .then(() => {
                return sendSuccessResponse(
                    res,
                    value,
                    "Collection updated successfully!",
                    200
                );
            })
           .catch((error) => {
                return sendErrorResponse(
                    res,
                    error,
                    `Error: ${error.message}`,
                    400
                );
            });
    }).catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    });
    //update collection
    }catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}

// delete a collection

export const deleteCollectionController = async (
  req: DeleteCollectionByIdRequest,
  res: Response
) => {
  try {
    // authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    const collectionId = req.params.id;
    //delete collection
    deleteCollectionService(collectionId, req.query.platform,req.user.token||"")
      .then((value) => {
        logEvents(
          `Collection: ${value.name} deleted by ${user.role}: ${user.userName}`,
          "actions.log"
        );
        invalidateCache(COLLECTION_TABLE)
          .then(() => {
            return sendSuccessResponse(
              res,
              value,
              "Collection deleted successfully!",
              200
            );
          })
          .catch((error) => {
            return sendErrorResponse(
              res,
              error,
              `Error: ${error.message}`,
              400
            );
          });
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
      });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

