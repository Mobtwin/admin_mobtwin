import { Router } from "express";
import {
  createTemplateController,
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

export const templateRouter = Router();

// Method: POST
// Route: /template
// Create a new template
templateRouter.post(
  "/",
  checkPermission([TEMPLATE_PERMISSIONS.CREATE]),
  validateRequest(createTemplateSchema),
  createTemplateController
);

// Method: GET
// Route: /template
// Get all templates
templateRouter.get(
  "/",
  checkPermission([TEMPLATE_PERMISSIONS.READ, TEMPLATE_PERMISSIONS.READ_OWN]),
  cacheMiddleware(TEMPLATE_TABLE),
  paginationMiddleware,
  getAllTemplatesController
);

// Method: GET
// Route: /template/:id
// Get template by id
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

// Method: PUT
// Route: /template/:id
// Update template by id
templateRouter.put(
  "/:id",
  checkPermission([TEMPLATE_PERMISSIONS.UPDATE], {
    table: TEMPLATE_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  validateRequest(updateTemplateSchema),
  updateTemplateByIdController
);

// Method: PUT
// Route: /template/delete/:id
// Delete template by id
templateRouter.put(
  "/delete/:id",
  validateRequest(templateByIdSchema, "params"),
  checkPermission([TEMPLATE_PERMISSIONS.DELETE], {
    table: TEMPLATE_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  getTemplateByIdController
);
