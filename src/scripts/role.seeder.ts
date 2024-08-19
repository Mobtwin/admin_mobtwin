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


const rolesData = [
  {
    name: 'Admin',
    permissions: [...Object.values(ADMIN_PERMISSIONS),...Object.values(APPS_BUILD_PERMISSIONS),...Object.values(USER_PERMISSIONS),...Object.values(THEME_PERMISSIONS),...Object.values(TEMPLATE_PERMISSIONS),...Object.values(PLAN_PERMISSIONS)],
  }
];

const seedRolesAndPermissions = async () => {
  try {
    // Connect to the database
    await mongoose.connect(environment.MONGODB_URI);

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
    }

    console.log('Roles and permissions have been seeded successfully');
  } catch (error) {
    console.error('Error seeding roles and permissions:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedRolesAndPermissions();
