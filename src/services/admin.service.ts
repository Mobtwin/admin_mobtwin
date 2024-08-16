import { Admins, IAdmin, ROLES, ROLES_OPTIONS } from "../models/admin.schema";
import { hashPassword } from "../utils/hashing";
import { verifyPasswordStrength } from "../utils/string.format";

//create admin service
export const createAdmin = async (admin: IAdmin) => {
  try {
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
    return newAdmin;
  } catch (error: any) {
    throw error;
  }
};
//get all admins service
export const getAllAdmins = async () => {
  try {
    const admins = await Admins.find({});
    if (!admins) throw new Error("No admins found!");
    return admins;
  } catch (error: any) {
    throw error;
  }
};

//get admin by id service
export const getAdminById = async (id: string) => {
  try {
    const admin = await Admins.findById(id);
    if (!admin) throw new Error("Admin not found!");
    return admin;
  } catch (error: any) {
    throw error;
  }
};

//update admin by id service
export const updateAdminById = async (
  id: string,
  admin: Partial<IAdmin>,
  userRole: (typeof ROLES)[number]
) => {
  try {
    const toBeUpdated = await Admins.findById(id);
    if (!toBeUpdated) throw new Error("Admin not found!");
    if (
      toBeUpdated.role === ROLES_OPTIONS.admin &&
      userRole !== ROLES_OPTIONS.admin
    )
      throw new Error("Unauthorized!");
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
    const updatedAdmin = await Admins.findByIdAndUpdate(id, admin, {
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
  userRole: (typeof ROLES)[number]
) => {
  try {
    const toBeDeleted = await Admins.findById(id);
    if (!toBeDeleted) throw new Error("Admin not found!");
    if (toBeDeleted.role === ROLES_OPTIONS.admin && userRole !== ROLES_OPTIONS.admin)
      throw new Error("Unauthorized!");
    const deletedAdmin = await Admins.findByIdAndUpdate(id, { removed_at: Date.now() }, { new: true });
    if (!deletedAdmin) throw new Error("Admin not deleted!");
    return deletedAdmin;
  } catch (error: any) {
    throw error;
  }
};
