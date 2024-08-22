import { Schema } from "mongoose";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import { ItemSpecificPermissions } from "../models/itemSpecificPermission.schema";

export type IAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "read_own"
  | "assign"
  | "unassign"
  | "all";
export const checkItemSpecificPermission = async (
  userId: string,
  resource: {
    table: string;
    itemId?: string;
  },
  action: IAction
) => {
  try {
    const itemAbsolutePermission = await ItemSpecificPermissions.find({
      userId,
      table: resource.table,
      action,
    }).lean();
    if (itemAbsolutePermission.filter((item) => item.isAbsolute).length > 0) {
      return true;
    }
    if (!resource.itemId) {
      return false;
    }
    const itemPermission = await ItemSpecificPermissions.findOne({
      userId,
      table: resource.table,
      items: { $in: [resource.itemId] },
      action: action,
    }).lean();

    if (itemPermission) {
      return true; // Item-specific permission found, proceed
    }
    return false;
  } catch (error: any) {
    throw error;
  }
};
// assign item specific permission service
export const assignItemSpicificPermission = async (
  action: IAction,
  userId: string,
  resource: {
    table: string;
    itemId?: string;
  }
) => {
  try {
    // Check if item-specific permission already exists
    const alreadyHasPermission = await checkItemSpecificPermission(
      userId,
      resource,
      action
    );
    if (alreadyHasPermission) throw new Error("Permission already exists!");
    // check if user already has this table permission action
    const userHasTablePermission = await ItemSpecificPermissions.findOne({
      userId,
      table: resource.table,
      action: action,
      isAbsolute: false,
    });
    if (userHasTablePermission) {
      // update the user's permission to include the new item
      const updatedPermission = await ItemSpecificPermissions.findOneAndUpdate(
        { userId, table: resource.table, action: action },
        { $push: { items: resource.itemId } },
        { new: true }
      );
      if (!updatedPermission) throw new Error("Permission not updated!");
      return updatedPermission;
    }
    // Assign item-specific permissions if needed
    const permission = await ItemSpecificPermissions.create({
      action,
      table: resource.table,
      userId,
      items: [resource.itemId],
    });
    if (!permission) throw new Error("Permission not assigned!");
    return permission;
  } catch (error: any) {
    throw error;
  }
};

// unassign item-specific permissions service
export const unassignItemSpecificPermissions = async (
  action: IAction,
  userId: string,
  resource: {
    table: string;
    itemId?: string;
  }
) => {
  try {
    // Check if item-specific permission already exists
    const alreadyHasPermission = await checkItemSpecificPermission(
      userId,
      resource,
      action
    );
    if (!alreadyHasPermission) throw new Error("Permission dosn't exists!");
    // check if user already has this table permission action
    const userHasTablePermission = await ItemSpecificPermissions.findOne({
      userId,
      table: resource.table,
      action: action,
    });
    if (!userHasTablePermission) throw new Error("Permission dosn't exists!");
    if(userHasTablePermission.isAbsolute) throw new Error("This user has absolute permission!");
    // update the user's permission to include the new item
    const updatedPermission = await ItemSpecificPermissions.findOneAndUpdate(
      { userId, table: resource.table, action: action },
      { $pull: { items: resource.itemId } },
      { new: true }
    );
    if (!updatedPermission) throw new Error("Permission not updated!");
    return updatedPermission;
  } catch (error: any) {
    throw error;
  }
};

export const assignCreatorItemSpecificPermissions = async (
  userId: string,
  resource: {
    table: string;
    itemId: string;
  }
) => {
  try {
    await assignItemSpicificPermission(
      PERMISSIONS_ACTIONS.READ,
      userId,
      resource
    );
    await assignItemSpicificPermission(
      PERMISSIONS_ACTIONS.UPDATE,
      userId,
      resource
    );
    await assignItemSpicificPermission(
      PERMISSIONS_ACTIONS.DELETE,
      userId,
      resource
    );
  } catch (error: any) {
    throw error;
  }
};

export const getOwnItemsByPermissionAction = async (
  userId: string,
  table: string,
  action: IAction
) => {
  try {
    const ownItems = await ItemSpecificPermissions.find({
      action,
      userId,
      table,
    }).lean();
    if (!ownItems) throw new Error(`No ${table}s found!`);
    let itemIds: Schema.Types.ObjectId[] = [];
    ownItems.map((item) => {
      item.items.forEach((itemId: Schema.Types.ObjectId) => {
        itemIds.push(itemId);
      });
    });
    return itemIds;
  } catch (error: any) {
    throw error;
  }
};
