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
/**
 * @swagger
 * tags:
 *   name: Themes
 *   description: API to manage Themes
 */
/**
 * @swagger
 * /theme:
 *   post:
 *     summary: Create a new theme
 *     description: Create a new theme. Requires 'CREATE' permission.
 *     tags:
 *       - Themes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTheme'
 *     responses:
 *       201:
 *         description: Theme created successfully
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
 *                   example: Theme created successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Theme'
 *       400:
 *         description: Bad request - Invalid or missing fields
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
 *                   example: Validation error! Missing theme name.
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
themeRouter.post(
  "/",
  checkPermission(THEME_PERMISSIONS.CREATE),
  validateRequest(createThemeSchema),
  createThemeController
);

/**
 * @swagger
 * /theme:
 *   get:
 *     summary: Get all themes
 *     description: Retrieve a list of themes with optional pagination. Requires 'READ' or 'READ_OWN' permissions.
 *     tags:
 *       - Themes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Number of page (for pagination).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Maximum number of records to retrieve (for pagination).
 *     responses:
 *       200:
 *         description: Themes fetched successfully
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
 *                   example: Themes fetched successfully!
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Theme'
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
 *         description: Bad request - Invalid query parameters
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
 *                   example: Validation error! Invalid query parameters.
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
 * 
*/
themeRouter.get(
  "/",
  checkPermission([THEME_PERMISSIONS.READ, THEME_PERMISSIONS.READ_OWN]),
  validateRequest(paginationQuerySchema,"query"),
  cacheMiddleware(THEME_TABLE),
  paginationMiddleware,
  getAllThemesController
);

/**
 * @swagger
 * /theme/{id}:
 *   get:
 *     summary: Get theme by ID
 *     description: Retrieve a specific theme by its ID. Requires 'READ' permission.
 *     tags:
 *       - Themes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "theme_12345"
 *         description: The ID of the theme to retrieve.
 *     responses:
 *       200:
 *         description: Theme fetched successfully
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
 *                   example: Theme fetched successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Theme'
 *       400:
 *         description: Bad request - Invalid or missing theme ID
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
 *                   example: Theme ID is required!
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
 *       404:
 *         description: Not Found - Theme with the given ID not found
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
 *                   example: Theme not found!
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

/**
 * @swagger
 * /theme/{id}:
 *   get:
 *     summary: Get theme by ID
 *     description: Retrieve a specific theme by its ID. Requires 'READ' permission.
 *     tags:
 *       - Themes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "theme_12345"
 *         description: The ID of the theme to retrieve.
 *     requestBody:
 *       description: theme information to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTheme'
 *     responses:
 *       200:
 *         description: Theme fetched successfully
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
 *                   example: Theme fetched successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Theme'
 *       400:
 *         description: Bad request - Invalid or missing theme ID
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
 *                   example: Theme ID is required!
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
 *       404:
 *         description: Not Found - Theme with the given ID not found
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
 *                   example: Theme not found!
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

themeRouter.put(
  "/:id",
  validateRequest(updateThemeSchema),
  checkPermission([THEME_PERMISSIONS.UPDATE], {
    table: THEME_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  updateThemeController
);

/**
 * @swagger
 * /theme/delete/{id}:
 *   put:
 *     summary: Delete theme by ID
 *     description: Soft delete a specific theme by its ID. Requires 'DELETE' permission.
 *     tags:
 *       - Themes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "theme_12345"
 *         description: The ID of the theme to delete.
 *     responses:
 *       200:
 *         description: Theme deleted successfully
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
 *                   example: Theme deleted successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Theme'
 *       400:
 *         description: Bad request - Invalid or missing theme ID
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
 *                   example: Theme ID is required!
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
 *       404:
 *         description: Not Found - Theme with the given ID not found
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
 *                   example: Theme not found!
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