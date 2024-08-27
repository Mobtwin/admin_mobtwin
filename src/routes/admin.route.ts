import { Router } from "express";
import {
  createAdminController,
  deleteAdminByIdController,
  getAdminByIdController,
  getAllAdminsController,
  updateAdminByIdController,
} from "../controllers/admin.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import {
  adminByIdSchema,
  createAdminSchema,
  updateAdminSchema,
} from "../validators/admin.validator";
import { checkPermission } from "../middlewares/rbac.middleware";
import { ADMIN_PERMISSIONS, ADMIN_TABLE } from "../constant/admin.constant";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import cacheMiddleware from "../middlewares/cache.middleware";

export const adminRouter = Router();
// method: POST
// path: /admin/create
// Create a new admin
adminRouter.post(
  "/create",
  checkPermission(ADMIN_PERMISSIONS.CREATE),
  validateRequest(createAdminSchema),
  createAdminController
);
// method: GET
// path: /admin
// Get all admins
adminRouter.get(
  "/",
  checkPermission([ADMIN_PERMISSIONS.READ, ADMIN_PERMISSIONS.READ_OWN]),
  cacheMiddleware(ADMIN_TABLE),
  getAllAdminsController
);
// method: GET
// path: /admin/:id
// Get admin by id
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
// method: PUT
// path: /admin/:id
// Update admin by id
adminRouter.put(
  "/:id",
  checkPermission([ADMIN_PERMISSIONS.UPDATE], {
    table: ADMIN_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  validateRequest(updateAdminSchema),
  updateAdminByIdController
);
// method: PUT
// path: /admin/delete/:id
// Delete admin by id
adminRouter.put(
  "/delete/:id",
  checkPermission([ADMIN_PERMISSIONS.DELETE], {
    table: ADMIN_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  validateRequest(adminByIdSchema),
  deleteAdminByIdController
);
