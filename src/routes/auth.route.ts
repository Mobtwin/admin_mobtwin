import { Router } from "express";
import { loginController, logoutController, refreshTokenController } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import { loginAdminSchema, logoutAdminSchema, refreshAdminSchema } from "../validators/auth.validator";
import { loginLimiter } from "../middlewares/limiter";

export const authRouter = Router();

// Method: POST
// Route: /auth/login
// Login a new user
authRouter.post('/login',validateRequest(loginAdminSchema),loginLimiter, loginController);
// Method: POST
// Route: /auth/refresh
// Refresh token
authRouter.post('/refresh',validateRequest(refreshAdminSchema), refreshTokenController);
// Method: POST
// Route: /auth/logout
// Logout user
authRouter.post('/logout',validateRequest(logoutAdminSchema), logoutController);
