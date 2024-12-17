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
import { paginationQuerySchema } from "../validators/pagination.validator";

export const userRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage users
 */
/**
 * @swagger
 * /user/create:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Create a new user account with username, email, and password. Includes validation for password strength and email format.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account created successfully!
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Missing field. Email is required!
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Unauthorized!
 *       403:
 *         description: Forbidden due to missing or invalid permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Forbidden Insufficient permissions!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Error! Something went wrong
 */

userRouter.post(
  "/create",
  checkPermission([USER_PERMISSIONS.CREATE]),
  validateRequest(createUserSchema),
  createUserController
);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users with pagination, depending on the user's permissions.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number for pagination
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of records per page
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of users successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users fetched successfully!
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     skip:
 *                       type: integer
 *                       example: 0
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Missing field. Email is required!
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Unauthorized!
 *       403:
 *         description: Forbidden due to missing or invalid permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Forbidden Insufficient permissions!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Error! Something went wrong
 */
userRouter.get(
  "/",
  checkPermission([USER_PERMISSIONS.READ, USER_PERMISSIONS.READ_OWN]),
  validateRequest(paginationQuerySchema, "query"),
  cacheMiddleware(USER_TABLE),
  paginationMiddleware,
  getAllUsersController
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user by their unique ID. Requires appropriate permissions.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the user.
 *         schema:
 *           type: string
 *           example: "user_id_123"
 *     responses:
 *       200:
 *         description: User fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User fetched successfully!
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, such as missing or invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Missing field. User ID is required
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized!
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       403:
 *         description: Forbidden due to missing or invalid permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Forbidden Insufficient permissions!
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error! <error_message>
 */

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

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user by ID
 *     description: Update a user's information by their unique ID. Requires the 'UPDATE' permission.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the user.
 *         schema:
 *           type: string
 *           example: "user_id_123"
 *     requestBody:
 *       description: User information to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "John Doe Updated"
 *               firstName:
 *                 type: string
 *                 example: "John Doe Updated"
 *               lastName:
 *                 type: string
 *                 example: "John Doe Updated"
 *               email:
 *                 type: string
 *                 example: "updatedemail@example.com"
 *               password:
 *                 type: string
 *                 example: "Strong@1234"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               removed_at:
 *                 type: string
 *                 example: "2022-12-31T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User updated successfully!
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request due to validation error (e.g., weak password, invalid email, etc.).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Password is weak. Try a stronger password."
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Unauthorized!
 *       403:
 *         description: Forbidden due to insufficient permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Forbidden. Insufficient permissions!
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Error! Something went wrong.
 */

userRouter.put(
  "/:id",
  checkPermission([USER_PERMISSIONS.UPDATE], {
    table: USER_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  validateRequest(updateUserSchema),
  updateUserByIdController
);

/**
 * @swagger
 * /user/delete/{id}:
 *   put:
 *     summary: Soft delete a user by ID
 *     description: Soft delete a user by their unique ID. Requires the 'DELETE' permission.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the user to delete.
 *         schema:
 *           type: string
 *           example: "user_id_123"
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully!
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request due to validation error (e.g., missing user ID).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Missing field. User ID is required.
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Unauthorized!
 *       403:
 *         description: Forbidden due to insufficient permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Forbidden. Insufficient permissions!
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Error! Something went wrong.
 */

userRouter.put(
  "/delete/:id",
  validateRequest(userByIdSchema, "params"),
  checkPermission([USER_PERMISSIONS.DELETE], {
    table: USER_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  deleteUserByIdController
);
