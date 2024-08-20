import { Router } from "express";
import { assignPermissionsByIdController,  assignPermissionsByNameController,  createRoleController, getAllRolesController, getRoleByIdController, getRoleByNameController, unassignPermissionsByIdController, unassignPermissionsByNameController } from "../controllers/role.controller";
import { checkPermission } from "../middlewares/rbac.middleware";
import { ROLE_PERMISSIONS, ROLE_TABLE } from "../constant/role.constant";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import { togglePermissionsSchema, createRoleSchema, roleByIdSchema, roleByNameSchema } from "../validators/role.validator";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";

const roleRouter = Router();

// Method: POST
// route: /role
// Create a new role
roleRouter.post("/",checkPermission([ROLE_PERMISSIONS.CREATE]),validateRequest(createRoleSchema), createRoleController);

// Method: GET
// route: /role
// Get all roles
roleRouter.get("/",checkPermission([ROLE_PERMISSIONS.READ]), getAllRolesController);

// Method: GET
// route: /role/id/:id
// Get a role by id
roleRouter.get("/id/:id",validateRequest(roleByIdSchema,"params"),checkPermission([ROLE_PERMISSIONS.READ],{table:ROLE_TABLE,action:PERMISSIONS_ACTIONS.READ}), getRoleByIdController);

// Method: GET
// route: /role/name/:name
// Get a role by name
roleRouter.get("/name/:name",validateRequest(roleByNameSchema,"params"),checkPermission([ROLE_PERMISSIONS.READ],{table:ROLE_TABLE,action:PERMISSIONS_ACTIONS.READ}), getRoleByNameController);

// Method: PATCH
// route: /role/assign/id/:id
// assign permissions to a role by id
roleRouter.patch("/assign/id/:id",validateRequest(roleByIdSchema,"params"),checkPermission([ROLE_PERMISSIONS.UPDATE],{table:ROLE_TABLE,action:PERMISSIONS_ACTIONS.UPDATE}),validateRequest(togglePermissionsSchema), assignPermissionsByIdController);

// Method: PATCH
// route: /role/assign/name/:name
// assign permissions to a role by name
roleRouter.patch("/assign/name/:name",validateRequest(roleByNameSchema,"params"),checkPermission([ROLE_PERMISSIONS.UPDATE],{table:ROLE_TABLE,action:PERMISSIONS_ACTIONS.UPDATE}),validateRequest(togglePermissionsSchema),assignPermissionsByNameController);

// Method: PATCH
// route: /role/unassign/id/:id
// unassign permissions to a role by id
roleRouter.patch("/unassign/id/:id",validateRequest(roleByIdSchema,"params"),checkPermission([ROLE_PERMISSIONS.UPDATE],{table:ROLE_TABLE,action:PERMISSIONS_ACTIONS.UPDATE}),validateRequest(togglePermissionsSchema), unassignPermissionsByIdController);

// Method: PATCH
// route: /role/unassign/name/:id
// unassign permissions to a role by name
roleRouter.patch("/unassign/name/:name",validateRequest(roleByNameSchema,"params"),checkPermission([ROLE_PERMISSIONS.UPDATE],{table:ROLE_TABLE,action:PERMISSIONS_ACTIONS.UPDATE}),validateRequest(togglePermissionsSchema), unassignPermissionsByNameController);









