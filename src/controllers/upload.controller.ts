import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { uploadImagesToGoogleCloud } from "../config/bucket.config";

export const uploadImageController = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return sendErrorResponse(res,null, "Unauthorized!", 401);
    uploadImagesToGoogleCloud(req, `admin/images`)
      .then((imagesLink) => {
        return sendSuccessResponse(res, { image: imagesLink[0] }, "Image uploaded successfully", 200);// [0] because upload single image
      })
      .catch((error) => {
        return sendErrorResponse(res, error, "Error: " + error.message, 400);
      });
  };
// userRouter.post('/change-avatar', imageUpload.single('avatar'), uploadAvatarController);
//   