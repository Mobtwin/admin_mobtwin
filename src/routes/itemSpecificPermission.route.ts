import { Router } from "express";
import { assignPermissionOfItemToUserController, unassignPermissionsOfItemToUserController } from "../controllers/itemSpecificPermission.controller";

export const itemSpecificPermissionRoute = Router();

// Method: POST
// Path: /itemSpecificPermission/assign
// assign permission of item to user
itemSpecificPermissionRoute.post("/assign", assignPermissionOfItemToUserController);

// Method: POST
// Path: /itemSpecificPermission/unassign
// unassign permission of item to user
itemSpecificPermissionRoute.post("/unassign", unassignPermissionsOfItemToUserController );























