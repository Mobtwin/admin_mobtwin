import { Router } from "express";
import {
  createPermissionController,
  deletePermissionByNameController,
  getAllPermissionsController,
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
  deletePermissionSchema,
} from "../validators/permission.validator";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import cacheMiddleware from "../middlewares/cache.middleware";
import paginationMiddleware from "../middlewares/pagination.middleware";
import { paginationQuerySchema } from "../validators/pagination.validator";

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
  validateRequest(paginationQuerySchema,"query"),
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
  validateRequest(createPermissionSchema),
  updatePermissionByNameController
);

// Method: DELETE
// route: /permission/:name
// Delete a permission
permissionRouter.delete(
  "/:name",
  validateRequest(deletePermissionSchema, "params"),
  checkPermission([PERMISSION_PERMISSIONS.DELETE], {
    table: PERMISSION_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  deletePermissionByNameController
);
