import { Request } from "express";
import { ITheme } from "../models/builder/theme.schema";
import Joi from "joi";

//define a Joi schema for theme creation request
export interface CreateTheme extends Omit<ITheme,"status"> {}
export interface CreateThemeRequest extends Request {
    body: CreateTheme; 
}
export const createThemeSchema = Joi.object<CreateTheme>({
    name: Joi.string().required(),
    summary: Joi.string().optional(),
    repoName: Joi.string().required(),
    repoOwner: Joi.string().required(),
    templateId: Joi.string().required(),
    posters: Joi.array().items(Joi.string()).required(),
    featured: Joi.boolean().optional().default(false),
});

//define a Joi schema for theme update request
export interface UpdateTheme extends Partial<Omit<ITheme,"status">> {}
export interface UpdateThemeRequest extends Request {
    body: UpdateTheme; 
    params: { id: string };
}
export const updateThemeSchema = Joi.object<UpdateTheme>({
    name: Joi.string().optional(),
    summary: Joi.string().optional(),
    repoName: Joi.string().optional(),
    repoOwner: Joi.string().optional(),
    templateId: Joi.string().optional(),
    posters: Joi.array().items(Joi.string()).optional(),
    featured: Joi.boolean().optional(),
});

// define a Joi schema for theme id request
export interface ThemeById {
    id: string ;
}
export interface ThemeByIdRequest extends Request {
    params: { id: string };
}
export const themeByIdSchema = Joi.object<ThemeById>({
    id: Joi.string().required(),
});

//define a Joi schema for theme status update request

export interface UpdateThemeStatus extends Partial<Pick<ITheme, "status">> {}
export interface UpdateThemeStatusRequest extends Request {
    body: UpdateThemeStatus; 
    params: { id: string };
}

export const updateThemeStatusSchema = Joi.object<UpdateThemeStatus>({
    status: Joi.string().valid("pending", "approved","rejected").required(),
});
