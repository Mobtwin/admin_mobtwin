import { FilterQuery } from "mongoose";
import { IPermissionDocument, Permissions } from "../models/permission.schema";
import fetchPaginatedData from "../utils/pagination";
import { CreatePermission, UpdatePermissionById,UpdatePermissionByName } from "../validators/permission.validator";
import { IAction } from "./itemSpecificPermissions.service";

// create permission service
export const createPermission = async (permission: CreatePermission) => {
    try {
        const existingPermission = await Permissions.findOne({ ...permission });
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
// get searched permissions
export const getSearchedPermissions = async ({skip,limit,filters}:{skip:number,limit:number,filters:FilterQuery<IPermissionDocument>}) => {
    try {
        const {data,pagination} = await fetchPaginatedData<IPermissionDocument>(Permissions,skip,limit,filters);
        return {data, pagination};
    } catch (error: any) {
        throw new Error(error.message);
    }
};
// get permission by Id
export const getPermissionById = async (id:string) => {
    try {
        const permission = await Permissions.findById(id).lean();
        if (!permission) {
            throw new Error("Permission not found!");
        }
        return permission;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// update permission by name
export const updatePermissionByName = async (name: string, permission: UpdatePermissionByName) => {
    try {
        const existingPermission = await Permissions.findOneAndUpdate({ name },{...permission}, { new: true }).lean();
        if (!existingPermission) {
            throw new Error("Permission not found!");
        }
        return existingPermission;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
// update permission by id
export const updatePermissionById = async (id: string, permission: UpdatePermissionById) => {
    try {
        const existingPermission = await Permissions.findOneAndUpdate({ _id:id },{...permission}, { new: true }).lean();
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
        const existingPermission = await Permissions.findOneAndDelete({ name }).lean();
        if (!existingPermission) {
            throw new Error("Permission not found!");
        }
        return existingPermission;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
// delete permission by id
export const deletePermissionById = async (id: string) => {
    try {
        const existingPermission = await Permissions.findOneAndDelete({ _id:id }).lean();
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

