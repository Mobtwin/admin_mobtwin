import { Roles } from "../models/role.schema";

export const isValidRole = async (userRole:string,permissionName:string) => {
  console.log(userRole,permissionName)
  const role = await Roles.findById(userRole).populate("permissions");
  if (
    role &&
    role.permissions.some((permission) => permission.name === permissionName)
  ) {
    return true; // Role-based permission found, proceed
  }
  return false;
};
