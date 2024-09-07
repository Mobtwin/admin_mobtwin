import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { IAdminDocument, ROLES, ROLES_OPTIONS } from "../models/admin.schema";
import validate from 'deep-email-validator'
import { verifyPasswordStrength } from "../utils/string.format";
import { createAdmin, deleteAdminById, getAdminById, getAllAdmins, getSearchedAdmins, updateAdminById } from "../services/admin.service";
import { logEvents } from "../middlewares/logger";
import { AdminByIdRequest, CreateAdminRequest, SearchAdmin, SearchAdminRequest, UpdateAdminRequest } from "../validators/admin.validator";
import { ADMIN_PERMISSIONS, ADMIN_TABLE } from "../constant/admin.constant";
import { invalidateCache } from "../middlewares/cache.middleware";
import { constructSearchFilter } from "../utils/search";
import { SearchPermissionRequest } from "../validators/permission.validator";


//create a new admin
export const createAdminController = async (req: CreateAdminRequest, res: Response) => {
    try {
        const { userName, email, password, role } = req.body;
        //authorization
        if (!req.user) 
            return sendErrorResponse(res,null, "Unauthorized!",401);
        const user = req.user;
        //validation
        if(!userName)
            return sendErrorResponse(res,null, "Missing field. UserName is required",400);
        if(!email)
            return sendErrorResponse(res,null, "Missing field. Email is required",400);
        if(!password)
            return sendErrorResponse(res,null, "Missing field. Password is required",400);
        if (userName.length < 4)
            return sendErrorResponse(res,null, "UserName must be at least 4 characters long",400);
        if (password.length < 8)
            return sendErrorResponse(res,null, "Password must be at least 8 characters long",400);
        //password validation
        if (!verifyPasswordStrength(password))
            return sendErrorResponse(res,null, "Password is weak. Try a stronger password with at least 8 characters, one uppercase, one lowercase, one number and one special character!",400);
        //email validation
        const validationResult = await validate(email);
        if (!validationResult.valid)
            return sendErrorResponse(res,null, "Invalid email: "+validationResult.reason,400);
        //create admin
        createAdmin({userName, email, password, role},user.id).then((admin) => {
            logEvents(`${user.role}: ${user.userName} created by ${admin.role}: ${admin.userName}`, "actions.log");
            invalidateCache(ADMIN_TABLE).then(() => {
                return sendSuccessResponse(res, admin, 'Admin created successfully!', 200);
            }).catch((error) => {
                return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
            });
        }).catch((error) => {
            return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
        });
    } catch (error:any) {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    }
}

//get all admins
export const getAllAdminsController = async (req: Request, res: Response) => {
    try {
        //authorization
        if (!req.user) 
            return sendErrorResponse(res,null, "Unauthorized!",401);
        const user = req.user;
        const readOwn = user.permissions.includes(ADMIN_PERMISSIONS.READ_OWN);
        const { skip, limit } = res.locals;
        //get admins
        getAllAdmins({readOwn,userId:user.id,skip,limit}).then(({data,pagination}) => {
            return sendSuccessResponse(res, data, 'Admins retrieved successfully!', 200,pagination);
        }).catch((error) => {
            return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
        });
    } catch (error:any) {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    }
}

//get admin by id
export const getAdminByIdController = async (req: AdminByIdRequest, res: Response) => {
    try {
        const { id } = req.params;
        //authorization
        if (!req.user) 
            return sendErrorResponse(res,null, "Unauthorized!",401);
        const user = req.user;
        //validation
        if (!id)
            return sendErrorResponse(res,null, "Missing field. Admin ID is required",400);
        //get admin
        getAdminById(id).then((admin) => {
            return sendSuccessResponse(res, admin, 'Admin retrieved successfully!', 200);
        }).catch((error) => {
            return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
        });
    } catch (error:any) {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    }
}

//update admin by id
export const updateAdminByIdController = async (req: UpdateAdminRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { userName, email, password, role } = req.body;
        //authorization
        if (!req.user) 
            return sendErrorResponse(res,null, "Unauthorized!",401);
        const user = req.user;
        //validation
        if (!id)
            return sendErrorResponse(res,null, "Missing field. Admin ID is required",400);
        if (userName && userName.length < 4)
            return sendErrorResponse(res,null, "UserName must be at least 4 characters long",400);
        if (password && password.length < 8)
            return sendErrorResponse(res,null, "Password must be at least 8 characters long",400);
        
        //update admin
        updateAdminById(id,{userName,email,password,role}).then((admin) => {
            logEvents(`${user.role}: ${user.userName} updated by ${admin.role}: ${admin.userName}`, "actions.log");
            invalidateCache(ADMIN_TABLE).then(() => {
                return sendSuccessResponse(res, admin, 'Admin updated successfully!', 200);
            }).catch((error) => {
                return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
            });
        }).catch((error) => {
            return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
        });
    } catch (error:any) {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    }
}

//delete admin by id
export const deleteAdminByIdController = async (req: AdminByIdRequest, res: Response) => {
    try {
        const { id } = req.params;
        //authorization
        if (!req.user) 
            return sendErrorResponse(res,null, "Unauthorized!",401);
        const user = req.user;
        if (user.role !== ROLES_OPTIONS.admin)
            return sendErrorResponse(res,null, "Unauthorized!",401);
        //validation
        if (!id)
            return sendErrorResponse(res,null, "Missing field. Admin ID is required",400);
        //delete admin
        deleteAdminById(id).then((admin) => {
            logEvents(`${user.role}: ${user.userName} created by ${admin.role}: ${admin.userName}`, "actions.log");
            invalidateCache(ADMIN_TABLE).then(() => {
                return sendSuccessResponse(res, null, 'Admin deleted successfully!', 200);
            }).catch((error) => {
                return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
            });
        }).catch((error) => {
            return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
        });
    } catch (error:any) {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    }
}


// search admins table controller
export const searchAdminsTableController = async (req: SearchAdminRequest, res: Response) => {
    try {
      const searchParamas:SearchAdmin = {
        UserName: req.query.UserName,
        email: req.query.email,
        role: req.query.role,
      };
      const searchFilters = constructSearchFilter<IAdminDocument>(searchParamas);
      // search admins table
      getSearchedAdmins({skip:res.locals.skip,limit:res.locals.limit,filters:searchFilters}).then(({data,pagination})=>{
        return sendSuccessResponse(res, data, "Admins retrieved successfully!", 200,pagination);
      }).catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
    } catch (error: any) {
      return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
    }
  }




