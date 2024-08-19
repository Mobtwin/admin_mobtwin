import { Document, Model, model, Schema } from "mongoose";

export interface IPermission {
  name: string; // e.g., 'CREATE_USER'
}

export interface IPermissionDocument extends IPermission, Document {};

const PermissionSchema = new Schema<IPermissionDocument>({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Permissions:Model<IPermissionDocument> = model<IPermissionDocument>('Permission', PermissionSchema);