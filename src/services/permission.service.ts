import { IPermissionDocument, Permissions } from "../models/permission.schema";
import fetchPaginatedData from "../utils/pagination";
import { CreatePermission } from "../validators/permission.validator";
import { IAction } from "./itemSpecificPermissions.service";

// create permission service
export const createPermission = async (permission: CreatePermission) => {
    try {
        const existingPermission = await Permissions.findOne({ name: permission.name });
        if (existingPermission) {
            throw new Error("Permission already exists!");
        }
        const newPermission = await Permissions.create(permission);
        return newPermission;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// get all permissions
export const getAllPermissions = async ({skip,limit}:{skip:number,limit:number}) => {
    try {
        const {data,pagination} = await fetchPaginatedData<IPermissionDocument>(Permissions,skip,limit,{});
        return {data, pagination};
    } catch (error: any) {
        throw new Error(error.message);
    }
};
// get permission by Id
export const getPermissionById = async (id:string) => {
    try {
        const permission = await Permissions.findById(id);
        if (!permission) {
            throw new Error("Permission not found!");
        }
        return permission;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// update permission by name
export const updatePermissionByName = async (name: string, permission: CreatePermission) => {
    try {
        const existingPermission = await Permissions.findOneAndUpdate({ name },{name: permission.name}, { new: true });
        if (!existingPermission) {
            throw new Error("Permission not found!");
        }
        return existingPermission;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

// delete permission by name
export const deletePermissionByName = async (name: string) => {
    try {
        const existingPermission = await Permissions.findOneAndDelete({ name });
        if (!existingPermission) {
            throw new Error("Permission not found!");
        }
        return existingPermission;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const getPermissionName =  (action: IAction,table:string) => {
    return `${table}.${action}`;
}

