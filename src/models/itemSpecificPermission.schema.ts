import { Document, Model, model, Schema } from "mongoose";

export interface IItemSpecificPermission {
  name: string; // e.g., 'read', 'update', 'delete'
  resource: string; // e.g., 'users.123'
  user: Schema.Types.ObjectId;
}

export interface IItemSpecificPermissionDocument
  extends IItemSpecificPermission,
    Document {}

const ItemSpecificPermissionSchema = new Schema<IItemSpecificPermissionDocument>({
  name: { type: String, required: true },
  resource: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});


export const ItemSpecificPermissions:Model<IItemSpecificPermissionDocument> = model<IItemSpecificPermissionDocument>('ItemSpecificPermission', ItemSpecificPermissionSchema);