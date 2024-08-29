import { Router } from "express";
import {
  createPermissionController,
  deletePermissionByIdController,
  deletePermissionByNameController,
  getAllPermissionsController,
  searchPermissionTableController,
  updatePermissionByIdController,
  updatePermissionByNameController,
} from "../controllers/permission.controller";
import { checkPermission } from "../middlewares/rbac.middleware";
import {
  PERMISSION_PERMISSIONS,
  PERMISSION_TABLE,
} from "../constant/permission.constant";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import {
  createPermissionSchema,
  deletePermissionByIdSchema,
  deletePermissionByNameSchema,
  searchPermissionSchema,
  updatePermissionByIdSchema,
  updatePermissionByNameSchema,
} from "../validators/permission.validator";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import cacheMiddleware from "../middlewares/cache.middleware";
import paginationMiddleware from "../middlewares/pagination.middleware";
import { paginationQuerySchema } from "../validators/pagination.validator";
import { afterResponse } from "../middlewares/afterResponse.middleware";

export const permissionRouter = Router();

// Method: POST
// route: /permission
// Create a new permission
permissionRouter.post(
  "/",
  checkPermission([PERMISSION_PERMISSIONS.CREATE]),
  validateRequest(createPermissionSchema),
  createPermissionController
);

// Method: GET
// route: /permission
// Get all permissions
permissionRouter.get(
  "/",
  checkPermission([
    PERMISSION_PERMISSIONS.READ,
    PERMISSION_PERMISSIONS.READ_OWN,
  ]),
  validateRequest(paginationQuerySchema, "query"),
  paginationMiddleware,
  cacheMiddleware(PERMISSION_TABLE),
  getAllPermissionsController
);

// Method: PUT
// route: /permission/:name
// Update a permission
permissionRouter.put(
  "/:name",
  checkPermission([PERMISSION_PERMISSIONS.UPDATE], {
    table: PERMISSION_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  validateRequest(updatePermissionByNameSchema),
  updatePermissionByNameController
);

// Method: DELETE
// route: /permission/:name
// Delete a permission
permissionRouter.delete(
  "/:name",
  validateRequest(deletePermissionByNameSchema, "params"),
  checkPermission([PERMISSION_PERMISSIONS.DELETE], {
    table: PERMISSION_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  deletePermissionByNameController
);
// Method: PUT
// route: /permission/:id
// Update a permission
permissionRouter.put(
  "/:id",
  checkPermission([PERMISSION_PERMISSIONS.UPDATE], {
    table: PERMISSION_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  validateRequest(updatePermissionByIdSchema),
  updatePermissionByIdController
);

// Method: DELETE
// route: /permission/:id
// Delete a permission
permissionRouter.delete(
  "/:id",
  validateRequest(deletePermissionByIdSchema, "params"),
  checkPermission([PERMISSION_PERMISSIONS.DELETE], {
    table: PERMISSION_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  deletePermissionByIdController
);

// Method: GET
// route: /permission/search
// search permissions

permissionRouter.get(
  "/search",
  validateRequest(searchPermissionSchema, "params"),
  checkPermission([
    PERMISSION_PERMISSIONS.READ,
    PERMISSION_PERMISSIONS.READ_OWN,
  ]),
  paginationMiddleware,
  cacheMiddleware(PERMISSION_TABLE),
  searchPermissionTableController
);
permissionRouter.use(afterResponse);