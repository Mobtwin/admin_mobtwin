import { Document, Model, model, Schema } from "mongoose";

export interface IPermission {
  name: string; // e.g., 'CREATE_USER'
  description?: string; // e.g., 'Create a new user'
}

export interface IPermissionDocument extends IPermission, Document {};

const PermissionSchema = new Schema<IPermissionDocument>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
}, { timestamps: true });

export const Permissions:Model<IPermissionDocument> = model<IPermissionDocument>('Permission', PermissionSchema);