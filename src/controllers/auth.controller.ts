import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import {
  loginAdmin,
  loginWithCode,
  logout,
  refreshToken,
  requestLoginVerification,
} from "../services/auth.service";
import { LoginAdminRequest } from "../validators/auth.validator";
import { logEvents } from "../middlewares/logger";
import { ROLES } from "../models/admin.schema";
import { getRefreshToken } from "../utils/jwt";

export const loginController = async (
  req: LoginAdminRequest,
  res: Response
) => {
  const { email, password, code } = req.body;
  const ipAddress = req.headers["x-forwarded-for"] as string;
  const userAgent = req.headers["user-agent"];
  if (!email) {
    return sendErrorResponse(
      res,
      null,
      "Missing field. Email is required!",
      400
    );
  }
  if (!password) {
    return sendErrorResponse(
      res,
      null,
      "Missing field. Password is required!",
      400
    );
  }
  if (!code) {
    loginAdmin(req.body, res, ipAddress, userAgent)
    .then((newTokens) => {
      logEvents(`Admin: ${email} logged in`, "auth.log");
      return sendSuccessResponse(res, newTokens, "Login successful!", 200);
    })
    .catch((error) => {
      return sendErrorResponse(res, error, `Error: ${error.message}`, 401);
    });
  } else {
    loginWithCode(email, password, code, ipAddress,res, userAgent)
      .then(async ({ accessToken, admin }) => {
        logEvents(`Admin: ${admin.email} logged in with code`, "auth.log");
      return sendSuccessResponse(res, accessToken, "Login successful!", 200);
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
      });
  }
  
};

export const refreshTokenController = (req: Request, res: Response) => {
  const refresh_token = getRefreshToken(req);
  if (!refresh_token) {
    return sendErrorResponse(
      res,
      null,
      "Missing field. Refresh token is required!",
      400
    );
  }

  const ipAddress = req.ip;
  refreshToken(refresh_token, ipAddress as string, res)
    .then(({ admin, newTokens }) => {
      logEvents(
        `Admin: ${admin.email} refreshed token from ip: ${ipAddress}`,
        "auth.log"
      );
      return sendSuccessResponse(
        res,
        newTokens,
        "Token refreshed successfully!",
        200
      );
    })
    .catch((error: any) => {
      return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
    });
};

export const logoutController = (req: Request, res: Response) => {
  const refresh_token = getRefreshToken(req);
  if (!req.user) return sendErrorResponse(res, null, "Unauthorized", 401);
  const user = req.user;

  if (!refresh_token) {
    return sendErrorResponse(
      res,
      null,
      "Missing field. Refresh token is required!",
      400
    );
  }
  if (!user.token) {
    return sendErrorResponse(
      res,
      null,
      "Missing field. Access token is required!",
      400
    );
  }
  logout(user.token, refresh_token, res)
    .then((ip) => {
      logEvents(
        `${user.role}: ${user.userName} logged out from ip: ${ip} `,
        "auth.log"
      );
      return sendSuccessResponse(res, null, "Logout successful!", 200);
    })
    .catch((error: any) => {
      return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
    });
};

export const requestLoginVerificationController = async (
  req: LoginAdminRequest,
  res: Response
) => {
  const { email, password } = req.body;
  if (!email) {
    return sendErrorResponse(
      res,
      null,
      "Missing field. Email is required!",
      400
    );
  }
  if (!password) {
    return sendErrorResponse(
      res,
      null,
      "Missing field. Password is required!",
      400
    );
  }
  requestLoginVerification(email, password)
    .then(async (admin) => {
      logEvents(
        `Admin: ${admin.email} requested login verification`,
        "auth.log"
      );
      return sendSuccessResponse(
        res,
        null,
        "Verification code sent successfully!",
        200
      );
    })
    .catch((error) => {
      return sendErrorResponse(res, error, `Error: ${error.message}`, 400);
    });
};
