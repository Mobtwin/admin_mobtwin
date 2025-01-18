import { Request } from "express";
import { IAdmin } from "../models/admin.schema";
import Joi from "joi";

//define a Joi schema for auth login request
export interface LoginAdmin extends Omit<IAdmin,"role"|"userName"> {
    userName?: string;
    code?: number;
}
export interface LoginAdminRequest extends Request {
    body: LoginAdmin;
}
export const loginAdminSchema = Joi.object<LoginAdmin>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    code: Joi.number().optional()
});




