import mongoose from 'mongoose';
import { ADMIN_PERMISSIONS } from '../constant/admin.constant';
import { APPS_BUILD_PERMISSIONS } from '../constant/appsBuild.constant';
import { USER_PERMISSIONS } from '../constant/user.constant';
import { THEME_PERMISSIONS } from '../constant/theme.constant';
import { TEMPLATE_PERMISSIONS } from '../constant/template.constant';
import { PLAN_PERMISSIONS } from '../constant/plan.constant';
import { environment } from '../utils/loadEnvironment';
import { Permissions } from '../models/permission.schema';
import { Roles } from '../models/role.schema';
import { Admins } from '../models/admin.schema';
import { PERMISSION_PERMISSIONS } from '../constant/permission.constant';
import { ROLE_PERMISSIONS } from '../constant/role.constant';
import { ITEM_SPECIFIC_PERMISSION_PERMISSIONS } from '../constant/itemSpecificPermission.constant';


const rolesData = [
  {
    name: 'Admin',
    permissions: [...Object.values(ADMIN_PERMISSIONS),...Object.values(APPS_BUILD_PERMISSIONS),...Object.values(USER_PERMISSIONS),...Object.values(THEME_PERMISSIONS),...Object.values(TEMPLATE_PERMISSIONS),...Object.values(PLAN_PERMISSIONS),...Object.values(PERMISSION_PERMISSIONS),...Object.values(ROLE_PERMISSIONS),...Object.values(ITEM_SPECIFIC_PERMISSION_PERMISSIONS)],
  },
  {
    name: 'Checker',
    permissions: [...Object.values(THEME_PERMISSIONS),...Object.values(TEMPLATE_PERMISSIONS)],
  },
  {
    name: 'Mobile Developer',
    permissions: [THEME_PERMISSIONS.READ_OWN,THEME_PERMISSIONS.CREATE,THEME_PERMISSIONS.UPDATE],
  },
  {
    name: 'User',
    permissions: [THEME_PERMISSIONS.READ,TEMPLATE_PERMISSIONS.READ,APPS_BUILD_PERMISSIONS.READ_OWN,APPS_BUILD_PERMISSIONS.CREATE,PLAN_PERMISSIONS.READ],
  },
];

export const seedRolesAndPermissions = async () => {
  try {

    console.log('Connected to MongoDB');

    // Clear existing data (optional)
    await Permissions.deleteMany({});
    await Roles.deleteMany({});
    console.log('Cleared existing roles and permissions');

    for (const roleData of rolesData) {
      const permissionIds = [];

      for (const permissionName of roleData.permissions) {
        let permission = await Permissions.findOne({ name: permissionName });

        // If permission doesn't exist, create it
        if (!permission) {
          permission = new Permissions({ name: permissionName });
          await permission.save();
          console.log(`Created permission: ${permissionName}`);
        }

        permissionIds.push(permission._id);
      }

      const role = new Roles({
        name: roleData.name,
        permissions: permissionIds,
      });

      await role.save();
      console.log(`Created role: ${roleData.name}`);
      const updatedAdmin = await Admins.findOneAndUpdate({ email: "bourichi.overlord@gmail.com" }, { role: role._id }, { new: true });
      console.log(`Updated admin: ${updatedAdmin?.userName} role to: ${roleData.name}`);
    }

    console.log('Roles and permissions have been seeded successfully');
  } catch (error) {
    console.error('Error seeding roles and permissions:', error);
  } 
};

