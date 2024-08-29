import { Request } from "express";
import Joi from "joi";
import { SearchParams } from "../utils/search";


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

// define joi schema for update permission request by name
export interface UpdatePermissionByName extends Partial<CreatePermission> {}
export interface UpdatePermissionByNameRequest extends Request {
    body: UpdatePermissionByName;
    params: {
        name: string;
    };
}
export const updatePermissionByNameSchema = Joi.object<UpdatePermissionByName>({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
});
// define joi schema for update permission request by id
export interface UpdatePermissionById extends Partial<CreatePermission> {}
export interface UpdatePermissionByIdRequest extends Request {
    body: UpdatePermissionById;
    params: {
        id: string;
    };
}
export const updatePermissionByIdSchema = Joi.object<UpdatePermissionById>({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
});
// define joi schema for delete permission by name request
export interface DeletePermissionByNameRequest extends Request {
    params: {
        name: string;
    };
}
export const deletePermissionByNameSchema = Joi.object<PermissionByName>({
    name: Joi.string().required(),
});
export interface PermissionByName {
    name: string;
}
// define joi schema for delete permission by id request
export interface DeletePermissionByIdRequest extends Request {
    params: {
        id: string;
    };
}
export const deletePermissionByIdSchema = Joi.object<PermissionById>({
    id: Joi.string().required(),
});
export interface PermissionById {
    id: string;
}
// define joi schema for search permission request

export interface SearchPermissionRequest extends Request {
    query: {
        name?: string;
        description?: string;
    };
}

export const searchPermissionSchema = Joi.object<SearchPermission>({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
});

export interface SearchPermission extends SearchParams {
    name?: string;
    description?: string;
}

