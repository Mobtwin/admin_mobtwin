import { Router } from "express";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import { createThemeSchema, themeByIdSchema, updateThemeSchema } from "../validators/theme.validator";
import { createThemeController, deleteThemeController, getAllThemesController, getThemeByIdController, updateThemeController } from "../controllers/theme.controller";

const themeRouter = Router();

// Method: POST
// Route: /theme
// Create a new theme
themeRouter.post("/",validateRequest(createThemeSchema),createThemeController);

// Method: GET
// Route: /theme
// Get all themes
themeRouter.get("/",getAllThemesController);

// Method: GET
// Route: /theme/:id
// Get theme by id
themeRouter.get("/:id",validateRequest(themeByIdSchema,"params"),getThemeByIdController);

// Method: PUT
// Route: /theme/:id
// Update theme by id
themeRouter.put("/:id",validateRequest(updateThemeSchema),updateThemeController);

// Method: PUT
// Route: /theme/delete/:id
// Delete theme by id
themeRouter.put("/delete/:id",validateRequest(themeByIdSchema,"params"),deleteThemeController);
