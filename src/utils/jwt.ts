import jwt from 'jsonwebtoken'
import { environment } from './loadEnvironment'
import { Request, Response } from 'express'
import { sendErrorResponse } from './response';


export const generateToken = async (payload: any, lifeTime: string,type:"access"|"refresh") => {
  if(type === "access")
    return jwt.sign(payload, environment.JWT_ACCESS_SECRET , {
      expiresIn: lifeTime,
    });
  
  return jwt.sign(payload, environment.JWT_REFRESH_SECRET , {
    expiresIn: lifeTime,
  });
}


export const __refreshToken = async (accessToken: string, lifeTime: string) => {
  try {
    const decodedToken = jwt.decode(accessToken);
    delete (decodedToken as any).exp;
    delete (decodedToken as any).iat;
    const refresh = generateToken(decodedToken, lifeTime,"refresh");
    return refresh;
  } catch (error: any) {
    throw new Error('invalid token refresh'+error.message)
  }
}

export const isTokenExpired = async (token: string,type:"access"|"refresh") => {
  try {
    if (type === "access") {
      const decodedAccess = jwt.verify(token, environment.JWT_ACCESS_SECRET);
      return false;
    }
    const decodedRefresh = jwt.verify(token, environment.JWT_REFRESH_SECRET);
    return false;
  } catch (error) {
    return true;
  }
}

export const checkToken = async (token: string,type:"access"|"refresh") => {
  try {
    if (type === "access") {
      const decodedAccess = jwt.verify(token, environment.JWT_ACCESS_SECRET);
      return decodedAccess as Express.User;
    }
    const decodedRefresh = jwt.verify(token, environment.JWT_REFRESH_SECRET);
    return decodedRefresh as Express.User;
  } catch (error) {
    return undefined;
  }
} 


export const createTokens = async(res: Response, payload: Express.User) => {
  const accessToken = await generateToken(payload, '30s', "access");
  const refreshToken = await generateToken(payload, '1d', "refresh");

  res.cookie(environment.COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: false,// process.env.NODE_ENV === 'production'
    sameSite: 'none',
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
  });

  return {accessToken,refreshToken};
};

export const refreshToken = (req: Request, res: Response) => {
  const refreshToken = req.cookies[environment.COOKIE_NAME];
  if (!refreshToken) return sendErrorResponse(res, null, 'Unauthorized: Invalid or Expired Token!', 401);

  try {
    const decoded = jwt.verify(refreshToken, environment.JWT_REFRESH_SECRET);
    const accessToken = generateToken(decoded, '30s', "access");
    delete (decoded as any).exp;
    delete (decoded as any).iat;
    return accessToken;
  } catch (err) {
    sendErrorResponse(res, null, 'Unauthorized: Invalid or Expired Token!', 401);
  }
};

export const getRefreshToken = (req: Request) => {
  const refreshToken = req.cookies[environment.COOKIE_NAME];
  if (!refreshToken) return null;
  return refreshToken;
};


export const revokeToken = (res: Response) => {
  res.clearCookie(environment.COOKIE_NAME);
  return;
};



