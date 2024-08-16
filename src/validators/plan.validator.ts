import { Request } from "express";
import Joi from "joi";
import { IPlan } from "../models/plan.schema";


//define a Joi schema for plan creation request
export const createPlanSchema = Joi.object<CreatePlan>({
    name: Joi.string().required(),
    prefix: Joi.string().required(),
    description: Joi.string().optional(),
    stripeProductId: Joi.string().required(),
    stripeProductMonthlyPriceId: Joi.string().required(),
    lookupKey: Joi.string().required(),
    poster: Joi.string().optional(),
    monthlyPrice: Joi.number().required(),
    interval: Joi.string().valid('month', 'year').required(),
    intervalCount: Joi.number().required(),
    trialDays: Joi.number().required(),
    features: Joi.array().items(Joi.string()).optional(),
    capability: Joi.string().valid('basic', 'full').required(),
    mode: Joi.string().valid('basic', 'advanced').required(),
    filters: Joi.object({
        limit: Joi.number().required(),
        sort: Joi.object({
            released: Joi.boolean().required(),
            updated: Joi.boolean().required(),
            installsExact: Joi.boolean().required(),
            currentVersionReviewsCount: Joi.boolean().required(),
            dailyReviewsCount: Joi.boolean().required(),
        }).required(),
        skip: Joi.number().required(),
        nestedFilters: Joi.object({
            match: Joi.boolean().required(),
            range: Joi.boolean().required(),
            term: Joi.boolean().required(),
        }).required(),
    }).required(),
    pockets: Joi.object({
        limit: Joi.number().required(),
        maxItems: Joi.number().required(),
    }).required(),
    builder: Joi.object({
        maxApps: Joi.number().required(),
        allowedApps: Joi.array().items(Joi.string()).required(),
        allowedAds: Joi.array().items(Joi.string()).required(),
    }).required(),
});
export interface CreatePlan extends IPlan {}
export interface CreatePlanRequest extends Request {
    body: CreatePlan; 
}

//define a Joi schema for plan update request
export const updatePlanSchema = Joi.object<UpdatePlan>({
    name: Joi.string().optional(),
    prefix: Joi.string().optional(),
    description: Joi.string().optional(),
    stripeProductId: Joi.string().optional(),
    stripeProductMonthlyPriceId: Joi.string().optional(),
    lookupKey: Joi.string().optional(),
    poster: Joi.string().optional(),
    monthlyPrice: Joi.number().optional(),
    interval: Joi.string().valid('month', 'year').optional(),
    intervalCount: Joi.number().optional(),
    trialDays: Joi.number().optional(),
    features: Joi.array().items(Joi.string()).optional(),
    capability: Joi.string().valid('basic', 'full').optional(),
    mode: Joi.string().valid('basic', 'advanced').optional(),
    filters: Joi.object({
        limit: Joi.number().optional(),
        sort: Joi.object({
            released: Joi.boolean().optional(),
            updated: Joi.boolean().optional(),
            installsExact: Joi.boolean().optional(),
            currentVersionReviewsCount: Joi.boolean().optional(),
            dailyReviewsCount: Joi.boolean().optional(),
        }).optional(),
        skip: Joi.number().optional(),
        nestedFilters: Joi.object({
            match: Joi.boolean().optional(),
            range: Joi.boolean().optional(),
            term: Joi.boolean().optional(),
        }).optional(),
    }).optional(),
    pockets: Joi.object({
        limit: Joi.number().optional(),
        maxItems: Joi.number().optional(),
    }).optional(),
    builder: Joi.object({
        maxApps: Joi.number().optional(),
        allowedApps: Joi.array().items(Joi.string()).optional(),
        allowedAds: Joi.array().items(Joi.string()).optional(),
    }).optional(),
});
export interface UpdatePlan extends Partial<Omit<IPlan,"removed_at">> {}
export interface UpdatePlanRequest extends Request {
    body: UpdatePlan;
    params: {   id: string; }
}

//define a Joi schema for plan id retrieve and delete request
export const planByIdSchema = Joi.object<PlanById>({
    id: Joi.string().required(),
});
export interface PlanByIdRequest extends Request {
    params: { id: string; }
}
export interface PlanById {
    id: string;
}


