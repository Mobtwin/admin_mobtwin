import { Router } from "express";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import { appsBuildByIdSchema, createAppsBuildSchema, updateAppsBuildSchema } from "../validators/appsBuild.validator";
import { createAppBuildController, deleteAppBuildController, getAllAppBuildsController, getAppBuildByIdController, updateAppBuildController } from "../controllers/appsBuild.controller";

const appsBuildRouter = Router();

// Method: POST
// Path: /appsBuild
// Create a new appBuild
appsBuildRouter.post("/",validateRequest(createAppsBuildSchema),createAppBuildController );

// Method: PUT
// Path: /appsBuild/:id
// Update an existing appBuild
appsBuildRouter.put("/:id",validateRequest(updateAppsBuildSchema),updateAppBuildController );

// Method: GET
// Path: /appsBuild
// Get all appBuilds
appsBuildRouter.get("/",getAllAppBuildsController );

// Method: GET
// Path: /appsBuild/:id
// Get an appBuild by ID
appsBuildRouter.get("/:id",validateRequest(appsBuildByIdSchema,"params"),getAppBuildByIdController );

// Method: PUT
// Path: /appsBuild/delete/:id
// Soft delete an appBuild
appsBuildRouter.put("/delete/:id",validateRequest(appsBuildByIdSchema,"params"),deleteAppBuildController );





