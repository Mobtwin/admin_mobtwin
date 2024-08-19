import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { CreateThemeRequest, ThemeByIdRequest, UpdateThemeRequest } from "../validators/theme.validator";
import { ROLES } from "../models/admin.schema";
import { logEvents } from "../middlewares/logger";
import { createTheme, deleteTheme, getAllThemes, getThemeById, updateTheme } from "../services/theme.service";
import { THEME_PERMISSIONS } from "../constant/theme.constant";

// create new Theme
export const createThemeController = async (req: CreateThemeRequest, res: Response) => {
    try {
        // Authization
        if (!req.user) 
            return sendErrorResponse(res,null,"Unauthorized!",401);
        const user = req.user;
        
        // create theme
        createTheme(req.body,user.id).then((theme) => {
            logEvents(`Theme: ${theme.name} created by ${user.role}: ${user.userName}`, "actions.log");
            return sendSuccessResponse(res, theme, "Theme created successfully!", 201);
        }).catch((error) => {
            return sendErrorResponse(res,error,"Error",400);
        });
    } catch (error) {
        return sendErrorResponse(res,error,"Error",500);
    }
}

// get all themes
export const getAllThemesController = async (req: Request, res: Response) => {
    try {
        // Authization
        if (!req.user) 
            return sendErrorResponse(res,null,"Unauthorized!",401);
        const user = req.user;
        const readOwn = user.permissions.includes(THEME_PERMISSIONS.READ_OWN);

        // get all themes
        getAllThemes({readOwn,userId:user.id}).then((themes) => {
            return sendSuccessResponse(res, themes, "Themes fetched successfully!", 200);
        }).catch((error) => {
            return sendErrorResponse(res,error,"Error",400);
        });
    } catch (error) {
        return sendErrorResponse(res,error,"Error",500);
    }
}

// get theme by id
export const getThemeByIdController = async (req: ThemeByIdRequest, res: Response) => {
    try {
        // Authization
        if (!req.user) 
            return sendErrorResponse(res,null,"Unauthorized!",401);
        const user = req.user;
        
        //validate id
        const {id} = req.params;
        if (!id) 
            return sendErrorResponse(res,null,"Theme Id is required!",400);
        // get theme by id
        getThemeById(id).then((theme) => {
            return sendSuccessResponse(res, theme, "Theme fetched successfully!", 200);
        }).catch((error) => {
            return sendErrorResponse(res,error,"Error",400);
        });
    } catch (error) {
        return sendErrorResponse(res,error,"Error",500);
    }
}

// update theme by id
export const updateThemeController = async (req: UpdateThemeRequest, res: Response) => {
    try {
        // Authization
        if (!req.user) 
            return sendErrorResponse(res,null,"Unauthorized!",401);
        const user = req.user;
        
        //validate id
        const {id} = req.params;
        if (!id) 
            return sendErrorResponse(res,null,"Theme Id is required!",400);
        // update theme by id
        updateTheme(id,req.body).then((theme) => {
            logEvents(`Theme: ${theme.name} updated by ${user.role}: ${user.userName}`, "actions.log");
            return sendSuccessResponse(res, theme, "Theme updated successfully!", 200);
        }).catch((error) => {
            return sendErrorResponse(res,error,"Error",400);
        });
    } catch (error) {
        return sendErrorResponse(res,error,"Error",500);
    }
}

// delete theme by id
export const deleteThemeController = async (req: ThemeByIdRequest, res: Response) => {
    try {
        // Authization
        if (!req.user) 
            return sendErrorResponse(res,null,"Unauthorized!",401);
        const user = req.user;
        
        //validate id
        const {id} = req.params;
        if (!id) 
            return sendErrorResponse(res,null,"Theme Id is required!",400);
        // delete theme by id
        deleteTheme(id).then((theme) => {
            logEvents(`Theme: ${theme.name} deleted by ${user.role}: ${user.userName}`, "actions.log");
            return sendSuccessResponse(res, theme, "Theme deleted successfully!", 200);
        }).catch((error) => {
            return sendErrorResponse(res,error,"Error",400);
        });
    } catch (error) {
        return sendErrorResponse(res,error,"Error",500);
    }
}

























