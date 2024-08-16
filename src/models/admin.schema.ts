import { Document, model, Model, Schema } from "mongoose";

export const ROLES = ["admin", "maintainer"];
export const ROLES_OPTIONS = {
    admin: "admin",
    maintainer: "maintainer"
}
export interface IAdmin {
    userName: string;
    email: string;
    role: "admin" | "maintainer";
    password: string;
}

export interface IAdminDocument extends IAdmin, Document {
    createdAt: Date;
    updatedAt: Date;
    removed_at?: Date;
    devices: IDevice[];
}
export interface IDevice extends Document {
    ipAddress?: string;
    userAgent?: string;
    accessToken?: string;
    refreshToken?: string;
    created_at: Date;
    updated_at: Date;
    removed_at?: Date;
}
const deviceSchema = new Schema<IDevice>({
    ipAddress: { type: String },
    userAgent: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    removed_at: { type: Date }
},{_id: false});
const AdminSchema = new Schema<IAdminDocument>({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "maintainer"], default: "maintainer" },
    devices: [deviceSchema],
    removed_at: { type: Date },
},{ timestamps: true});

export const Admins:Model<IAdminDocument> = model<IAdminDocument>('Admin', AdminSchema);