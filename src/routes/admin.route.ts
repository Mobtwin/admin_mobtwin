import { Router } from "express";
import { createAdminController, deleteAdminByIdController, getAdminByIdController, getAllAdminsController, updateAdminByIdController } from "../controllers/admin.controller";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import { adminByIdSchema, createAdminSchema, updateAdminSchema } from "../validators/admin.validator";


export const adminRouter = Router();
// method: POST
// path: /admin/create
// Create a new admin
adminRouter.post('/create',validateRequest(createAdminSchema), createAdminController);
// method: GET
// path: /admin
// Get all admins
adminRouter.get('/', getAllAdminsController);
// method: GET
// path: /admin/:id
// Get admin by id
adminRouter.get('/:id',validateRequest(adminByIdSchema,"params"), getAdminByIdController);
// method: PUT
// path: /admin/:id
// Update admin by id
adminRouter.put('/:id',validateRequest(updateAdminSchema), updateAdminByIdController);
// method: PUT
// path: /admin/delete/:id
// Delete admin by id
adminRouter.put('/:id',validateRequest(adminByIdSchema), deleteAdminByIdController);

