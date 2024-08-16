import { Request } from "express";
import Joi from "joi";
import { IAdmin, ROLES, ROLES_OPTIONS } from "../models/admin.schema";


// Define a Joi schema for admin creation request
export const createAdminSchema = Joi.object<CreateAdmin>({
    email: Joi.string().email().required(),
    userName: Joi.string().min(4).max(30).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("admin", "maintainer").required(),
});
export interface CreateAdmin {
    email: string;
    password: string;
    userName: string;
    role: "admin" | "maintainer";
}

export interface CreateAdminRequest extends Request {
    body: CreateAdmin; 
}

// Define a Joi schema for admin delete and retrieve by id request
export const adminByIdSchema = Joi.object<AdminById>({
    id: Joi.string().required(),
});
export interface AdminById {
    id: string;
}
export interface AdminByIdRequest extends Request {
    params: {
        id: string;
    }; 
}

// Define a Joi schema for admin update by id request
export const updateAdminSchema = Joi.object<UpdateAdmin>({
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).optional(),
    userName: Joi.string().min(4).max(30).optional(),
    role: Joi.string().valid("admin", "maintainer").optional(),
});
export interface UpdateAdmin extends Partial<Omit<IAdmin, 'removed_at'>> {};
export interface UpdateAdminRequest extends Request {
    params: {
        id: string;
    };
    body: UpdateAdmin;
}


