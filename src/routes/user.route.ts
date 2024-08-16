import { Router } from "express";
import { createUserController, deleteUserByIdController, getAllUsersController, getUserByIdController, updateUserByIdController } from "../controllers/user.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import { createUserSchema, updateUserSchema, userByIdSchema } from "../validators/user.validator";


export const userRouter = Router();

// method: POST
// path: /user/create
// Create a new user
userRouter.post('/create',validateRequest(createUserSchema), createUserController);

// method: GET
// path: /user
// Get all users
userRouter.get('/' ,getAllUsersController);

// method: GET
// path: /user/:id
// Get user by id
userRouter.get('/:id',validateRequest(userByIdSchema,'params'),getUserByIdController);

// method: PUT
// path: /user/:id
// Update user by id
userRouter.put('/:id',validateRequest(updateUserSchema),updateUserByIdController);

// method: PUT
 // path: /user/delete/:id
 // delte user by id
userRouter.put('/delete/:id',validateRequest(userByIdSchema, 'params'), deleteUserByIdController);



