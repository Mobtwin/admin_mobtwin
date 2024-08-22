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
    const itemId = req.params.itemId;
    try {
      // 1. Check item-specific permissions
      if (resource && itemId) {
          const isValidPermission = await checkItemSpecificPermission(
            userId,
            { table: resource.table, itemId: itemId },
            resource.action
          );
          if (isValidPermission) {
            return next();
          }
      }
      // 2. Check role-based permissions
      if (typeof permissionName === "string") {
        if (await isValidRole(userRole, permissionName)) {
          req.user.permissions = [permissionName];
          return next();
        }
      }
      if (Array.isArray(permissionName)) {
        for (const permission of permissionName) {

          if (await isValidRole(userRole, permission)) {
            req.user.permissions = [...req.user.permissions,permission];
            return next();
          }

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
