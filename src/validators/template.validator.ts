import { Request } from "express";
import { ITemplate, TEMPLATE_TYPES } from "../models/builder/templates.schema";
import Joi from "joi";

//define a Joi schema for template creation request
export interface CreateTemplate extends ITemplate {}
export interface CreateTemplateRequest extends Request {
    body: CreateTemplate; 
}
export const createTemplateSchema = Joi.object<CreateTemplate>({
    name: Joi.string().required(),
    type: Joi.string().valid("application", "game").required(),
});

//define a Joi schema for template update request
export interface UpdateTemplate extends Partial<Omit<ITemplate,"removed_at">> {}
export interface UpdateTemplateRequest extends Request {
    body: UpdateTemplate; 
    params: { id: string };
}
export const updateTemplateSchema = Joi.object<UpdateTemplate>({
    name: Joi.string().optional(),
    type: Joi.string().valid("application", "game").optional(),
});

//define a Joi schema for template id retrieve and delete request
export interface TemplateById {
    id: string;
}
export interface TemplateByIdRequest extends Request {
    params: { id: string };
}
export const templateByIdSchema = Joi.object<TemplateById>({
    id: Joi.string().required(),
});



























