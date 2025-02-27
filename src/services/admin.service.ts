import { FilterQuery, ObjectId } from "mongoose";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import { ADMIN_PERMISSIONS, ADMIN_TABLE } from "../constant/admin.constant";
import { Admins, IAdmin, IAdminDocument, ROLES, ROLES_OPTIONS } from "../models/admin.schema";
import { ItemSpecificPermissions } from "../models/itemSpecificPermission.schema";
import {  Roles } from "../models/role.schema";
import { hashPassword } from "../utils/hashing";
import fetchPaginatedData from "../utils/pagination";
import { verifyPasswordStrength } from "../utils/string.format";
import { assignCreatorItemSpecificPermissions, assignItemSpicificPermission, getOwnItemsByPermissionAction } from "./itemSpecificPermissions.service";

//create admin service
export const createAdmin = async (admin: IAdmin,userId:string) => {
  try {
    const role = await Roles.findById(admin.role);
    if (!role) throw new Error("Invalid Field. Role not found!");
    const existingAdminByEmail = await Admins.findOne({
      email: admin.email,
    });
    if (existingAdminByEmail) throw new Error("Email already exists!");
    const existingAdminByUsername = await Admins.findOne({
      userName: admin.userName,
    });
    if (existingAdminByUsername) throw new Error("Username already exists!");
    const hashedPassword = await hashPassword(admin.password);
    const newAdmin = await Admins.create({
      ...admin,
      password: hashedPassword,
    });
    if (!newAdmin) throw new Error("Admin not created!");
    await assignCreatorItemSpecificPermissions(userId,{table:ADMIN_TABLE,itemId:newAdmin._id as string});
    return newAdmin;
  } catch (error: any) {
    throw error;
  }
};

//delete admin session service
export const deleteAdminSession = async (adminId: string) => {
  try {
    const admin = await Admins.findById(adminId);
    if (!admin) throw new Error("Admin not found!");
    const updatedAdmin = await Admins.updateOne(
      { _id: adminId,removed_at: {$exists:false} },
      { devices:[] }
    );
    if (!updatedAdmin.modifiedCount) throw new Error("Admin session removal failed!");
    return {message:"Admin session removed successfully!"};
  } catch (error: any) {
    throw error;
  }
};

//get all admins service
export const getAllAdmins = async ({readOwn=false,userId,skip,limit}:{readOwn:boolean,userId:string,skip:number,limit:number}) => {
  try {
    if(readOwn) {
      const itemsIds = await getOwnItemsByPermissionAction(userId,ADMIN_TABLE,PERMISSIONS_ACTIONS.READ)
      const {data,pagination} = await fetchPaginatedData<IAdminDocument>(Admins,skip,limit,{_id:{$in:itemsIds},removed_at:{ $exists: false }},"role");
      if (!data.length) throw new Error("No admins found!");
      return {data,pagination};
    }
    const {data,pagination} = await fetchPaginatedData<IAdminDocument>(Admins,skip,limit,{removed_at:{ $exists: false }},"role");
    if (!data.length) throw new Error("No admins found!");
    return {data,pagination};
  } catch (error: any) {
    throw error;
  }
};

//get admin by id service
export const getAdminById = async (id: string) => {
  try {
    const admin = await Admins.findById(id).populate('role').lean();
    if (!admin || admin.removed_at) throw new Error("Admin not found!");
    return admin;
  } catch (error: any) {
    throw error;
  }
};

//update admin by id service
export const updateAdminById = async (
  id: string,
  admin: Partial<IAdmin>
) => {
  try {
    const toBeUpdated = await Admins.findById(id);
    if (!toBeUpdated || toBeUpdated.removed_at) throw new Error("Admin not found!");
    let roleId : ObjectId | undefined;
    if(admin.role) {
      const role = await Roles.findById(admin.role);
      if (!role) throw new Error("Invalid Field. Role not found!");
      roleId = role._id as ObjectId
    }
    if (admin.email) {
      const existingAdminByEmail = await Admins.findOne({
        email: admin.email,
      });
      if (existingAdminByEmail) throw new Error("Email already exists!");
    }
    if (admin.userName) {
      const existingAdminByUsername = await Admins.findOne({
        userName: admin.userName,
      });
      if (existingAdminByUsername) throw new Error("Username already exists!");
    }
    if (admin.password && !verifyPasswordStrength(admin.password))
      throw new Error("Password does not meet requirements!");
    if (admin.password) admin.password = await hashPassword(admin.password);
    const updatedAdmin = await Admins.findByIdAndUpdate(id, {...admin,role:roleId}, {
      new: true,
    });
    if (!updatedAdmin) throw new Error("Admin not updated!");
    return updatedAdmin;
  } catch (error: any) {
    throw error;
  }
};

//delete admin by id service
export const deleteAdminById = async (
  id: string,
) => {
  try {
    const toBeDeleted = await Admins.findById(id);
    if (!toBeDeleted || toBeDeleted.removed_at) throw new Error("Admin not found!");
    const deletedAdmin = await Admins.findByIdAndUpdate(id, { removed_at: Date.now() }, { new: true });
    if (!deletedAdmin) throw new Error("Admin not deleted!");
    return deletedAdmin;
  } catch (error: any) {
    throw error;
  }
};

// get searched admins
export const getSearchedAdmins = async ({skip,limit,filters}:{skip:number,limit:number,filters:FilterQuery<IAdminDocument>}) => {
  try {
      const {data,pagination} = await fetchPaginatedData<IAdminDocument>(Admins,skip,limit,filters);
      return {data, pagination};
  } catch (error: any) {
      throw new Error(error.message);
  }
};