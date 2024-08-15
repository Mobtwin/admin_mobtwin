import { Router } from "express";
import { createAdminController, getAdminByIdController, getAllAdminsController, updateAdminByIdController } from "../controllers/admin.controller";


export const adminRouter = Router();
// method: POST
// path: /admin/create
// Create a new admin
adminRouter.post('/create', createAdminController);
// method: GET
// path: /admin
// Get all admins
adminRouter.get('/', getAllAdminsController);
// method: GET
// path: /admin/:id
// Get admin by id
adminRouter.get('/:id', getAdminByIdController);
// method: PUT
// path: /admin/:id
// Update admin by id
adminRouter.put('/:id', updateAdminByIdController);
// method: DELETE
// path: /admin/:id
// Delete admin by id
// adminRouter.delete('/:id', deleteAdminByIdController);

