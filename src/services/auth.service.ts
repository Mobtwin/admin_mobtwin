import { Admins, ROLES } from "../models/admin.schema";
import { comparePassword } from "../utils/hashing";
import { _isTokenExpired, _refreshToken, generateRefreshTokenForUser, generateTokenForUser } from "../utils/jwt";
import { environment } from "../utils/loadEnvironment";
import { LoginAdmin } from "../validators/auth.validator";

export const loginAdmin = async (credential:LoginAdmin, ipAddress?: string, userAgent?: string) => {
    const admin = await Admins.findOne({ email:credential.email }).select('password email userName role removed_at devices');
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

    const accessToken = await generateTokenForUser(admin);
    const refreshToken = await generateRefreshTokenForUser(admin.id);
    await Admins.updateOne({ email:credential.email }, { $push: { devices: { accessToken, refreshToken, ipAddress, userAgent } }, $set: { updatedAt: new Date() } });
    return { accessToken, refreshToken };
}

export const refreshToken = async (refreshToken: string, ipAddress: string) => {
    if (!refreshToken) {
        throw new Error('refresh token is required');
    }
    const admin = await Admins.findOne({ devices: { $elemMatch: { refreshToken } } }).select('_id devices email userName role');
    if (!admin) {
        throw new Error('invalid tokens');
    }
    if (await _isTokenExpired(refreshToken)) {
        throw new Error('refresh token expired');
    }
    const newAccessToken = await generateTokenForUser(admin);
    const newRefreshToken = await _refreshToken(refreshToken, environment.REFRESH_TOKEN_LIFE || "30d");
    try {
        await Admins.updateOne({ devices: { $elemMatch: { refreshToken } } }, { $set: { "devices.$.accessToken": newAccessToken, "devices.$.refreshToken": newRefreshToken, "devices.$.ipAddress": ipAddress, "devices.$.updated_at": new Date(), updated_at: new Date() } })
    } catch (error: any) {
        throw new Error('error while updating tokens'+error.message);
    }
    return {newTokens:{ accessToken: newAccessToken, refreshToken: newRefreshToken },admin};
}

export const logout = async (accessToken: string, refreshToken: string) => {
    if (!accessToken || !refreshToken) {
        throw new Error('both tokens are required');
    }
    const admin = await Admins.findOne({ devices: { $elemMatch: { accessToken, refreshToken } } }).select('devices');
    if (!admin) {
        throw new Error('invalid tokens');
    }
    try {
        await Admins.updateOne({ devices: { $elemMatch: { accessToken, refreshToken } } }, { $pull: { devices: { accessToken, refreshToken } }, $set : { updated_at: new Date() } })
    } catch (error: any) {
        console.error('🚨 error while revoking device ' + error.message);
        throw new Error('error while revoking device');
    }
    return admin.devices[0].ipAddress;
}

