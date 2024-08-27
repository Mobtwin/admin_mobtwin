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

// Method: POST
// Route: /plan
// Create a new plan
planRouter.post(
  "/",
  checkPermission([PLAN_PERMISSIONS.CREATE]),
  validateRequest(createPlanSchema),
  createPlanController
);

// Method: GET
// Route: /plan
// Get all plans
planRouter.get(
  "/",
  checkPermission([PLAN_PERMISSIONS.READ, PLAN_PERMISSIONS.READ_OWN]),
  validateRequest(paginationQuerySchema,"query"),
  cacheMiddleware(PLAN_TABLE),
  paginationMiddleware,
  getAllPlansController
);

// Method: GET
// Route: /plan/:id
// Get plan by id
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

// Method: PUT
// Route: /plan/:id
// Update plan by id
planRouter.put(
  "/:id",
  validateRequest(updatePlanSchema),
  checkPermission([PLAN_PERMISSIONS.UPDATE], {
    action: PERMISSIONS_ACTIONS.UPDATE,
    table: PLAN_TABLE,
  }),
  updatePlanByIdController
);

// Method: PUT
// Route: /plan/delete/:id
// Delete plan by id
planRouter.put(
  "/delete/:id",
  validateRequest(planByIdSchema, "params"),
  checkPermission([PLAN_PERMISSIONS.DELETE], {
    action: PERMISSIONS_ACTIONS.DELETE,
    table: PLAN_TABLE,
  }),
  deletePlanByIdController
);
