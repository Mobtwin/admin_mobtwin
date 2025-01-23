import { Request } from "express";
import Joi from "joi";
import { IAdmin } from "../models/admin.schema";
import { SearchParams } from "../utils/search";
import { PaginationQuery, PaginationQueryRequest } from "./pagination.validator";


// Define a Joi schema for admin creation request
export const createAdminSchema = Joi.object<CreateAdmin>({
    email: Joi.string().email().required(),
    userName: Joi.string().min(4).max(30).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().required(),
});
export interface CreateAdmin {
    email: string;
    password: string;
    userName: string;
    role: string;
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
    role: Joi.string().optional(),
});
export interface UpdateAdmin extends Partial<Omit<IAdmin, 'removed_at'>> {};
export interface UpdateAdminRequest extends Request {
    params: {
        id: string;
    };
    body: UpdateAdmin;
}


// define joi schema for search admins request

export interface SearchAdminRequest extends PaginationQueryRequest {
    query: {
        userName?: string;
        email?: string;
    };
}

export const searchAdminSchema = Joi.object<SearchAdmin&PaginationQuery>({
    userName: Joi.string().optional(),
    email: Joi.string().optional(),
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(10),
});

export interface SearchAdmin extends SearchParams {
    userName?: string;
    email?: string;
}


// Define a Joi schema for admin creation request
export const deleteAdminSessionSchema = Joi.object<DeleteAdminSession>({
    adminId: Joi.string().required(),
});
export interface DeleteAdminSession {
    adminId: string;
}

export interface DeleteAdminSessionRequest extends Request {
    body: DeleteAdminSession; 
}