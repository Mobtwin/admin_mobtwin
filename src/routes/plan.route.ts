import { Router } from "express";
import {
  createPlanController,
  deletePlanByIdController,
  getAllPlansController,
  getPlanByIdController,
  updatePlanByIdController,
} from "../controllers/plan.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import {
  createPlanSchema,
  planByIdSchema,
  updatePlanSchema,
} from "../validators/plan.validator";
import { checkPermission } from "../middlewares/rbac.middleware";
import { PLAN_PERMISSIONS, PLAN_TABLE } from "../constant/plan.constant";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import cacheMiddleware from "../middlewares/cache.middleware";
import paginationMiddleware from "../middlewares/pagination.middleware";
import { paginationQuerySchema } from "../validators/pagination.validator";

export const planRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: API to manage plans
 */
/**
 * @swagger
 * /plan:
 *   post:
 *     summary: Create a new plan
 *     description: Create a new subscription or service plan. Requires 'CREATE' permission for plans.
 *     tags:
 *       - Plans
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Payload for creating a new plan
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlan'
 *     responses:
 *       201:
 *         description: Plan created successfully
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
 *                   example: Plan created successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Bad request due to validation error
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
 *                   example: Validation failed for required fields.
 *       401:
 *         description: Unauthorized. Missing or invalid JWT token
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
 *                   example: Error! Something went wrong.
 */

planRouter.post(
  "/",
  checkPermission([PLAN_PERMISSIONS.CREATE]),
  validateRequest(createPlanSchema),
  createPlanController
);

/**
 * @swagger
 * /plan:
 *   get:
 *     summary: Get all plans
 *     description: Retrieve a paginated list of all plans. Requires 'READ' or 'READ_OWN' permission.
 *     tags:
 *       - Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: All plans fetched successfully
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
 *                   example: All plans fetched successfully!
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Plan'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *       400:
 *         description: Bad request due to validation error
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
 *                   example: Validation failed for required fields.
 *       401:
 *         description: Unauthorized. Missing or invalid JWT token
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
 *                   example: Error! Something went wrong.
 */

planRouter.get(
  "/",
  checkPermission([PLAN_PERMISSIONS.READ, PLAN_PERMISSIONS.READ_OWN]),
  validateRequest(paginationQuerySchema,"query"),
  cacheMiddleware(PLAN_TABLE),
  paginationMiddleware,
  getAllPlansController
);

/**
 * @swagger
 * /plan/{id}:
 *   get:
 *     summary: Get a plan by ID
 *     description: Retrieve the details of a specific plan using its unique ID. Requires 'READ' permission.
 *     tags:
 *       - Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the plan
 *         schema:
 *           type: string
 *           example: "plan_12345"
 *     responses:
 *       200:
 *         description: Plan fetched successfully
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
 *                   example: Plan fetched successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Bad request - Missing or invalid plan ID
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
 *                   example: Plan id is required!
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
 *         description: Forbidden - Insufficient permissions
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
 *                   example: Error! Something went wrong.
 */

planRouter.get(
  "/:id",
  validateRequest(planByIdSchema, "params"),
  checkPermission([PLAN_PERMISSIONS.READ], {
    table: PLAN_TABLE,
    action: PERMISSIONS_ACTIONS.READ,
  }),
  cacheMiddleware(PLAN_TABLE),
  getPlanByIdController
);

/**
 * @swagger
 * /plan/{id}:
 *   put:
 *     summary: Update a plan by ID
 *     description: Update the details of an existing plan using its unique ID. Requires 'UPDATE' permission.
 *     tags:
 *       - Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the plan to be updated
 *         schema:
 *           type: string
 *           example: "plan_12345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePlan'
 *     responses:
 *       200:
 *         description: Plan updated successfully
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
 *                   example: Plan updated successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Bad request - Missing or invalid fields
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
 *                   example: Plan id is required!
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
 *         description: Forbidden - Insufficient permissions
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
 *                   example: Error! Something went wrong.
 */

planRouter.put(
  "/:id",
  // validateRequest(updatePlanSchema),
  checkPermission([PLAN_PERMISSIONS.UPDATE], {
    action: PERMISSIONS_ACTIONS.UPDATE,
    table: PLAN_TABLE,
  }),
  updatePlanByIdController
);

/**
 * @swagger
 * /plan/delete/{id}:
 *   put:
 *     summary: Soft delete a plan by ID
 *     description: Soft delete an existing plan using its unique ID. Requires 'DELETE' permission.
 *     tags:
 *       - Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the plan to be deleted
 *         schema:
 *           type: string
 *           example: "plan_12345"
 *     responses:
 *       200:
 *         description: Plan deleted successfully
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
 *                   example: Plan deleted successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Bad request - Missing or invalid fields
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
 *                   example: Plan id is required!
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
 *         description: Forbidden - Insufficient permissions
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
 *                   example: Error! Something went wrong.
 */

planRouter.put(
  "/delete/:id",
  validateRequest(planByIdSchema, "params"),
  checkPermission([PLAN_PERMISSIONS.DELETE], {
    action: PERMISSIONS_ACTIONS.DELETE,
    table: PLAN_TABLE,
  }),
  deletePlanByIdController
);
