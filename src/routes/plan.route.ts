import { Router } from "express";
import { createPlanController, deletePlanByIdController, getAllPlansController, getPlanByIdController, updatePlanByIdController } from "../controllers/plan.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import { createPlanSchema, planByIdSchema, updatePlanSchema } from "../validators/plan.validator";


const planRouter = Router();

// Method: POST
// Route: /plan
// Create a new plan
planRouter.post('/',validateRequest(createPlanSchema), createPlanController);

// Method: GET
// Route: /plan
// Get all plans
planRouter.get('/', getAllPlansController);

// Method: GET
// Route: /plan/:id
// Get plan by id
planRouter.get('/:id',validateRequest(planByIdSchema,"params"), getPlanByIdController);

// Method: PUT
// Route: /plan/:id
// Update plan by id
planRouter.put('/:id',validateRequest(updatePlanSchema), updatePlanByIdController);

// Method: PUT
// Route: /plan/delete/:id
// Delete plan by id
planRouter.put('/delete/:id',validateRequest(planByIdSchema,"params"), deletePlanByIdController);

