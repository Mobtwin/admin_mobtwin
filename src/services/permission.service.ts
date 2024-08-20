import { Permissions } from "../models/permission.schema";
import { CreatePermission } from "../validators/permission.validator";

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
export const getAllPermissions = async () => {
    try {
        const permissions = await Permissions.find();
        return permissions;
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



