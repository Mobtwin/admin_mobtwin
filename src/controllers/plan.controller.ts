import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { CreatePlanRequest, PlanByIdRequest, UpdatePlanRequest } from "../validators/plan.validator";
import { ROLES } from "../models/admin.schema";
import {
  createPlan,
  deletePlanById,
  getAllPlans,
  getPlanById,
  updatePlanById,
} from "../services/plan.service";
import { logEvents } from "../middlewares/logger";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";

//create new plan
export const createPlanController = async (
  req: CreatePlanRequest,
  res: Response
) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    
    //create plan
    createPlan(req.body)
      .then((value) => {
        logEvents(
          `Plan: ${value.name} created by ${user.role}: ${user.userName}`,
          "actions.log"
        );
        return sendSuccessResponse(
          res,
          value,
          "Plan created successfully!",
          201
        );
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

//get all plans
export const getAllPlansController = async (req: Request, res: Response) => {
  try {
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    const readOwn = user.permissions.includes(PERMISSIONS_ACTIONS.READ_OWN);
    //get all plans
    getAllPlans({ readOwn, userId: user.id })
      .then((value) => {
        return sendSuccessResponse(
          res,
          value,
          "All plans fetched successfully!",
          200
        );
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

//get plan by id
export const getPlanByIdController = async (req: PlanByIdRequest, res: Response) => {
  try {
    //authorization
    const { id } = req.params;
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    
    if (!id) return sendErrorResponse(res, null, "Plan id is required!", 400);
    //get plan by id
    getPlanById(req.params.id)
      .then((value) => {
        return sendSuccessResponse(
          res,
          value,
          "Plan fetched successfully!",
          200
        );
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

//update plan by id
export const updatePlanByIdController = async (req: UpdatePlanRequest, res: Response) => {
  try {
    const { id } = req.params;
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    
    if (!id) return sendErrorResponse(res, null, "Plan id is required!", 400);
    updatePlanById(req.params.id, req.body)
      .then((value) => {
        logEvents(
          `Plan: ${value.name} updated by ${user.role}: ${user.userName}`,
          "actions.log"
        );
        return sendSuccessResponse(
          res,
          value,
          "Plan updated successfully!",
          200
        );
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};

//delete plan by id
export const deletePlanByIdController = async (req: PlanByIdRequest, res: Response) => {
  try {
    const { id } = req.params;
    //authorization
    if (!req.user) return sendErrorResponse(res, null, "Unauthorized!", 401);
    const user = req.user;
    
    if (!id) return sendErrorResponse(res, null, "Plan id is required!", 400);
    //delete plan by id
    deletePlanById(req.params.id)
      .then((value) => {
        logEvents(
          `Plan: ${value.name} deleted by ${user.role}: ${user.userName}`,
          "actions.log"
        );
        return sendSuccessResponse(
          res,
          value,
          "Plan deleted successfully!",
          200
        );
      })
      .catch((error) => {
        return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
      });
  } catch (error: any) {
    return sendErrorResponse(res, error, `Error: ${error.message}`, 500);
  }
};



