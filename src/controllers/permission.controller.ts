import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { CreatePermissionRequest, SearchPermission, SearchPermissionRequest, UpdatePermissionByIdRequest, UpdatePermissionByNameRequest,  } from "../validators/permission.validator";
import { logEvents } from "../middlewares/logger";
import {
  createPermission,
  deletePermissionById,
  deletePermissionByName,
  getAllPermissions,
  getSearchedPermissions,
  updatePermissionById,
  updatePermissionByName,
} from "../services/permission.service";
import { invalidateCache } from "../middlewares/cache.middleware";
import { PERMISSION_TABLE } from "../constant/permission.constant";
import { constructSearchFilter, searchInModel } from "../utils/search";
import { IPermissionDocument, Permissions } from "../models/permission.schema";

// create new permission
export const createPermissionController = async (
  req: CreatePermissionRequest,
  res: Response
) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;

    //create permission
    createPermission(req.body)
      .then((value) => {
        logEvents(
          `Permission: ${value.name} created by ${user.userName}: ${user.role}`,
          "actions.log"
        );
        invalidateCache(PERMISSION_TABLE)
          .then(() => {
            return sendSuccessResponse(
              res,
              value,
              "Permission created successfully!",
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
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

// get all permissions controller
export const getAllPermissionsController = async (
  req: Request,
  res: Response
) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const {skip,limit} = res.locals;
    //get all permissions
    getAllPermissions({skip,limit})
      .then(({data,pagination}) => {
        return sendSuccessResponse(
          res,
          data,
          "Permissions retrieved successfully!",
          200,
          pagination
        );
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

// update permission controller by name
export const updatePermissionByNameController = async (
  req: UpdatePermissionByNameRequest,
  res: Response
) => {
  try {
    // authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    const name = req.params.name;
    if (!name) {
      return sendErrorResponse(res, null, "Permission name is required!", 400);
    }

    //update permission
    updatePermissionByName(name, req.body)
      .then((value) => {
        logEvents(
          `Permission: ${value.name} updated by ${user.userName}: ${user.role}`,
          "actions.log"
        );
        invalidateCache(PERMISSION_TABLE)
          .then(() => {
            return sendSuccessResponse(
              res,
              value,
              "Permission updated successfully!",
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
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};
// update permission controller by id
export const updatePermissionByIdController = async (
  req: UpdatePermissionByIdRequest,
  res: Response
) => {
  try {
    // authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    const id = req.params.id;
    if (!id) {
      return sendErrorResponse(res, null, "Permission id is required!", 400);
    }

    //update permission
    updatePermissionById(id, req.body)
      .then((value) => {
        logEvents(
          `Permission: ${value.name} updated by ${user.userName}: ${user.role}`,
          "actions.log"
        );
        invalidateCache(PERMISSION_TABLE)
          .then(() => {
            return sendSuccessResponse(
              res,
              value,
              "Permission updated successfully!",
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
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

//delete permission by name controller
export const deletePermissionByNameController = async (
  req: Request,
  res: Response
) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    const name = req.params.name;
    if (!name) {
      return sendErrorResponse(res, null, "Permission name is required!", 400);
    }

    // delete permission
    deletePermissionByName(name)
      .then((value) => {
        logEvents(
          `Permission: ${value.name} deleted by ${user.userName}: ${user.role}`,
          "actions.log"
        );
        invalidateCache(PERMISSION_TABLE)
          .then(() => {
            return sendSuccessResponse(
                res,
                value,
                "Permission deleted successfully!",
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
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};
//delete permission by id controller
export const deletePermissionByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    const id = req.params.id;
    if (!id) {
      return sendErrorResponse(res, null, "Permission id is required!", 400);
    }

    // delete permission
    deletePermissionById(id)
      .then((value) => {
        logEvents(
          `Permission: ${value.name} deleted by ${user.userName}: ${user.role}`,
          "actions.log"
        );
        invalidateCache(PERMISSION_TABLE)
          .then(() => {
            return sendSuccessResponse(
                res,
                value,
                "Permission deleted successfully!",
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
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

// search permission table controller
export const searchPermissionTableController = async (req: SearchPermissionRequest, res: Response) => {
  try {
    const searchParamas:SearchPermission = {
      name: req.query.name,
      description: req.query.description,
    };
    const searchFilters = constructSearchFilter<IPermissionDocument>(searchParamas);
    // search permission table
    getSearchedPermissions({skip:res.locals.skip,limit:res.locals.limit,filters:searchFilters}).then(({data,pagination})=>{
      return sendSuccessResponse(res, data, "Permissions retrieved successfully!", 200,pagination);
    }).catch((error) => {
      return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
    });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
}




