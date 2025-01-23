import { Router } from "express";
import {
  createAdminController,
  deleteAdminByIdController,
  deleteAdminSessionController,
  getAdminByIdController,
  getAllAdminsController,
  searchAdminsTablController,
  updateAdminByIdController,
} from "../controllers/admin.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import {
  adminByIdSchema,
  createAdminSchema,
  deleteAdminSessionSchema,
  searchAdminSchema,
  updateAdminSchema,
} from "../validators/admin.validator";
import { checkPermission } from "../middlewares/rbac.middleware";
import { ADMIN_PERMISSIONS, ADMIN_TABLE } from "../constant/admin.constant";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import cacheMiddleware from "../middlewares/cache.middleware";
import paginationMiddleware from "../middlewares/pagination.middleware";
import { paginationQuerySchema } from "../validators/pagination.validator";

export const adminRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: API to manage admins
 */

/**
 * @swagger
 * /admin/create:
 *   post:
 *     tags: [Admins]
 *     summary: Create a new admin
 *     description: Create a new admin in the system with necessary validation and permission checks.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Admin object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdmin'
 *     responses:
 *       201:
 *         description: Admin Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *                 message:
 *                   type: string
 *                   example: Admin created successfully!
 *       400:
 *         description: Bad request due to missing or invalid email address
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
 *                   example: Missing field. email address is required
 *       401:
 *         description: Unauthorized due to missing or invalid token
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
 *                   example: Error Something went wrong
 */
adminRouter.post(
  "/create",
  checkPermission(ADMIN_PERMISSIONS.CREATE),
  validateRequest(createAdminSchema),
  createAdminController
);
/**
 * @swagger
 * /admin/logout:
 *   post:
 *     summary: Delete an admin session (logout).
 *     description: Allows an authorized admin to delete the session of another admin, effectively logging them out.
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for deleting the admin session.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminId
 *             properties:
 *               adminId:
 *                 type: string
 *                 description: The unique ID of the admin whose session will be deleted.
 *                 example: "64f3b2c9d47b4e1a4f123456"
 *     responses:
 *       200:
 *         description: Admin session deleted successfully.
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
 *                   example: "Admin session deleted successfully!"
 *       400:
 *         description: Bad request due to missing or invalid fields.
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
 *                   example: "Missing field. adminId is required."
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
 *                 error:
 *                   type: string
 *                   example: "Unauthorized!"
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
 *                 error:
 *                   type: string
 *                   example: "Error: Something went wrong on the server."
 */
adminRouter.post(
  "/logout",
  checkPermission(ADMIN_PERMISSIONS.UPDATE),
  validateRequest(deleteAdminSessionSchema),
  deleteAdminSessionController
);
/**
 * @swagger
 * /admin:
 *   get:
 *     tags: [Admins]
 *     summary: Get all admins
 *     description: Fetch a paginated list of all admins with caching and permission checks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of records per page
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Bad request due to missing or invalid fields or parameters
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
 *                   example: Missing field.
 *       401:
 *         description: Unauthorized due to missing or invalid token
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
 *                   example: Error Something went wrong
 */
adminRouter.get(
  "/",
  checkPermission([ADMIN_PERMISSIONS.READ, ADMIN_PERMISSIONS.READ_OWN]),
  validateRequest(paginationQuerySchema,"query"),
  cacheMiddleware(ADMIN_TABLE),
  paginationMiddleware,
  getAllAdminsController
);
/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     tags: [Admins]
 *     summary: Get admin by ID
 *     description: Retrieve an admin's details by their unique ID. Requires authentication and appropriate permissions.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the admin to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *                 message:
 *                   type: string
 *                   example: Admin retrieved successfully!
 *       400:
 *         description: Bad request due to missing or invalid admin ID
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
 *                   example: Missing field. Admin ID is required
 *       401:
 *         description: Unauthorized due to missing or invalid token
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
 *                   example: Error Something went wrong
 */
adminRouter.get(
  "/:id",
  validateRequest(adminByIdSchema, "params"),
  checkPermission([ADMIN_PERMISSIONS.READ], {
    table: ADMIN_TABLE,
    action: PERMISSIONS_ACTIONS.READ,
  }),
  cacheMiddleware(ADMIN_TABLE),
  getAdminByIdController
);
/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     tags: [Admins]
 *     summary: Update admin by ID
 *     description: Update an admin's details by their unique ID. Requires authentication, appropriate permissions, and validation checks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the admin to update
 *     requestBody:
 *       description: Admin object containing fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 minLength: 4
 *                 example: "newUserName"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "newemail@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "newStrongPassword123"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *                 message:
 *                   type: string
 *                   example: Admin updated successfully!
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
 *                   example: UserName length must be at least 4 characters long
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
 *                   example: Error Something went wrong
 */

adminRouter.put(
  "/:id",
  checkPermission([ADMIN_PERMISSIONS.UPDATE], {
    table: ADMIN_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  validateRequest(updateAdminSchema),
  updateAdminByIdController
);
/**
 * @swagger
 * /admin/delete/{id}:
 *   put:
 *     tags: [Admins]
 *     summary: Delete admin by ID
 *     description: Deletes an admin by their unique ID. Requires authentication, permissions, and validation checks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the admin to delete
 *     responses:
 *       200:
 *         description: Admin successfully deleted
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
 *                   example: Admin deleted successfully!
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
 *                   example: Missing field. Admin ID is required
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
adminRouter.put(
  "/delete/:id",
  checkPermission([ADMIN_PERMISSIONS.DELETE], {
    table: ADMIN_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  validateRequest(adminByIdSchema,"params"),
  deleteAdminByIdController
);

/**
 * @swagger
 * /admin/search/here:
 *   get:
 *     tags: [Admins]
 *     summary: Search for admins
 *     description: Retrieve a paginated list of admins based on search criteria. Includes filtering by username, email, and role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userName
 *         schema:
 *           type: string
 *         description: Filter by admin username
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by admin email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of results per page
 *     responses:
 *       200:
 *         description: Admins retrieved successfully
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
 *                   example: Admins retrieved successfully!
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Admin'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalResults:
 *                       type: integer
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
 *                   example: Missing or invalid parameters
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

adminRouter.get(
  "/search/here",
  validateRequest(searchAdminSchema, "query"),
  checkPermission([
    ADMIN_PERMISSIONS.READ,
    ADMIN_PERMISSIONS.READ_OWN,
  ]),
  paginationMiddleware,
  cacheMiddleware(ADMIN_TABLE),
  searchAdminsTablController
);