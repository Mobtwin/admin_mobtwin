import { Request } from "express";
import Joi from "joi";
import { IUser } from "../models/user.schema";

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



