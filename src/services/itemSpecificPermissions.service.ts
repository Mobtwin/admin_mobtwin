import { Model, Schema } from "mongoose";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import { ItemSpecificPermissions } from "../models/itemSpecificPermission.schema";
import { Users } from "../models/user.schema";
import { ADMIN_TABLE } from "../constant/admin.constant";
import { Admins } from "../models/admin.schema";
import { getAdminById } from "./admin.service";
import { USER_TABLE } from "../constant/user.constant";
import { getUserById } from "./user.service";
import { THEME_TABLE } from "../constant/theme.constant";
import { getThemeById } from "./theme.service";
import { TEMPLATE_TABLE } from "../constant/template.constant";
import { getTemplateById } from "./template.service";
import { APPS_BUILD_TABLE } from "../constant/appsBuild.constant";
import { getAppBuildById } from "./appsBuild.service";
import { PERMISSION_TABLE } from "../constant/permission.constant";
import { getPermissionById } from "./permission.service";
import { ROLE_TABLE } from "../constant/role.constant";
import { getRoleById } from "./role.service";
import { PLAN_TABLE } from "../constant/plan.constant";
import { getPlanById } from "./plan.service";
import { ITEM_SPECIFIC_PERMISSION_TABLE } from "../constant/itemSpecificPermission.constant";

export type IAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "read_own"
  | "assign"
  | "unassign"
  | "status";
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
  adminId: string,
  resource: {
    table: string;
    itemId: string;
  }
) => {
  try {
    // check if admin exists 
    const adminExists = await Admins.findById(adminId).lean();
    if (!adminExists) throw new Error("admin not found!");
    // check if item exists
    let itemExists: any;
    switch (resource.table) {
      case ADMIN_TABLE:
        itemExists = await getAdminById(resource.itemId);
        break;
      case USER_TABLE:
        itemExists = await getUserById(resource.itemId);
        break;
      case THEME_TABLE:
        itemExists = await getThemeById(resource.itemId);
        break;
      case TEMPLATE_TABLE:
        itemExists = await getTemplateById(resource.itemId);
        break;
      case APPS_BUILD_TABLE:
        itemExists = await getAppBuildById(resource.itemId);
        break;
      case PERMISSION_TABLE:
        itemExists = await getPermissionById(resource.itemId);
        break;
      case ROLE_TABLE:
        itemExists = await getRoleById(resource.itemId);
        break;
      case PLAN_TABLE:
        itemExists = await getPlanById(resource.itemId);
        break;
    
      default:
        throw new Error("Unsupported resource Table: " + resource.table);
    }
    if (!itemExists) throw new Error("Item not found!");
    // Check if item-specific permission already exists
    const permission = await ItemSpecificPermissions.findOne({adminId,table:resource.table,action});
    if(permission) {
      const updatedPermission = await ItemSpecificPermissions.findOneAndUpdate({userId:adminId,table:resource.table,action},{$addToSet:{items:resource.itemId}},{new:true});
      if(!updatedPermission) throw new Error("Permission not updated!");
      return updatedPermission;
    }
    const newPermission = await ItemSpecificPermissions.create({userId:adminId,table:resource.table,action,items:[resource.itemId]});
    if(!newPermission) throw new Error("Permission not created!");
    return newPermission;
  } catch (error: any) {
    throw error;
  }
};

// unassign item-specific permissions service
export const unassignItemSpecificPermissions = async (
  action: IAction,
  adminId: string,
  resource: {
    table: string;
    itemId: string;
  }
) => {
  try {
    // check if admin exists 
    const adminExists = await Admins.findById(adminId).lean();
    if (!adminExists) throw new Error("admin not found!");
    // check if item exists
    let itemExists: any;
    switch (resource.table) {
      case ADMIN_TABLE:
        itemExists = await getAdminById(resource.itemId);
        break;
      case USER_TABLE:
        itemExists = await getUserById(resource.itemId);
        break;
      case THEME_TABLE:
        itemExists = await getThemeById(resource.itemId);
        break;
      case TEMPLATE_TABLE:
        itemExists = await getTemplateById(resource.itemId);
        break;
      case APPS_BUILD_TABLE:
        itemExists = await getAppBuildById(resource.itemId);
        break;
      case PERMISSION_TABLE:
        itemExists = await getPermissionById(resource.itemId);
        break;
      case ROLE_TABLE:
        itemExists = await getRoleById(resource.itemId);
        break;
      case PLAN_TABLE:
        itemExists = await getPlanById(resource.itemId);
        break;
    
      default:
        throw new Error("Unsupported resource Table: " + resource.table);
    }
    if (!itemExists) throw new Error("Item not found!");
    // Check if item-specific permission already exists
    const permission = await ItemSpecificPermissions.findOne({userId:adminId,table:resource.table,action});
    if (!permission) throw new Error("admin doesn't have the Table Permission!");
    const updatedPermission = await ItemSpecificPermissions.findOneAndUpdate(
      { userId:adminId, table: resource.table, action },
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
    // check if admin exists 
    const adminExists = await getAdminById(userId);
    if (!adminExists) throw new Error("Admin not found!");
    // check if item exists
    let itemExists: any;
    switch (resource.table) {
      case ADMIN_TABLE:
        itemExists = await getAdminById(resource.itemId);
        break;
      case USER_TABLE:
        itemExists = await getUserById(resource.itemId);
        break;
      case THEME_TABLE:
        itemExists = await getThemeById(resource.itemId);
        break;
      case TEMPLATE_TABLE:
        itemExists = await getTemplateById(resource.itemId);
        break;
      case APPS_BUILD_TABLE:
        itemExists = await getAppBuildById(resource.itemId);
        break;
      case PERMISSION_TABLE:
        itemExists = await getPermissionById(resource.itemId);
        break;
      case ROLE_TABLE:
        itemExists = await getRoleById(resource.itemId);
        break;
      case PLAN_TABLE:
        itemExists = await getPlanById(resource.itemId);
        break;
    
      default:
        throw new Error("Unsupported resource Table: " + resource.table);
    }
    if (!itemExists) throw new Error("Item not found!");
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
    const ownItems = await ItemSpecificPermissions.findOne({
      action,
      userId,
      table,
    }).lean();
    if (!ownItems) throw new Error(`No ${table}s found!`);
    const itemIds = ownItems.items;
    return itemIds;
  } catch (error: any) {
    throw error;
  }
};
