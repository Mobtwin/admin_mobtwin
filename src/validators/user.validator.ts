import { Request } from "express";
import Joi from "joi";
import { IUser } from "../models/user.schema";
import { PaginationQuery, PaginationQueryRequest } from "./pagination.validator";
import { SearchParams } from "../utils/search";

// Define a Joi schema for user creation request
export const createUserSchema = Joi.object<CreateUser>({
    email: Joi.string().email().required(),
    userName: Joi.string().min(4).max(30).required(),
    password: Joi.string().min(8).required(),
});
export interface CreateUser {
    email: string;
    password: string;
    userName: string;
}

export interface CreateUserRequest extends Request {
    body: CreateUser; 
}

// Define a Joi schema for user delete and retrieve by id request
export const userByIdSchema = Joi.object<UserById>({
    id: Joi.string().required(),
});
export interface UserById {
    id: string;
}
export interface UserByIdRequest extends Request {
    params: {
        id: string;
    }; 
}
// Define a Joi schema for user update by id request
export const updateUserSchema = Joi.object<UpdateUser>({
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).optional(),
    userName: Joi.string().min(4).max(30).optional(),
    firstName: Joi.string().min(2).max(30).optional(),
    lastName: Joi.string().min(2).max(30).optional(),
    phoneNumber: Joi.string().min(10).max(15).optional(),
    avatar: Joi.string().optional(),
    otp: Joi.object({
        code: Joi.number().required(),
        type: Joi.string(),
        metadata: Joi.string(),
        expiresAt: Joi.date(),
    }).optional(),
});
export interface UpdateUser extends Partial<Omit<IUser, 'removed_at'>> {};
export interface UpdateUserRequest extends Request {
    params: {
        id: string;
    };
    body: UpdateUser;
}

// define joi schema for search users request

export interface SearchUsersRequest extends PaginationQueryRequest {
    query: {
        userName?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
    };
}

export const searchUsersSchema = Joi.object<SearchUsers&PaginationQuery>({
    userName: Joi.string().optional(),
    email: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(10),
});

export interface SearchUsers extends SearchParams {
    userName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}


