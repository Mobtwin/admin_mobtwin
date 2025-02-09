import { Document, Model, model, Schema } from "mongoose";
import { IPermission } from "./permission.schema";

export interface IRole {
    name: string;
    permissions: Schema.Types.ObjectId[]; // Reference to permission ObjectIds
  }
  
  export interface IRolePopulated {
    name: string;
    permissions: IPermission[]; // Populated permissions
  }
  

export interface IRoleDocument extends IRole, Document {};

const RoleSchema = new Schema<IRoleDocument>({
    name: { type: String, required: true, unique: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
}, { timestamps: true });

export const Roles:Model<IRoleDocument> = model<IRoleDocument>('Role', RoleSchema);