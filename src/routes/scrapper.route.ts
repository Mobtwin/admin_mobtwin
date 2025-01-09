import { Router } from "express";
import { checkPermission } from "../middlewares/rbac.middleware";
import cacheMiddleware from "../middlewares/cache.middleware";
import { SCRAPPER_PERMISSIONS } from "../constant/scrapper.constant";
import { createRoleController } from "../controllers/role.controller";

export const scrapperRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Scrapper
 *   description: API to manage scrapper
 */
/**
 * @swagger
 * /scrapper/status:
 *   get:
 *     summary: get scraper status
 *     description: Allows authenticated users with the required permissions to get scraper status
 *     tags:
 *       - Scrapper
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fetched scraper status successfully
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
 *                   example: Fetched scraper status successfully  !
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
 *                   example: Error! Unable to fetch the status of scrapper
 */

scrapperRouter.get(
  "/status",
//   checkPermission([SCRAPPER_PERMISSIONS.STATUS]),
  createRoleController
);