import jwt from 'jsonwebtoken'
import { environment } from './loadEnvironment'
import { IAdmin, IAdminDocument } from '../models/admin.schema'


export const _generateToken = async (payload: any, lifeTime: string) => {
  return jwt.sign(payload, environment.JWT_SECRET , {
    expiresIn: lifeTime,
  })
}

export const _refreshToken = async (accessToken: string, lifeTime: string) => {
  try {
    const decodedToken = jwt.decode(accessToken);
    delete (decodedToken as any).exp;
    delete (decodedToken as any).iat;
    const newToken = jwt.sign(decodedToken as Object, environment.JWT_SECRET, { expiresIn: lifeTime });
    return newToken;
  } catch (error: any) {
    throw new Error('invalid token refresh'+error.message)
  }
}

export const _isTokenExpired = async (token: string) => {
  try {
    jwt.verify(token, environment.JWT_SECRET);
    return false;
  } catch (error) {
    return true;
  }
}

export const _checkToken = async (token: string) => {
  try {
    const decodedToken = jwt.verify(token, environment.JWT_SECRET);
    return decodedToken as Express.User;
  } catch (error) {
    return undefined;
  }
} 

export const generateTokenForAdmin = async (user: IAdminDocument) => {
  return await _generateToken({ id: user._id, userName: user.userName, email: user.email,role:user.role }, environment.ACCESS_TOKEN_LIFE || "30m");
}

export const generateRefreshTokenForAdmin = async (userId: string) => {
  return await _generateToken({ userId }, environment.REFRESH_TOKEN_LIFE || "30d");
}


