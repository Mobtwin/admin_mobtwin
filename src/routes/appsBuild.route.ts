import { Router } from "express";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import { appsBuildByIdSchema, createAppsBuildSchema, updateAppsBuildSchema } from "../validators/appsBuild.validator";
import { createAppBuildController, deleteAppBuildController, getAllAppBuildsController, getAppBuildByIdController, updateAppBuildController } from "../controllers/appsBuild.controller";
import { checkPermission } from "../middlewares/rbac.middleware";
import { APPS_BUILD_PERMISSIONS, APPS_BUILD_TABLE } from "../constant/appsBuild.constant";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";

export const appsBuildRouter = Router();

// Method: POST
// Path: /appsBuild
// Create a new appBuild
appsBuildRouter.post("/",checkPermission([APPS_BUILD_PERMISSIONS.CREATE]),validateRequest(createAppsBuildSchema),createAppBuildController );

// Method: PUT
// Path: /appsBuild/:id
// Update an existing appBuild
appsBuildRouter.put("/:id",checkPermission([APPS_BUILD_PERMISSIONS.UPDATE],{action:PERMISSIONS_ACTIONS.UPDATE,table:APPS_BUILD_TABLE}),validateRequest(updateAppsBuildSchema),updateAppBuildController );

// Method: GET
// Path: /appsBuild
// Get all appBuilds
appsBuildRouter.get("/",checkPermission([APPS_BUILD_PERMISSIONS.READ,APPS_BUILD_PERMISSIONS.READ_OWN]),getAllAppBuildsController );

// Method: GET
// Path: /appsBuild/:id
// Get an appBuild by ID
appsBuildRouter.get("/:id",validateRequest(appsBuildByIdSchema,"params"),checkPermission([APPS_BUILD_PERMISSIONS.READ],{table:APPS_BUILD_TABLE,action:PERMISSIONS_ACTIONS.READ}),getAppBuildByIdController );

// Method: PUT
// Path: /appsBuild/delete/:id
// Soft delete an appBuild
appsBuildRouter.put("/delete/:id",validateRequest(appsBuildByIdSchema,"params"),checkPermission([APPS_BUILD_PERMISSIONS.DELETE],{table:APPS_BUILD_TABLE,action:PERMISSIONS_ACTIONS.DELETE}),deleteAppBuildController );





