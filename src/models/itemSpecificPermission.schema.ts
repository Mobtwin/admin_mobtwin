import { Document, Model, model, Schema } from "mongoose";

export interface IItemSpecificPermission {
  action: string; // e.g., 'read', 'update', 'delete'
  table: string; // e.g., 'users', 'roles', 'permissions'
  userId: Schema.Types.ObjectId; // e.g., '60b9e3b3b3b3b3b3b3b3b3b3'
  items: Schema.Types.ObjectId[]; // e.g., ['60b9e3b3b3b3b3b3b3b3b3', '60b9e3b3b3b3b3b3b3b3b4']
  isAbsolute: boolean; // e.g., true, false
}

export interface IItemSpecificPermissionDocument
  extends IItemSpecificPermission,
    Document {}

const ItemSpecificPermissionSchema = new Schema<IItemSpecificPermissionDocument>({
  action: { type: String, required: true },
  table: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  items: { type: [Schema.Types.ObjectId], required: true },
  isAbsolute: { type: Boolean, required: true, default: false },
},{timestamps: true});


export const ItemSpecificPermissions:Model<IItemSpecificPermissionDocument> = model<IItemSpecificPermissionDocument>('ItemSpecificPermission', ItemSpecificPermissionSchema);