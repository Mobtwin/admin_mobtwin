import { Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { loginAdmin, logout, refreshToken } from "../services/auth.service";
import { LoginAdminRequest, LogoutAdminRequest, RefreshAdminRequest } from "../validators/auth.validator";
import { logEvents } from "../middlewares/logger";
import { ROLES } from "../models/admin.schema";

export const loginController = async (req: LoginAdminRequest, res: Response) => {
    const { email, password } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] as string;
    const userAgent = req.headers['user-agent'];
    if (!email) {
        return sendErrorResponse(res, null, 'Missing field. Email is required!', 400);
    }
    if (!password) {
        return sendErrorResponse(res, null, 'Missing field. Password is required!', 400);
    }
    loginAdmin(req.body, ipAddress, userAgent).then((newTokens) => {
        logEvents(`Admin: ${email} logged in`, 'auth.log');
        return sendSuccessResponse(res, newTokens, 'Login successful!', 200);
    }).catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 401);
    });

}

export const refreshTokenController = (req: RefreshAdminRequest, res: Response) => {
    const refresh_token = req.body.refreshToken;
    if (!refresh_token) {
        return sendErrorResponse(res, null, 'Missing field. Refresh token is required!', 400);
    }
    
    const ipAddress = req.ip;
    refreshToken(refresh_token, ipAddress as string).then(({admin,newTokens}) => {
        logEvents(`Admin: ${admin.email} refreshed token from ip: ${ipAddress}`, 'auth.log');
        return sendSuccessResponse(res, newTokens, 'Token refreshed successfully!', 200);
    }).catch((error: any) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
    })
}

export const logoutController = (req: LogoutAdminRequest, res: Response) => {
    const refresh_token = req.body.refreshToken;
    if (!req.user)
        return sendErrorResponse(res, null, 'Unauthorized', 401);
    const user = req.user;
    
    if (!refresh_token) {
        return sendErrorResponse(res, null, 'Missing field. Refresh token is required!', 400);
    }
    if (!user.token) {
        return sendErrorResponse(res, null, 'Missing field. Access token is required!', 400);
    }
    logout(user.token, refresh_token).then((ip) => {
        logEvents(`${user.role}: ${user.userName} logged out from ip: ${ip} `, 'auth.log');
        return sendSuccessResponse(res, null, 'Logout successful!', 200);
    }).catch((error: any) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
    })
}