import { Response } from "express";
import { Admins, ROLES } from "../models/admin.schema";
import { comparePassword } from "../utils/hashing";
import { createTokens, isTokenExpired, revokeToken } from "../utils/jwt";
import { environment } from "../utils/loadEnvironment";
import { LoginAdmin } from "../validators/auth.validator";
import { sendVerificationEmail } from "./mailer.service";
type VerificationType =
  | "email verification"
  | "password reset"
  | "2fa verification"
  | "phone verification"
  | "device verification"
  | "other";
const verificationStorage = new Map<
  string,
  { code: number; type: VerificationType; date: Date; ipAddress?: string }
>();

export const loginAdmin = async (
  credential: LoginAdmin,
  res: Response,
  ipAddress?: string,
  userAgent?: string
) => {
  const admin = await Admins.findOne({ email: credential.email }).select(
    "_id password email userName role removed_at devices role"
  );
  if (!admin) {
    throw new Error("invalid credentials");
  }
  const isPasswordValid = await comparePassword(
    credential.password,
    admin.password
  );
  if (!isPasswordValid) {
    throw new Error("invalid credentials");
  }
  if (admin.devices.length > 0) {
    throw new Error("already logged in from another device");
  }
  if (admin.removed_at) {
    throw new Error("account removed");
  }

  const expressPayload: Express.User = {
    id: admin._id as string,
    email: admin.email,
    userName: admin.userName,
    role: admin.role.toString(),
    permissions: [],
  };
  const { accessToken, refreshToken } = await createTokens(res, expressPayload);

  await Admins.updateOne(
    { email: credential.email },
    {
      $push: { devices: { accessToken, refreshToken, ipAddress, userAgent } },
      $set: { updatedAt: new Date() },
    }
  );
  return { accessToken };
};

export const refreshToken = async (
  refreshToken: string,
  ipAddress: string,
  res: Response
) => {
  if (!refreshToken) {
    throw new Error("refresh token is required");
  }
  const admin = await Admins.findOne({
    devices: { $elemMatch: { refreshToken } },
  }).select("_id devices email userName role");
  if (!admin) {
    throw new Error("invalid tokens");
  }
  if (await isTokenExpired(refreshToken, "refresh")) {
    throw new Error("refresh token expired");
  }
  const expressPayload: Express.User = {
    id: admin._id as string,
    email: admin.email,
    userName: admin.userName,
    role: admin.role.toString(),
    permissions: [],
  };
  const { accessToken, refreshToken: newRefreshToken } = await createTokens(
    res,
    expressPayload
  );
  try {
    await Admins.updateOne(
      { devices: { $elemMatch: { refreshToken } } },
      {
        $set: {
          "devices.$.accessToken": accessToken,
          "devices.$.refreshToken": newRefreshToken,
          "devices.$.ipAddress": ipAddress,
          "devices.$.updated_at": new Date(),
          updated_at: new Date(),
        },
      }
    );
  } catch (error: any) {
    throw new Error("error while updating tokens" + error.message);
  }
  return { newTokens: { accessToken }, admin };
};

export const logout = async (
  accessToken: string,
  refreshToken: string,
  res: Response
) => {
  if (!accessToken || !refreshToken) {
    throw new Error("both tokens are required");
  }
  const admin = await Admins.findOne({
    devices: { $elemMatch: { accessToken, refreshToken } },
  }).select("devices");
  if (!admin) {
    throw new Error("invalid tokens");
  }
  try {
    await Admins.updateOne(
      { devices: { $elemMatch: { accessToken, refreshToken } } },
      {
        $pull: { devices: { accessToken, refreshToken } },
        $set: { updated_at: new Date() },
      }
    );
    revokeToken(res);
  } catch (error: any) {
    console.error("🚨 error while revoking device " + error.message);
    throw new Error("error while revoking device");
  }
  return admin.devices[0].ipAddress;
};

export const checkIfWeJustSentVerificationCode = (
  email: string,
  howMuchSecondes: number
) => {
  const dbCode = verificationStorage.get(email);
  const now = new Date();
  now.setSeconds(now.getSeconds() - howMuchSecondes);
  if (dbCode && dbCode.date > now) {
    return true;
  }
  return false;
};

export const generateVerificationCode = (type: VerificationType, email: string, ipAddress?: string) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    verificationStorage.set(email, { code, type, date: new Date(), ipAddress });
    return code;
}

export const validateCodeVerification = (type: VerificationType, email: string, code: number) => {
    const dbCode = verificationStorage.get(email);
    if (dbCode?.code === code && dbCode?.type === type && (dbCode.date.getTime() + 15 * 60 * 1000) > new Date().getTime()) {
        verificationStorage.delete(email);
        return true;
    }
    return false;
}

export const requestLoginVerification = async (
  email: string,
  password: string,
  byEmail: boolean = true,
  bySms: boolean = false
) => {
  // console.log(`Requesting login verification for user with email: ${email}`);
  const admin = await Admins.findOne({ email })
    .select("password isVerified devices _id userName removed_at")
    .lean();
  if (!admin) {
    throw new Error("invalid credentials");
  }
  if (admin.removed_at) {
    throw new Error("Your account have been deleted! Please contact support.");
  }
  const isPasswordValid = await comparePassword(password, admin.password || "");
  if (!isPasswordValid) {
    throw new Error("invalid credentials");
  }
  if (checkIfWeJustSentVerificationCode(email, 30))
    throw new Error("try later");
  const code = generateVerificationCode("device verification", email);
  sendVerificationEmail(
    email,
    "Verification code for your Mobtwin account",
    code,
    admin.userName || "user"
  );
  return admin;
};

export const loginWithCode = async (email: string, password: string, code: number, ipAddress: string,res:Response, userAgent?: string) => {
    // console.log(`Logging in user with email: ${email} and code: ${code}`);
    if (!validateCodeVerification("device verification", email, code)) {
        throw new Error('invalid verification code');
    }
    const admin = await Admins.findOne({ email }).select('password isVerified devices email userName avatar plan loginAttempts _id removed_at role').lean();
    if (!admin) {
        throw new Error('invalid credentials');
    }
    if (admin.removed_at) {
        throw new Error('Your account have been deleted! Please contact support.');
    }
    const isPasswordValid = await comparePassword(password, admin.password || '');
    if (!isPasswordValid) {
        throw new Error('invalid credentials');
    }
    const expressPayload: Express.User = {
        id: admin._id as string,
        email: admin.email,
        userName: admin.userName,
        role: admin.role.toString(),
        permissions: [],
      };
    const { accessToken, refreshToken } = await createTokens(res, expressPayload);

    await Admins.updateOne({ email }, {
        $push: { devices: { accessToken, refreshToken, ipAddress, userAgent } },
        $set: { updatedAt: new Date() },
      }
    );
    return { accessToken,admin };
}
