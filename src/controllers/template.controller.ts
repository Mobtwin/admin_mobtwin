import { Request, Response } from "express";
import { ROLES } from "../models/admin.schema";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { createTemplate, deleteTemplateById, getAllTemplates, getTemplateById, updateTemplateById } from "../services/template.service";
import { logEvents } from "../middlewares/logger";
import { CreateTemplateRequest, TemplateByIdRequest, UpdateTemplateRequest } from "../validators/template.validator";
import { TEMPLATE_PERMISSIONS } from "../constant/template.constant";

// create a new template
export const createTemplateController = async (req: CreateTemplateRequest, res: Response) => {
    try {
        // authorization
        if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
        const user = req.user;

        //create template
        createTemplate(req.body).then((value) => {
            logEvents(`Template: ${value.name} created by ${user.role}: ${user.userName}`, "actions.log");
            return sendSuccessResponse(res, value, "Template created successfully!", 201);
        }).catch((error) => {
            return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

//get all templates
export const getAllTemplatesController = async (req: Request, res: Response) => {
    try {
        // authorization
        if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
        const user = req.user;
        const readOwn = user.permissions.includes(TEMPLATE_PERMISSIONS.READ_OWN);
        getAllTemplates({readOwn,userId:user.id}).then((value) => {
            return sendSuccessResponse(res, value, "Templates fetched successfully!", 200);
        }).catch((error) => {
            return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

//get template by id
export const getTemplateByIdController = async (req: TemplateByIdRequest, res: Response) => {
    try {
        // authorization
        if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
        const user = req.user;

        const { id } = req.params;
        if (!id) return sendErrorResponse(res, null, "Missing field. Template ID is required", 400);

        // get template
        getTemplateById(id).then((value) => {
            return sendSuccessResponse(res, value, "Template fetched successfully!", 200);
        }).catch((error) => {
            return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

//update template by id
export const updateTemplateByIdController = async (req: UpdateTemplateRequest, res: Response) => {
    try {
        // authorization
        if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
        const user = req.user;

        const { id } = req.params;
        if (!id) return sendErrorResponse(res, null, "Missing field. Template ID is required", 400);

        // update template
        updateTemplateById(id, req.body).then((value) => {
            logEvents(`Template: ${value.name} updated by ${user.role}: ${user.userName}`, "actions.log");
            return sendSuccessResponse(res, value, "Template updated successfully!", 200);
        }).catch((error) => {
            return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}

//delete template by id
export const deleteTemplateByIdController = async (req: TemplateByIdRequest, res: Response) => {
    try {
        // authorization
        if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
        const user = req.user;
        

        const { id } = req.params;
        if (!id) return sendErrorResponse(res, null, "Missing field. Template ID is required", 400);

        // delete template
        deleteTemplateById(id).then((value) => {
            logEvents(`Template: ${value.name} deleted by ${user.role}: ${user.userName}`, "actions.log");
            return sendSuccessResponse(res, value, "Template deleted successfully!", 200);
        }).catch((error) => {
            return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}



























