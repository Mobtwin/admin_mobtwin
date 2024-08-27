import { Router } from "express";
import {
  createUserController,
  deleteUserByIdController,
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
} from "../controllers/user.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import {
  createUserSchema,
  updateUserSchema,
  userByIdSchema,
} from "../validators/user.validator";
import { checkPermission } from "../middlewares/rbac.middleware";
import { USER_PERMISSIONS, USER_TABLE } from "../constant/user.constant";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import cacheMiddleware from "../middlewares/cache.middleware";
import paginationMiddleware from "../middlewares/pagination.middleware";

export const userRouter = Router();

// method: POST
// path: /user/create
// Create a new user
userRouter.post(
  "/create",
  checkPermission([USER_PERMISSIONS.CREATE]),
  validateRequest(createUserSchema),
  createUserController
);

// method: GET
// path: /user
// Get all users
userRouter.get(
  "/",
  checkPermission([USER_PERMISSIONS.READ, USER_PERMISSIONS.READ_OWN]),
  cacheMiddleware(USER_TABLE),
  paginationMiddleware,
  getAllUsersController
);

// method: GET
// path: /user/:id
// Get user by id
userRouter.get(
  "/:id",
  validateRequest(userByIdSchema, "params"),
  checkPermission([USER_PERMISSIONS.READ], {
    table: USER_TABLE,
    action: PERMISSIONS_ACTIONS.READ,
  }),
  cacheMiddleware(USER_TABLE),
  getUserByIdController
);

// method: PUT
// path: /user/:id
// Update user by id
userRouter.put(
  "/:id",
  checkPermission([USER_PERMISSIONS.UPDATE], {
    table: USER_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  validateRequest(updateUserSchema),
  updateUserByIdController
);

// method: PUT
// path: /user/delete/:id
// delte user by id
userRouter.put(
  "/delete/:id",
  validateRequest(userByIdSchema, "params"),
  checkPermission([USER_PERMISSIONS.DELETE], {
    table: USER_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  deleteUserByIdController
);
