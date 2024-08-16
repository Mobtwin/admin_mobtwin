import { Plans } from "../models/plan.schema";
import { CreatePlan, UpdatePlan } from "../validators/plan.validator";

//create new plan
export const createPlan = async (plan: CreatePlan) => {
  try {
    //create plan
    const newPlan = await Plans.create(plan);
    if (!newPlan) throw new Error("Plan not created!");
    return newPlan;
  } catch (error: any) {
    throw error;
  }
};

//get all plans
export const getAllPlans = async () => {
  try {
    //get all plans
    const allPlans = await Plans.find();
    return allPlans;
  } catch (error: any) {
    throw error;
  }
};

//get plan by id
export const getPlanById = async (id: string) => {
  try {
    //get plan by id
    const plan = await Plans.findById(id);
    if (!plan) throw new Error("Plan not found!");
    return plan;
  } catch (error: any) {
    throw error;
  }
};

//update plan by id
export const updatePlanById = async (id: string, plan: UpdatePlan) => {
  try {
    //update plan by id
    const updatedPlan = await Plans.findByIdAndUpdate(id, plan, { new: true });
    if (!updatedPlan) throw new Error("Plan not updated!");
    return updatedPlan;
  } catch (error: any) {
    throw error;
  }
};

//delete plan by id
export const deletePlanById = async (id: string) => {
  try {
    //delete plan by id
    const deletedPlan = await Plans.findByIdAndUpdate(id, { removed_at: new Date() }, { new: true });
    if (!deletedPlan) throw new Error("Plan not deleted!");
    return deletedPlan;
  } catch (error: any) {
    throw error;
  }
};