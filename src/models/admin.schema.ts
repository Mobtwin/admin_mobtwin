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

interface IAdminDocument extends IAdmin, Document {
    createdAt: Date;
    updatedAt: Date;
    removed_at?: Date;
}

const AdminSchema = new Schema<IAdminDocument>({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "maintainer"], default: "maintainer" },
    removed_at: { type: Date },
},{ timestamps: true});

export const Admins:Model<IAdminDocument> = model<IAdminDocument>('Admin', AdminSchema);