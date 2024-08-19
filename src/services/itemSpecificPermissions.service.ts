import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
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
      admin: userId,
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
  try {
    const itemPermission = await ItemSpecificPermissions.findOne({
      admin: userId,
      resource: `${resource.table}.${resource.itemId}`,
      name: action,
    });
  
    if (itemPermission) {
      return true; // Item-specific permission found, proceed
    }
    return false;
  } catch (error: any) {
    throw error;
    
  }
};

export const removeItemSpecificPermission = async (
  userId: string,
  resource: {
    table: string;
    itemId: string;
  },
  action: string
) => {
  try {
    const deletedPermission = await ItemSpecificPermissions.findOneAndDelete({
      admin: userId,
      resource: `${resource.table}.${resource.itemId}`,
      name: action,
    });
    if (!deletedPermission) throw new Error("Permission not deleted!");
    return deletedPermission;
  } catch (error: any) {
    throw error;
  }
};

export const assignCreatorItemSpecificPermissions = async (
  userId:string,
  resource:{
    table:string,
    itemId:string
  }) => {
  try {
    await assignItemSpicificPermission(PERMISSIONS_ACTIONS.READ,userId,resource);
    await assignItemSpicificPermission(PERMISSIONS_ACTIONS.UPDATE,userId,resource);
    await assignItemSpicificPermission(PERMISSIONS_ACTIONS.DELETE,userId,resource);
  } catch (error: any) {
    throw error;
  }
}

export const getOwnItemsByPermissionAction = async (userId:string,table:string,action:IAction) => {
try {
  const ownItems = await ItemSpecificPermissions.find({
    name: action,
    admin: userId,
    resource: new RegExp(`^${table}\\.`),
  })
    .select("resource")
    .lean();
  if (!ownItems) throw new Error(`No ${table} found!`);
  const itemIds = ownItems.map((item) => item.resource.split(".")[1]);
  return itemIds;
} catch (error:any) {
  throw error;
}

}