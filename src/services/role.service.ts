import { Schema } from "mongoose";
import { IPermissionDocument, Permissions } from "../models/permission.schema";
import { IRoleDocument, IRolePopulated, Roles } from "../models/role.schema";
import { CreateRole } from "../validators/role.validator";
import fetchPaginatedData from "../utils/pagination";

export const isValidRole = async (userRole:string,permissionName:string) => {
  const role = await Roles.findById(userRole).populate("permissions") as IRolePopulated | null;
  if (
    role &&
    role.permissions.some((permission) => permission.name === permissionName)
  ) {
    return true; // Role-based permission found, proceed
  }
  return false;
};

// create a new role service
export const createRole = async (role:CreateRole) => {
  try {
    const existingRole = await Roles.findOne({ name: role.name });
    if (existingRole) {
      throw new Error("Role already exists!");
    }
    const permissions = await Permissions.find({ _id: { $in: role.permissions } }) as IPermissionDocument[] | [];
    if (permissions.length !== role.permissions.length) {
      throw new Error("Some permissions not found!");
    }
    const permissionsArray = permissions.map((permission) => permission._id as Schema.Types.ObjectId);
    const permissionNames = permissions.map((permission) => permission.name);
    const newRole = await Roles.create({ name: role.name, permissions: permissionsArray });
    if (!newRole) 
      throw new Error("Role not created!");
    return {...newRole,permissionNames};
  } catch (error) {
    throw error;
  }
}

// get all roles service
export const getAllRoles = async ({limit,skip}:{skip:number,limit:number}) => {
  try {
    const {data,pagination} = await fetchPaginatedData<IRoleDocument>(Roles,skip,limit,{},"permissions");
    return {data, pagination};
  } catch (error) {
    throw error;
  }
}

// get role by id service
export const getRoleById = async (id:string) => {
  try {
    const role = await Roles.findById(id).populate("permissions");
    if (!role) {
      throw new Error("Role not found!");
    }
    return role;
  } catch (error) {
    throw error;
  }
}

// get role by name service
export const getRoleByName = async (name:string) => {
  try {
    const role = await Roles.findOne({ name }).populate("permissions");
    if (!role) {
      throw new Error("Role not found!");
    }
    return role;
  } catch (error) {
    throw error;
  }
}

// assign permissions to a role by Id service
export const assignPermissionsById = async (roleId:string, permissions:string[]) => {
  try {
    const role = await Roles.findById(roleId);
    if (!role) {
      throw new Error("Role not found!");
    }
    // Find the permission by ID
    const permissionsArray = await Permissions.find({ _id: { $in: permissions } }) as IPermissionDocument[] | [];
    if (permissionsArray.length !== permissions.length) {
      throw new Error("Some permissions not found!");
    }
    permissionsArray.map((permission) => {
      if (!role.permissions.includes(permission._id as Schema.Types.ObjectId)) {
        role.permissions.push(permission._id as Schema.Types.ObjectId);
      }else{
        throw new Error("Permission already exists!");
      }
    });
    await role.save();

    return role;
  } catch (error) {
    throw error;
  }
}

// assign permissions to a role by name service
export const assignPermissionsByName = async (RoleName:string, permissions:string[]) => {
  try {
    const role = await Roles.findOne({name:RoleName});
    if (!role) {
      throw new Error("Role not found!");
    }
    // Find the permission by ID
    const permissionsArray = await Permissions.find({ _id: { $in: permissions } }) as IPermissionDocument[] | [];
    if (permissionsArray.length !== permissions.length) {
      throw new Error("Some permissions not found!");
    }
    permissionsArray.map((permission) => {
      if (!role.permissions.includes(permission._id as Schema.Types.ObjectId)) {
        role.permissions.push(permission._id as Schema.Types.ObjectId);
      }else{
        throw new Error("Permission already exists!");
      }
    });
    await role.save();

    return role;
  } catch (error) {
    throw error;
  }
}

// remove permissions from a role by Id service
export const removePermissionsById = async (roleId:string, permissions:string[]) => {
  try {
    const role = await Roles.findById(roleId);
    if (!role) {
      throw new Error("Role not found!");
    }
    // Find the permission by ID
    const permissionsArray = await Permissions.find({ _id: { $in: permissions } }) as IPermissionDocument[] | [];
    if (permissionsArray.length !== permissions.length) {
      throw new Error("Some permissions not found!");
    }
    permissionsArray.map((permission) => {
      if (role.permissions.includes(permission._id as Schema.Types.ObjectId)) {
        role.permissions = role.permissions.filter((id) => id !== permission._id);
      }else{
        throw new Error("Permission not found!");
      }
    });
    await role.save();

    return role;
  } catch (error) {
    throw error;
  }
}

// remove permissions from a role by name service
export const removePermissionsByName = async (RoleName:string, permissions:string[]) => {
  try {
    const role = await Roles.findOne({name:RoleName});
    if (!role) {
      throw new Error("Role not found!");
    }
    // Find the permission by ID
    const permissionsArray = await Permissions.find({ _id: { $in: permissions } }) as IPermissionDocument[] | [];
    if (permissionsArray.length !== permissions.length) {
      throw new Error("Some permissions not found!");
    }
    permissionsArray.map((permission) => {
      if (role.permissions.includes(permission._id as Schema.Types.ObjectId)) {
        role.permissions = role.permissions.filter((id) => id !== permission._id);
      }else{
        throw new Error("Permission not found!");
      }
    });
    await role.save();

    return role;
  } catch (error) {
    throw error;
  }
}










