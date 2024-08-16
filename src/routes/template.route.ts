import { Router } from "express";
import { createTemplateController, getAllTemplatesController, getTemplateByIdController, updateTemplateByIdController } from "../controllers/template.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import { createTemplateSchema, templateByIdSchema, updateTemplateSchema } from "../validators/template.validator";

const templateRouter = Router();

// Method: POST
// Route: /template
// Create a new template
templateRouter.post("/",validateRequest(createTemplateSchema), createTemplateController);

// Method: GET
// Route: /template
// Get all templates
templateRouter.get("/", getAllTemplatesController);

// Method: GET
// Route: /template/:id
// Get template by id
templateRouter.get("/:id",validateRequest(templateByIdSchema,"params"), getTemplateByIdController);

// Method: PUT
// Route: /template/:id
// Update template by id
templateRouter.put("/:id",validateRequest(updateTemplateSchema), updateTemplateByIdController);

// Method: PUT
// Route: /template/delete/:id
// Delete template by id
templateRouter.put("/delete/:id",validateRequest(templateByIdSchema,"params"), getTemplateByIdController);
















