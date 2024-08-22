import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { logEvents } from "../middlewares/logger";
import { assignCreatorItemSpecificPermissions, assignItemSpicificPermission, unassignItemSpecificPermissions } from "../services/itemSpecificPermissions.service";

// assign permission of item to user controller
export const assignPermissionOfItemToUserController = async (req: Request, res: Response) => {
    try {
        // authorization
        if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
        const user = req.user;
        // assign permission to item to user
        assignItemSpicificPermission(req.body.action, req.body.userId, {table:req.body.table,itemId:req.params.id})
            .then((value) => {
                logEvents(
                    `Permission: ${value.table}.${value.action} assigned to user of Id ${value.userId} by ${user.userName} with roleId: ${user.role}`,
                    "actions.log"
                );
                return sendSuccessResponse(
                    res,
                    value,
                    "Permission assigned successfully!",
                    200
                );
            })
            .catch((error) => {
                return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
            });
    } catch (error: any) {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
        
    }
}


//unassign permissions of item to user controller
export const unassignPermissionsOfItemToUserController = async (req: Request, res: Response) => {
    try {
        // authorization
        if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
        const user = req.user;
        // unassign permission of item to user
        unassignItemSpecificPermissions(req.body.action, req.body.userId, {table: req.body.table,itemId: req.params.id})
            .then((value) => {
                logEvents(
                    `Permission: ${value.table}.${value.action} unassigned from user of Id ${value.userId} by ${user.userName} with roleId: ${user.role}`,
                    "actions.log"
                );
                return sendSuccessResponse(
                    res,
                    value,
                    "Permission unassigned successfully!",
                    200
                );
            })
            .catch((error) => {
                return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
            });
    } catch (error: any) {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    }
}

// assign all permissions of item to user controller
export const assignAllPermissionsOfItemToUserController = async (req: Request, res: Response) => {
    try {
        // authorization
        if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
        const user = req.user;
        // assign all permissions of item to user
        assignCreatorItemSpecificPermissions(req.body.userId, {table: req.body.table,itemId: req.params.id})
            .then((value) => {
                logEvents(
                    `All permissions of ${req.body.table} assigned to user of Id ${req.body.userId} by ${user.userName} with roleId: ${user.role}`,
                    "actions.log"
                );
                return sendSuccessResponse(
                    res,
                    value,
                    "All permissions assigned successfully!",
                    200
                );
            })
            .catch((error) => {
                return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
            });
    } catch (error: any) {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    }
}











