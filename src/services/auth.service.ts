import { Response } from "express";
import { Admins, ROLES } from "../models/admin.schema";
import { comparePassword } from "../utils/hashing";
import { createTokens, isTokenExpired, revokeToken  } from "../utils/jwt";
import { environment } from "../utils/loadEnvironment";
import { LoginAdmin } from "../validators/auth.validator";

export const loginAdmin = async (credential:LoginAdmin,res:Response, ipAddress?: string, userAgent?: string) => {
    const admin = await Admins.findOne({ email:credential.email }).select('_id password email userName role removed_at devices');
    if (!admin) {
        throw new Error('invalid credentials');
    }
    const isPasswordValid = await comparePassword(credential.password, admin.password);
    if (!isPasswordValid) {
        throw new Error('invalid credentials');
    }
    if (admin.devices.length > 0) {
        throw new Error('already logged in from another device');
    }
    if (admin.removed_at) {
        throw new Error('account removed');
    }

    const expressPayload :Express.User = { id: admin._id as string, email: admin.email, userName: admin.userName, role: admin.role.toString(),permissions:[]};
    const {accessToken,refreshToken} = createTokens(res, expressPayload);
    
    await Admins.updateOne({ email:credential.email }, { $push: { devices: { accessToken, refreshToken, ipAddress, userAgent } }, $set: { updatedAt: new Date() } });
    return { accessToken };
}

export const refreshToken = async (refreshToken: string, ipAddress: string,res:Response) => {
    if (!refreshToken) {
        throw new Error('refresh token is required');
    }
    const admin = await Admins.findOne({ devices: { $elemMatch: { refreshToken } } }).select('_id devices email userName role');
    if (!admin) {
        throw new Error('invalid tokens');
    }
    if (await isTokenExpired(refreshToken,"refresh")) {
        throw new Error('refresh token expired');
    }
    const expressPayload :Express.User = { id: admin._id as string, email: admin.email, userName: admin.userName, role: admin.role.toString(),permissions:[]};
    const {accessToken,refreshToken:newRefreshToken} = createTokens(res, expressPayload);
    try {
        await Admins.updateOne({ devices: { $elemMatch: { refreshToken } } }, { $set: { "devices.$.accessToken": accessToken, "devices.$.refreshToken": newRefreshToken, "devices.$.ipAddress": ipAddress, "devices.$.updated_at": new Date(), updated_at: new Date() } })
    } catch (error: any) {
        throw new Error('error while updating tokens'+error.message);
    }
    return {newTokens:{ accessToken },admin};
}

export const logout = async (accessToken: string, refreshToken: string,res:Response) => {
    if (!accessToken || !refreshToken) {
        throw new Error('both tokens are required');
    }
    const admin = await Admins.findOne({ devices: { $elemMatch: { accessToken, refreshToken } } }).select('devices');
    if (!admin) {
        throw new Error('invalid tokens');
    }
    try {
        await Admins.updateOne({ devices: { $elemMatch: { accessToken, refreshToken } } }, { $pull: { devices: { accessToken, refreshToken } }, $set : { updated_at: new Date() } })
        revokeToken(res);
    } catch (error: any) {
        console.error('🚨 error while revoking device ' + error.message);
        throw new Error('error while revoking device');
    }
    return admin.devices[0].ipAddress;
}

