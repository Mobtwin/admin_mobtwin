import { Request } from "express";
import { ITheme } from "../models/builder/theme.schema";
import Joi from "joi";

//define a Joi schema for theme creation request
export interface CreateTheme extends ITheme {}
export interface CreateThemeRequest extends Request {
    body: CreateTheme; 
}
export const createThemeSchema = Joi.object<CreateTheme>({
    name: Joi.string().required(),
    summary: Joi.string().optional(),
    codeSource: Joi.string().required(),
    templateId: Joi.string().required(),
});

//define a Joi schema for theme update request
export interface UpdateTheme extends Partial<Omit<ITheme,"removed_at">> {}
export interface UpdateThemeRequest extends Request {
    body: UpdateTheme; 
    params: { id: string };
}
export const updateThemeSchema = Joi.object<UpdateTheme>({
    name: Joi.string().optional(),
    summary: Joi.string().optional(),
    codeSource: Joi.string().optional(),
    templateId: Joi.string().optional(),
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

