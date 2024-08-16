import { NextFunction, Request, Response } from "express";
import { _checkToken, _isTokenExpired } from "../utils/jwt";
import { sendErrorResponse } from "../utils/response";


const ALLOWED_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/email-verification","/auth/login-verification"];

export const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (ALLOWED_ENDPOINTS.includes(req.url)) {
    next();
  } else {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return sendErrorResponse(res, null, "Token is required.", 401);
    }
    try {
      const decodedToken = await _checkToken(token);
      if (!decodedToken) {
        return sendErrorResponse(res, null, "Invalid token.", 401);
      }
      decodedToken.token = token;
      req.user = decodedToken;
      next();
    } catch (error:any) {
      return sendErrorResponse(res, error, "Error: " + error.message, 401);
    }
  }
};
