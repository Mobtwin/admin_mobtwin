import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { CreateRoleRequest } from "../validators/role.validator";
import { logEvents } from "../middlewares/logger";
import {
  assignPermissionsById,
  assignPermissionsByName,
  createRole,
  getAllRoles,
  getRoleById,
  getRoleByName,
  removePermissionsById,
  removePermissionsByName,
} from "../services/role.service";

// create a new role controller
export const createRoleController = async (
  req: CreateRoleRequest,
  res: Response
) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    //create role
    createRole(req.body)
      .then((value) => {
        logEvents(
          `Role: ${value.name} created by ${user.userName}: ${user.role}`,
          "actions.log"
        );
        return sendSuccessResponse(
          res,
          value,
          "Role created successfully!",
          201
        );
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

// get all roles controller
export const getAllRolesController = async (req: Request, res: Response) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    //get all roles
    getAllRoles()
      .then((value) => {
        return sendSuccessResponse(
          res,
          value,
          "Roles fetched successfully!",
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

// get role by id controller
export const getRoleByIdController = async (req: Request, res: Response) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    //get role by id
    getRoleById(req.params.id)
      .then((value) => {
        return sendSuccessResponse(
          res,
          value,
          "Role fetched successfully!",
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

// get role by name controller
export const getRoleByNameController = async (req: Request, res: Response) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    //get role by name
    getRoleByName(req.params.name)
      .then((value) => {
        return sendSuccessResponse(
          res,
          value,
          "Role fetched successfully!",
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

// assign permissions to a role by id controller
export const assignPermissionsByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    //assign permissions to a role
    assignPermissionsById(req.params.id, req.body.permissions)
      .then((value) => {
        logEvents(
          `Permissions: ${JSON.stringify(req.body.permissions)} assigned to role: ${value.name} by ${user.userName}: ${user.role}`,
          "actions.log"
        );
        return sendSuccessResponse(
          res,
          value,
          "Permissions assigned successfully!",
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

// assign permissions to a role controller
export const assignPermissionsByNameController = async (
  req: Request,
  res: Response
) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    //assign permissions to a role
    assignPermissionsByName(req.params.name, req.body.permissions)
      .then((value) => {
        logEvents(
          `Permissions: ${JSON.stringify(req.body.permissions)} assigned to role: ${value.name} by ${user.userName}: ${user.role}`,
          "actions.log"
        );
        return sendSuccessResponse(
          res,
          value,
          "Permissions assigned successfully!",
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

// unassign permissions to a role by id controller
export const unassignPermissionsByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    //unassign permissions to a role
    removePermissionsById(req.params.id, req.body.permissions)
      .then((value) => {
        logEvents(
          `Permissions: ${JSON.stringify(req.body.permissions)} unassigned to role: ${value.name} by ${user.userName}: ${user.role}`,
          "actions.log"
        );
        return sendSuccessResponse(
          res,
          value,
          "Permissions unassigned successfully!",
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

// unassign permissions to a role by name controller
export const unassignPermissionsByNameController = async (
  req: Request,
  res: Response
) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    //unassign permissions to a role
    removePermissionsByName(req.params.name, req.body.permissions)
      .then((value) => {
        logEvents(
          `Permissions: ${JSON.stringify(req.body.permissions)} unassigned to role: ${value.name} by ${user.userName}: ${user.role}`,
          "actions.log"
        );
        return sendSuccessResponse(
          res,
          value,
          "Permissions unassigned successfully!",
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








