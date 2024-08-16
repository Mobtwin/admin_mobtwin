import { Response } from "express";
import { AppsBuildByIdRequest, CreateAppsBuildRequest, UpdateAppsBuildRequest } from "../validators/appsBuild.validator";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { ROLES } from "../models/admin.schema";
import { createAppBuild, deleteAppBuild, getAllAppsBuild, getAppBuildById, updateAppBuild } from "../services/appsBuild.service";
import { logEvents } from "../middlewares/logger";

//create a new app build
export const createAppBuildController = async (
  req: CreateAppsBuildRequest,
  res: Response
) => {
  try {
    //authorize the request
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized", 401);
    const user = req.user;
    if (!ROLES.includes(user.role))
      return sendErrorResponse(res, null, "Unauthorized", 401);
    //create the app build
    createAppBuild(req.body, user.id)
      .then((appBuild) => {
        logEvents(
          `AppBuild: ${appBuild.name} created by ${user.role}: ${user.userName}`,
          "actions.log"
        );
        return sendSuccessResponse(res, appBuild, "AppBuild created successfully", 201);
      })
      .catch((error) => {
        return sendErrorResponse(res, error, "Error :" + error.message, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, "Error :" + error.message, 500);
  }
};

//update an existing app build
export const updateAppBuildController = async (
  req: UpdateAppsBuildRequest,
  res: Response
) => {
  try {
    //authorize the request
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized", 401);
    const user = req.user;
    if (!ROLES.includes(user.role))
      return sendErrorResponse(res, null, "Unauthorized", 401);
    const { id } = req.params;
    if (!id) return sendErrorResponse(res, null, "Invalid app build ID", 400);
    //update the app build
    updateAppBuild(req.body, id)
      .then((appBuild) => {
        logEvents(
          `AppBuild: ${appBuild.name} updated by ${user.role}: ${user.userName}`,
          "actions.log"
        );
        return sendSuccessResponse(res, appBuild, "AppBuild updated successfully", 200);
      })
      .catch((error) => {
        return sendErrorResponse(res, error, "Error :" + error.message, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, "Error :" + error.message, 500);
  }
};

// get all app builds
export const getAllAppBuildsController = async (req: any, res: Response) => {
  try {
    //authorize the request
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized", 401);
    const user = req.user;
    if (!ROLES.includes(user.role))
      return sendErrorResponse(res, null, "Unauthorized", 401);
    //get all app builds
    getAllAppsBuild()
      .then((appBuilds) => {
        return sendSuccessResponse(res, appBuilds, "AppBuilds fetched successfully", 200);
      })
      .catch((error) => {
        return sendErrorResponse(res, error, "Error :" + error.message, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, "Error :" + error.message, 500);
  }
};

//get app build by id
export const getAppBuildByIdController = async (req: AppsBuildByIdRequest, res: Response) => {
  try {
    //authorize the request
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized", 401);
    const user = req.user;
    if (!ROLES.includes(user.role))
      return sendErrorResponse(res, null, "Unauthorized", 401);
    const { id } = req.params;
    if (!id) return sendErrorResponse(res, null, "Invalid app build ID", 400);
    //get app build by id
    getAppBuildById(id)
      .then((appBuild) => {
        return sendSuccessResponse(res, appBuild, "AppBuild fetched successfully", 200);
      })
      .catch((error) => {
        return sendErrorResponse(res, error, "Error :" + error.message, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, "Error :" + error.message, 500);
  }
};

//soft delete an app build
export const deleteAppBuildController = async (req: AppsBuildByIdRequest, res: Response) => {
  try {
    //authorize the request
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized", 401);
    const user = req.user;
    if (!ROLES.includes(user.role))
      return sendErrorResponse(res, null, "Unauthorized", 401);
    const { id } = req.params;
    if (!id) return sendErrorResponse(res, null, "Invalid app build ID", 400);
    //delete app build by id
    deleteAppBuild(id)
      .then((appBuild) => {
        logEvents(
          `AppBuild: ${appBuild.name} deleted by ${user.role}: ${user.userName}`,
          "actions.log"
        );
        return sendSuccessResponse(res, appBuild, "AppBuild deleted successfully", 200);
      })
      .catch((error) => {
        return sendErrorResponse(res, error, "Error :" + error.message, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, "Error :" + error.message, 500);
  }
};









