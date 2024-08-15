import { Schema, model, Document, Types, Model } from 'mongoose';

export interface IDevice extends Document {
  ipAddress?: string;
  userAgent?: string;
  accessToken?: string;
  refreshToken?: string;
  created_at: Date;
  updated_at: Date;
  removed_at?: Date;
}

export interface IPocket extends Document {
  name?: string;
  description?: string;
  list: string[];
  sharedWith: string[];
  created_at: Date;
  updated_at: Date;
  removed_at?: Date;
}

export interface IOtp extends Document {
  code: number;
  type?: string;
  metadata?: string;
  expiresAt?: Date;
}

export interface IUser extends Document {
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  isVerified: boolean;
  is2faActive: boolean;
  devices: IDevice[];
  appsBuilder: number;
  defaultDevice?: string;
  avatar?: string;
  otp: IOtp;
  stripeCustomerId?: string;
  googleId?: string;
  facebookId?: string;
  ipRegisteredWith?: string;
  sensitiveActions: {
    count: number;
    lastTransactionAt?: Date;
  };
  recoveryEmail?: string;
  plan: string;
  status: boolean;
  pockets: IPocket[];
  loginAttempts: {
    attempts: number;
    lastAttemptAt?: Date;
  };
  profileUpdates: {
    updates: number;
    lastUpdateAt?: Date;
  };
  resetPasswordAttempts: {
    attempts: number;
    lastAttemptAt?: Date;
  };
  removed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const deviceSchema = new Schema<IDevice>({
  ipAddress: { type: String },
  userAgent: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  removed_at: { type: Date }
});

const pocketSchema = new Schema<IPocket>({
  name: { type: String },
  description: { type: String },
  list: { type: [String], default: [] },
  sharedWith: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  removed_at: { type: Date }
});

const otpSchema = new Schema<IOtp>({
  code: { type: Number },
  type: { type: String },
  metadata: { type: String },
  expiresAt: { type: Date }
});

const userSchema = new Schema<IUser>({
  userName: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  phoneNumber: { type: String },
  isVerified: { type: Boolean, default: false },
  is2faActive: { type: Boolean, default: false },
  devices: { type: [deviceSchema], default: [] },
  appsBuilder: { type: Number, default: 5 },
  defaultDevice: { type: String },
  avatar: { type: String },
  otp: {
    type: otpSchema,
    default: {
      code: 0,
      type: null,
      metadata: null,
      expiresAt: null
    }
  },
  stripeCustomerId: { type: String },
  googleId: { type: String },
  facebookId: { type: String },
  ipRegisteredWith: { type: String },
  sensitiveActions: {
    count: { type: Number, default: 0 },
    lastTransactionAt: { type: Date, default: null }
  },
  recoveryEmail: { type: String },
  plan: { type: String, default: "free" },
  status: { type: Boolean, default: true },
  pockets: { type: [pocketSchema], default: [] },
  loginAttempts: {
    attempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date, default: null }
  },
  profileUpdates: {
    updates: { type: Number, default: 0 },
    lastUpdateAt: { type: Date, default: null }
  },
  resetPasswordAttempts: {
    attempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date, default: null }
  },
  removed_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export const Users:Model<IUser> = model<IUser>('User', userSchema);
