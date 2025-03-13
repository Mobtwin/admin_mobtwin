import { generateSignedUrl } from "../config/bucket.config";
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
    //generate signed url for poster
    if (newPlan.poster) {
      if (!newPlan.poster.includes("https://")) {
        const posterWithUrl = await generateSignedUrl(newPlan.poster, 240);
        return { ...newPlan, posterWithUrl };
      }
      return newPlan;
    }
    return newPlan;
  } catch (error: any) {
    throw error;
  }
};

//get all plans
export const getAllPlans = async ({
  readOwn = false,
  userId,
  limit,
  skip,
}: {
  readOwn: boolean;
  userId: string;
  skip: number;
  limit: number;
}) => {
  try {
    if (readOwn) {
      const planIds = await getOwnItemsByPermissionAction(
        userId,
        PLAN_TABLE,
        PERMISSIONS_ACTIONS.READ
      );
      const { data, pagination } = await fetchPaginatedData<IPlanDocument>(
        Plans,
        skip,
        limit,
        { _id: { $in: planIds }, removed_at: null }
      );
      const plansWithUrl = await Promise.all(
        data.map(async (plan) => {
          if (plan.poster) {
            if (!plan.poster.includes("https://")) {
              const posterWithUrl = await generateSignedUrl(plan.poster, 240);
              return {...plan, posterWithUrl };
            }
            return plan;
          }
          return plan;
        })
      );
      return { data:plansWithUrl, pagination };
    }
    //get all plans
    const { data, pagination } = await fetchPaginatedData<IPlanDocument>(
      Plans,
      skip,
      limit,
      { removed_at: null }
    );
    const plansWithUrl = await Promise.all(
      data.map(async (plan) => {
        if (plan.poster) {
          if (!plan.poster.includes("https://")) {
            const posterWithUrl = await generateSignedUrl(plan.poster, 240);
            return {...plan, posterWithUrl };
          }
          return plan;
        }
        return plan;
      })
    );
    return { data:plansWithUrl, pagination };
  } catch (error: any) {
    throw error;
  }
};

//get plan by id
export const getPlanById = async (id: string) => {
  try {
    //get plan by id
    const plan = await Plans.findById(id);
    if (!plan || plan.removed_at) throw new Error("Plan not found!");
    if (plan.poster) {
      if (!plan.poster.includes("https://")) {
        const posterWithUrl = await generateSignedUrl(plan.poster, 240);
        return { ...plan, posterWithUrl };
      }
      return plan;
    }
    return plan;
  } catch (error: any) {
    throw error;
  }
};

//update plan by id
export const updatePlanById = async (id: string, plan: UpdatePlan) => {
  try {
    //update plan by id
    const updatedPlan = await Plans.findOneAndUpdate(
      { _id: id, removed_at: null },
      plan,
      { new: true }
    ).lean();
    if (!updatedPlan) throw new Error("Plan not updated!");
    if (updatedPlan.poster) {
      if (!updatedPlan.poster.includes("https://")) {
        const posterWithUrl = await generateSignedUrl(updatedPlan.poster, 240);
        return { ...updatedPlan, posterWithUrl };
      }
      return updatedPlan;
    }
    return updatedPlan;
  } catch (error: any) {
    throw error;
  }
};

//delete plan by id
export const deletePlanById = async (id: string) => {
  try {
    //delete plan by id
    const deletedPlan = await Plans.findByIdAndUpdate(
      id,
      { removed_at: new Date() },
      { new: true }
    );
    if (!deletedPlan) throw new Error("Plan not deleted!");
    return deletedPlan;
  } catch (error: any) {
    throw error;
  }
};
