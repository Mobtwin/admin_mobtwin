import { Router } from "express";
import {
  createTemplateController,
  deleteTemplateByIdController,
  getAllTemplatesController,
  getTemplateByIdController,
  updateTemplateByIdController,
} from "../controllers/template.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import {
  createTemplateSchema,
  templateByIdSchema,
  updateTemplateSchema,
} from "../validators/template.validator";
import { checkPermission } from "../middlewares/rbac.middleware";
import {
  TEMPLATE_PERMISSIONS,
  TEMPLATE_TABLE,
} from "../constant/template.constant";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import cacheMiddleware from "../middlewares/cache.middleware";
import paginationMiddleware from "../middlewares/pagination.middleware";
import { paginationQuerySchema } from "../validators/pagination.validator";

export const templateRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: API to manage templates
 */
/**
 * @swagger
 * /template:
 *   post:
 *     summary: Create a new template
 *     description: Allows authenticated users with the required permissions to create a new template.
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTemplate'
 *     responses:
 *       201:
 *         description: Template created successfully
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
 *                   example: Template created successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       400:
 *         description: Bad request - Invalid input data
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
 *                   example: Invalid request body
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
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
 *         description: Forbidden. User lacks sufficient permissions
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
 *                   example: Error! Unable to create the template
 */
templateRouter.post(
  "/",
  checkPermission([TEMPLATE_PERMISSIONS.CREATE]),
  validateRequest(createTemplateSchema),
  createTemplateController
);

/**
 * @swagger
 * /template:
 *   get:
 *     summary: Get all templates
 *     description: Fetch all templates with pagination. Supports both full access and "read own" permissions.
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Number of items to skip (for pagination).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Maximum number of items to return (for pagination).
 *     responses:
 *       200:
 *         description: Templates fetched successfully.
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
 *                   example: Templates fetched successfully!
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Template'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Bad request - Invalid query parameters.
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
 *                   example: Invalid query parameters
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
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
 *         description: Forbidden. User lacks sufficient permissions
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
 *                   example: Error! Unable to fetch templates
 */
templateRouter.get(
  "/",
  checkPermission([TEMPLATE_PERMISSIONS.READ, TEMPLATE_PERMISSIONS.READ_OWN]),
  validateRequest(paginationQuerySchema,"query"),
  cacheMiddleware(TEMPLATE_TABLE),
  paginationMiddleware,
  getAllTemplatesController
);

/**
 * @swagger
 * /template/{id}:
 *   get:
 *     summary: Get a template by ID
 *     description: Fetch a single template using its unique identifier.
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The unique ID of the template.
 *     responses:
 *       200:
 *         description: Template fetched successfully.
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
 *                   example: Template fetched successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       400:
 *         description: Missing or invalid template ID.
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
 *                   example: Missing field. Template ID is required
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
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
 *         description: Forbidden. User lacks sufficient permissions
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
 *       404:
 *         description: Template not found.
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
 *                   example: Template not found
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
 *                   example: Error! Unable to fetch template
 */
templateRouter.get(
  "/:id",
  validateRequest(templateByIdSchema, "params"),
  checkPermission([TEMPLATE_PERMISSIONS.READ], {
    table: TEMPLATE_TABLE,
    action: PERMISSIONS_ACTIONS.READ,
  }),
  cacheMiddleware(TEMPLATE_TABLE),
  getTemplateByIdController
);

/**
 * @swagger
 * /template/{id}:
 *   put:
 *     summary: Update a template by ID
 *     description: Update the details of an existing template using its unique identifier.
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The unique ID of the template to update.
 *     requestBody:
 *       description: Template data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTemplate'
 *     responses:
 *       200:
 *         description: Template updated successfully.
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
 *                   example: Template updated successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       400:
 *         description: Missing or invalid template ID or invalid update data.
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
 *                   example: Missing field. Template ID is required
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
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
 *         description: Forbidden. User lacks sufficient permissions
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
 *       404:
 *         description: Template not found.
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
 *                   example: Template not found
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
 *                   example: Error! Unable to update template
 */
templateRouter.put(
  "/:id",
  checkPermission([TEMPLATE_PERMISSIONS.UPDATE], {
    table: TEMPLATE_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  validateRequest(updateTemplateSchema),
  updateTemplateByIdController
);

/**
 * @swagger
 * /template/delete/{id}:
 *   put:
 *     summary: Delete a template by ID
 *     description: Soft delete a template using its unique identifier. Requires proper permissions.
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The unique ID of the template to delete.
 *     responses:
 *       200:
 *         description: Template deleted successfully.
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
 *                   example: Template deleted successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       400:
 *         description: Missing or invalid template ID.
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
 *                   example: Missing field. Template ID is required
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
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
 *         description: Forbidden. User lacks sufficient permissions
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
 *       404:
 *         description: Template not found.
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
 *                   example: Template not found
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
 *                   example: Error! Unable to delete template
 */
templateRouter.put(
  "/delete/:id",
  validateRequest(templateByIdSchema, "params"),
  checkPermission([TEMPLATE_PERMISSIONS.DELETE], {
    table: TEMPLATE_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  deleteTemplateByIdController
);
