import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
} from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import {
  loginAdminSchema,
} from "../validators/auth.validator";
import { loginLimiter } from "../middlewares/limiter";
import { authMiddleWare } from "../middlewares/auth.middleware";

export const authRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API to manage Authentication
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticates an admin user with their email and password. Returns an access token on successful login.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Login successful.
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
 *                   example: Login successful!
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing fields or bad request.
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
 *                   example: "Missing field. Email is required!"
 *       401:
 *         description: Unauthorized or invalid credentials.
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
 *                   example: "Error: invalid credentials"
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
 *                   example: "Error: Unable to process login"
 */

authRouter.post(
  "/login",
  validateRequest(loginAdminSchema),
  loginLimiter,
  loginController
);
/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh authentication token
 *     description: Refreshes the access token using a valid refresh token.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
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
 *                   example: Token refreshed successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request or invalid token.
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
 *                   example: "Missing field. Refresh token is required!"
 *       401:
 *         description: Unauthorized due to invalid or expired token.
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
 *                   example: "Error: refresh token expired"
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
 *                   example: "Error: Unable to refresh token"
 *     parameters:
 *       - in: cookie
 *         name: ercon
 *         required: true
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: The refresh token stored in the cookie or passed in the request.
 */

authRouter.get(
  "/refresh",
  refreshTokenController
);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the user by invalidating the access and refresh tokens.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: cookie
 *         name: ercon
 *         required: true
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: The refresh token stored in the cookie or passed in the request.
 *     requestBody:
 *       description: No request body is needed as the tokens are extracted from the request headers or cookies.
 *       required: false
 *     responses:
 *       200:
 *         description: Logout successful.
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
 *                   example: "Logout successful!"
 *       400:
 *         description: Bad request when tokens are missing or invalid.
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
 *                   example: "Missing field. Refresh token is required!"
 *       401:
 *         description: Unauthorized when the user is not authenticated.
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
 *                   example: "Unauthorized"
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
 *                   example: "Error: error while revoking device"
 */

authRouter.post(
  "/logout",
  authMiddleWare,
  logoutController
);
