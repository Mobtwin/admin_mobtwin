import { NextFunction, Request, Response } from "express";
import {
  checkItemSpecificPermission,
  IAction,
} from "../services/itemSpecificPermissions.service";
import { isValidRole } from "../services/role.service";
import { sendErrorResponse } from "../utils/response";

export const checkPermission = (
  permissionName: string | string[],
  resource?: { table: string; action: IAction }
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole || !req.user) {
      return sendErrorResponse(res, null, "Unauthorized!", 401);
    }

    const itemId = req.params.id;

    try {
      console.log("Checking permissions...");
      // 1. Check item-specific permissions
      if (resource) {
        if (!itemId)
          return sendErrorResponse(
            res,
            null,
            "Missing param. Item ID is required",
            400
          );

        const isValidPermission = await checkItemSpecificPermission(
          userId,
          { table: resource.table, itemId: itemId },
          resource.action
        );
        console.log("Item-specific permission:", isValidPermission);
        if (isValidPermission) {
          return next();
        }
      }
      console.log("Item-specific permission not found!");
      // 2. Check role-based permissions
      if (typeof permissionName === "string") {
        console.log("Checking role-based permissions...");
        if (await isValidRole(userRole, permissionName)) {
          req.user.permissions = [permissionName];
          return next();
        }
        console.log("Role-based permission not found!");
      }
      if (Array.isArray(permissionName)) {
        for (const permission of permissionName) {
        console.log("Checking role-based permissions...2");

          if (await isValidRole(userRole, permission)) {
            req.user.permissions = [permission];
            return next();
          }
        console.log("Role-based permission not found!2");

        }
      }

      return sendErrorResponse(
        res,
        null,
        "Forbidden: Insufficient permissions!",
        403
      );
    } catch (error: any) {
      return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    }
  };
};
