import { Request } from "express";
import Joi from "joi";


// define joi schema for create permission request
export interface CreatePermission {
    name: string;
}
export interface CreatePermissionRequest extends Request {
    body: CreatePermission;
}
export const createPermissionSchema = Joi.object<CreatePermission>({
    name: Joi.string().required(),
});

// define joi schema for delete permission by name request
export interface DeletePermissionRequest extends Request {
    params: {
        name: string;
    };
}
export const deletePermissionSchema = Joi.object<PermissionByName>({
    name: Joi.string().required(),
});
export interface PermissionByName {
    name: string;
}



