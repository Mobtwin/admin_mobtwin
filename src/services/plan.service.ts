import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import { PLAN_TABLE } from "../constant/plan.constant";
import { IPlanDocument, Plans } from "../models/plan.schema";
import fetchPaginatedData from "../utils/pagination";
import { CreatePlan, UpdatePlan } from "../validators/plan.validator";
import { getOwnItemsByPermissionAction } from "./itemSpecificPermissions.service";

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
export const getAllPlans = async ({readOwn=false,userId,limit,skip}:{readOwn:boolean,userId:string,skip:number,limit:number}) => {
  try {
    if(readOwn){
      const planIds = await getOwnItemsByPermissionAction(userId,PLAN_TABLE,PERMISSIONS_ACTIONS.READ);
      const {data,pagination} = await fetchPaginatedData<IPlanDocument>(Plans,skip,limit,{_id:{$in:planIds}});
      return {data,pagination};
    }
    //get all plans
    const {data,pagination} = await fetchPaginatedData<IPlanDocument>(Plans,skip,limit,{});
    return {data,pagination};
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