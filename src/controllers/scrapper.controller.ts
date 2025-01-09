import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { getScrapperStatusService } from "../services/scrapper.service";




export const getScrapperStatusController = async (req: Request, res: Response) => {
    try {
      //authorization
      if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
      //get all roles
      getScrapperStatusService()
        .then((data) => {
          return sendSuccessResponse(
            res,
            data,
            "status fetched successfully!",
            200
          );
        })
        .catch((error) => {
          return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
        });
    } catch (error: any) {
      return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    }
  };