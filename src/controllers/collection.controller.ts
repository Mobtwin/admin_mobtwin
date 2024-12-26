import { Response } from "express";
import { CreateCollectionRequest, UpdateCollectionByIdRequest } from "../validators/collection.validator";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { createCollectionService, updateCollectionService } from "../services/collection.service";
import { logEvents } from "../middlewares/logger";
import { COLLECTION_TABLE } from "../constant/collection.constant";
import { invalidateCache } from "../middlewares/cache.middleware";



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
      .then((value) => {
        logEvents(
          `Collection: ${value.name} created by ${user.role}: ${user.userName}`,
          "actions.log"
        );
        invalidateCache(COLLECTION_TABLE)
          .then(() => {
            return sendSuccessResponse(
              res,
              value,
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