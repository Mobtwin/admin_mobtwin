import { Request } from "express";
import Joi from "joi";

// define a joi schema for create role request
export interface CreateRole {
    name: string;
    permissions: string[];
}
export interface CreateRoleRequest extends Request {
    body: CreateRole;
}
export const createRoleSchema = Joi.object<CreateRole>({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).required(),
});

// define a joi schema for assign permissions request
export interface TogglePermissions {
    permissions: string[];
}
export interface TogglePermissionsRequest extends Request {
    body: TogglePermissions;
}
export const togglePermissionsSchema = Joi.object<TogglePermissions>({
    permissions: Joi.array().items(Joi.string()).required(),
});

// define a joi schema for role by id request
export interface RoleByIdRequest extends Request {
    params: {
        id: string;
    };
}
export interface RoleByNameRequest extends Request {
    params: {
        name: string;
    };
}
export const roleByIdSchema = Joi.object<RoleById>({
    id: Joi.string().required(),
});
export const roleByNameSchema = Joi.object<RoleByName>({
    name: Joi.string().required(),
});
export interface RoleById {
    id: string;
}
export interface RoleByName {
    name: string;
}