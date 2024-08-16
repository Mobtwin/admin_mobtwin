import { Request } from "express";
import { IAdmin } from "../models/admin.schema";
import Joi from "joi";

//define a Joi schema for auth login request
export interface LoginAdmin extends Omit<IAdmin,"role"|"userName"> {
    userName?: string;
}
export interface LoginAdminRequest extends Request {
    body: LoginAdmin;
}
export const loginAdminSchema = Joi.object<LoginAdmin>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

//define a Joi schema for auth refresh request
export interface RefreshAdmin {
    refreshToken: string;
}
export interface RefreshAdminRequest extends Request {
    body: RefreshAdmin;
}
export const refreshAdminSchema = Joi.object<RefreshAdmin>({
    refreshToken: Joi.string().required(),
});
//define a Joi schema for auth logout request
export interface LogoutAdmin {
    refreshToken: string;
}
export interface LogoutAdminRequest extends Request {
    body: LogoutAdmin;
}
export const logoutAdminSchema = Joi.object<LogoutAdmin>({
    refreshToken: Joi.string().required(),
});


