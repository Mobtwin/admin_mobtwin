import { NextFunction, Request, Response } from "express";
import { ResponseType } from "../utils/response";
import { PerformedBy } from "../models/actionLog.schema";
import { PERMISSIONS_ACTIONS, TABLES } from "../constant/actions.constant";
import { IAction } from "../services/itemSpecificPermissions.service";
import addLogActionsJob from "../workers/logActions.worker";


export const afterResponse = (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async() => {
        try {
            if (req.method === 'GET') {
                return;
                
            }
            if (!res.locals.responseData) {
                return;
            }
            const user = req.user;
            if (!user) {
                return;
            }
            // Access the response data captured from res.json
            const responseData = res.locals.responseData as ResponseType<any>;

            // Example: Extracting user/admin details from the request
            const adminId = user.id ;

            // Extract or infer the action details from the request/response
            const actionType = determineActionType(user); // You need to implement this function to determine the action type
            const targetEntity = determineTargetEntity(user); // You need to implement this function to determine the entity being acted upon
            const targetEntityId = determineTargetEntityId(req,responseData); // You need to implement this function to determine the ID of the entity

            // Optional: Use responseData to build a more detailed description
            const description = `Action: ${actionType} on ${targetEntity} with ID: ${targetEntityId} by ${user.userName}`;

            // Push to the queue
            await addLogActionsJob(
                `LogActionsJob-${Date.now()}`, // Unique job name
            {
                action:actionType,
                adminId,
                table:targetEntity,
                itemId:targetEntityId,
                message:description,
            });

        } catch (error) {
            console.error('Error in afterControllerMiddleware:', error);
            // Handle errors in logging/queueing here
        }
    });
    next();
}

function determineActionType(user:Express.User): string {
    // Implement this function to determine the action type based on the request user
    const values = Object.values(PERMISSIONS_ACTIONS);
    let actionType = 'UNKNOWN';
    values.forEach((value) => {
        if (user.permissions.filter(p => p.includes(value)).length > 0) {
            actionType = value;
            return;
        }
    });
    return actionType;
}
function determineTargetEntity(user: Express.User): string {
    let targetEntity = 'UNKNOWN';
    TABLES.forEach((table) => {
        if (user.permissions.filter(p => p.includes(table)).length > 0) {
            targetEntity = table;
            return ;
        }
    });
    return targetEntity;
}
// Example function to determine the target entity ID
function determineTargetEntityId(req: Request,responseData:ResponseType<any>): string | undefined {
    // This assumes you're extracting entity IDs from the request params
    if (req.params && req.params.id) {
        return req.params.id;
    }
    // This assumes you're extracting entity IDs from the response data
    if (responseData && responseData.data && responseData.data._id) {
        return responseData.data._id;
    }
    return undefined;
}