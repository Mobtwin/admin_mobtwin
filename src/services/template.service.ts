import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import { TEMPLATE_PERMISSIONS, TEMPLATE_TABLE } from "../constant/template.constant";
import { Templates } from "../models/builder/templates.schema";
import { CreateTemplate, UpdateTemplate } from "../validators/template.validator";
import { getOwnItemsByPermissionAction } from "./itemSpecificPermissions.service";

// create a new template
export const createTemplate = async (template: CreateTemplate) => {
    try {
        // create template
        const newTemplate = await Templates.create(template);
        if (!newTemplate) throw new Error("Template not created!");
        return newTemplate;
    } catch (error: any) {
        throw error;
    }
};

// get all templates
export const getAllTemplates = async ({readOwn=false,userId}:{readOwn:boolean,userId:string}) => {
    try {
        if(readOwn){
            const templateIds = await getOwnItemsByPermissionAction(userId,TEMPLATE_TABLE,PERMISSIONS_ACTIONS.READ)
            const templates = await Templates.find({_id:{$in:templateIds}});
            return templates;
        }
        // get all templates
        const templates = await Templates.find();
        if (!templates) throw new Error("Templates not found!");
        return templates;
    } catch (error: any) {
        throw error;
    }
};

// get template by id
export const getTemplateById = async (id: string) => {
    try {
        // get template by id
        const template = await Templates.findById(id);
        if (!template) throw new Error("Template not found!");
        return template;
    } catch (error: any) {
        throw error;
    }
}

// update template by id
export const updateTemplateById = async (id: string, template: UpdateTemplate) => {
    try {
        // update template by id
        const updatedTemplate = await Templates.findByIdAndUpdate(id, {...template}, { new: true });
        if (!updatedTemplate) throw new Error("Template not updated!");
        return updatedTemplate;
    } catch (error: any) {
        throw error;
    }
}

// delete template by id
export const deleteTemplateById = async (id: string) => {
    try {
        // delete template by id
        const deletedTemplate = await Templates.findByIdAndUpdate(id, { removed_at: new Date() }, { new: true });
        if (!deletedTemplate) throw new Error("Template not deleted!");
        return deletedTemplate;
    } catch (error: any) {
        throw error;
    }
}






















