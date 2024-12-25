import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { verifyPasswordStrength } from "../utils/string.format";
import validate from "deep-email-validator";
import { createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from "../services/user.service";
import { ROLES, ROLES_OPTIONS } from "../models/admin.schema";
import { logEvents } from "../middlewares/logger";
import { CreateUserRequest, UpdateUserRequest, UserByIdRequest } from "../validators/user.validator";
import { USER_PERMISSIONS, USER_TABLE } from "../constant/user.constant";
import { invalidateCache } from "../middlewares/cache.middleware";

//create new user
export const createUserController = async (req: CreateUserRequest, res: Response) => {
  try {
    const { userName, email, password } = req.body;
    const ipAddress = req.headers["x-forwarded-for"] as string;
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    
    if (!email)
      return sendErrorResponse(res,null,"Missing field. Email is required!",400);

    if (!password)
      return sendErrorResponse(res,null,"Missing field. Password is required!",400);

    if (!userName)
      return sendErrorResponse(res,null,"Missing field. Username is required!",400);
    //password validation
    if (!verifyPasswordStrength(password))
      return sendErrorResponse(res,null,"Password is weak. Try a stronger password with at least 8 characters, one uppercase, one lowercase, one number and one special character!",400);
    //email validation
    const validationResult = await validate(email);
    if (!validationResult.valid)
      return sendErrorResponse(res,null,"Invalid email: " + validationResult.reason,400);
    createUser(userName, email, password, ipAddress)
      .then((value) => {
        logEvents(`User: ${value.userName} created by ${user.role}: ${user.userName}`, "actions.log");
        invalidateCache(USER_TABLE).then(() => {
          return sendSuccessResponse(res,value,"Account created successfully!",201);
        }).catch((error) => {
          return sendErrorResponse(res,error,`Error: ${error.message}`,400);
        });
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

//get all users
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    const readOwn = user.permissions.includes(USER_PERMISSIONS.READ_OWN);
    const {skip,limit} = res.locals;
    //get users
    getAllUsers({ readOwn, userId: user.id, skip, limit})
      .then(({data,pagination}) => {
        return sendSuccessResponse(
          res,
          data,
          "Users fetched successfully!",
          200,
          pagination
        );
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

//get user by id
export const getUserByIdController = async (req: UserByIdRequest, res: Response) => {
  try {
    const { id } = req.params;
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    
    //validation
    if (!id)
      return sendErrorResponse(res, null, "Missing field. User ID is required", 400);
    //get user
    getUserById(id)
      .then((user) => {
        return sendSuccessResponse(res, user, "User fetched successfully!", 200);
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

//update user by id
export const updateUserByIdController = async (req: UpdateUserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userInfo = req.body;
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    
    //validation
    if (!id)
      return sendErrorResponse(res, null, "Missing field. User ID is required", 400);
    //password validation
    if (userInfo.password && !verifyPasswordStrength(userInfo.password))
      return sendErrorResponse(res, null, "Password is weak. Try a stronger password with at least 8 characters, one uppercase, one lowercase, one number and one special character!", 400);
    //email validation
    if (userInfo.email) {
      const validationResult = await validate(userInfo.email);
      if (!validationResult.valid)
        return sendErrorResponse(res, null, "Invalid email: " + validationResult.reason, 400);
    }
    //update user
    updateUserById(id, userInfo)
      .then((updatedUser) => {
        logEvents(`User: ${user.userName} updated by ${user.role}: ${user.userName}`, "actions.log");
        invalidateCache(USER_TABLE).then(() => {
          return sendSuccessResponse(res, updatedUser, "User updated successfully!", 200);
        }).catch((error) => {
          return sendErrorResponse(res,error,`Error: ${error.message}`,400);
        });
        
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

//delete user by id
export const deleteUserByIdController = async (req: UserByIdRequest, res: Response) => {
  try {
    const { id } = req.params;
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    
    //validation
    if (!id)
      return sendErrorResponse(res, null, "Missing field. User ID is required", 400);
    //delete user
    deleteUserById(id)
      .then((deletedUser) => {
        logEvents(`User: ${user.userName} deleted by ${user.role}: ${user.userName}`, "actions.log");
        invalidateCache(USER_TABLE).then(() => {
          return sendSuccessResponse(res, deletedUser, "User deleted successfully!", 200);
        }).catch((error) => {
          return sendErrorResponse(res,error,`Error: ${error.message}`,400);
        });
        
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};



// search users table controller
export const searchUsersTablController = async (req: SearchUsersRequest, res: Response) => {
  try {
    const searchParamas:SearchUsers = {
      userName: req.query.userName,
      email: req.query.email,
    };
    const searchFilters = constructSearchFilter<IUser>(searchParamas);
    // search users table
    getSearchedUsers({skip:res.locals.skip,limit:res.locals.limit,filters:{...searchFilters,removed_at: { $exists: false }}}).then(({data,pagination})=>{
      return sendSuccessResponse(res, data, "Users retrieved successfully!", 200,pagination);
    }).catch((error) => {
      return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
    });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
}







