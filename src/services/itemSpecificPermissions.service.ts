import { IAdmin } from "../models/admin.schema";
import { ItemSpecificPermissions } from "../models/itemSpecificPermission.schema";

export type IAction = "create" | "read" | "update" | "delete" | "read_own";

// assign item specific permission service
export const assignItemSpicificPermission = async (
  action: IAction,
  userId:string,
  resource:{
    table:string,
    itemId:string
  }
) => {
  try {
    // Assign item-specific permissions if needed
    const permission = await ItemSpecificPermissions.create({
      name: action,
      resource: `${resource.table}.${resource.itemId}`,
      user: userId,
    });
    if (!permission) throw new Error("Permission not assigned!");
  } catch (error: any) {
    throw error;
  }
};

export const checkItemSpecificPermission = async (
  userId: string,
  resource: {
    table: string;
    itemId: string;
  },
  action: string
) => {
  const itemPermission = await ItemSpecificPermissions.findOne({
    user: userId,
    resource: `${resource.table}.${resource.itemId}`,
    name: action,
  });

  if (itemPermission) {
    return true; // Item-specific permission found, proceed
  }
  return false;
};
