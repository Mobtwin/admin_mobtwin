import { Router } from "express";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import {
  createThemeSchema,
  themeByIdSchema,
  updateThemeSchema,
  updateThemeStatusSchema,
} from "../validators/theme.validator";
import {
  createThemeController,
  deleteThemeController,
  getAllThemesController,
  getThemeByIdController,
  updateThemeController,
  updateThemeStatusController,
} from "../controllers/theme.controller";
import { checkPermission } from "../middlewares/rbac.middleware";
import { THEME_PERMISSIONS, THEME_TABLE } from "../constant/theme.constant";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import cacheMiddleware from "../middlewares/cache.middleware";
import paginationMiddleware from "../middlewares/pagination.middleware";
import { paginationQuerySchema } from "../validators/pagination.validator";

export const themeRouter = Router();

// Method: POST
// Route: /theme
// Create a new theme
themeRouter.post(
  "/",
  checkPermission(THEME_PERMISSIONS.CREATE),
  validateRequest(createThemeSchema),
  createThemeController
);

// Method: GET
// Route: /theme
// Get all themes
themeRouter.get(
  "/",
  checkPermission([THEME_PERMISSIONS.READ, THEME_PERMISSIONS.READ_OWN]),
  validateRequest(paginationQuerySchema,"query"),
  cacheMiddleware(THEME_TABLE),
  paginationMiddleware,
  getAllThemesController
);

// Method: GET
// Route: /theme/:id
// Get theme by id
themeRouter.get(
  "/:id",
  validateRequest(themeByIdSchema, "params"),
  checkPermission([THEME_PERMISSIONS.READ], {
    table: THEME_TABLE,
    action: PERMISSIONS_ACTIONS.READ,
  }),
  cacheMiddleware(THEME_TABLE),
  getThemeByIdController
);

// Method: PUT
// Route: /theme/:id
// Update theme by id
themeRouter.put(
  "/:id",
  validateRequest(updateThemeSchema),
  checkPermission([THEME_PERMISSIONS.UPDATE], {
    table: THEME_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  updateThemeController
);

// Method: PUT
// Route: /theme/delete/:id
// Delete theme by id
themeRouter.put(
  "/delete/:id",
  validateRequest(themeByIdSchema, "params"),
  checkPermission([THEME_PERMISSIONS.DELETE], {
    table: THEME_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  deleteThemeController
);

// Method: PUT
// Route: /theme/status/:id
// Update theme status by id
themeRouter.put(
  "/status/:id",
  validateRequest(updateThemeStatusSchema, "params"),
  checkPermission([THEME_PERMISSIONS.UPDATE,THEME_PERMISSIONS.STATUS], {
    table: THEME_TABLE,
    action: PERMISSIONS_ACTIONS.STATUS,
  }),
  validateRequest(updateThemeStatusSchema),
  updateThemeStatusController
);