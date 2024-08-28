import { Request } from "express";
import Joi from "joi";


// define joi schema for create permission request
export interface CreatePermission {
    name: string;
    description:string;
}
export interface CreatePermissionRequest extends Request {
    body: CreatePermission;
}
export const createPermissionSchema = Joi.object<CreatePermission>({
    name: Joi.string().required(),
    description: Joi.string().required(),
});

// define joi schema for update permission request
export interface UpdatePermission extends Partial<CreatePermission> {}
export interface UpdatePermissionRequest extends Request {
    body: UpdatePermission;
    params: {
        name: string;
    };
}
export const updatePermissionSchema = Joi.object<UpdatePermission>({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
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



