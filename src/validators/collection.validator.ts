import { Request } from "express";
import Joi from "joi";
import { Collection } from "../types/collection.types";
// define joi schema for create collection request
export interface CreateCollection extends Collection {}
export interface CreateCollectionRequest extends Request {
    body: CreateCollection;
    query: {
        platform: 'gp'|"as";
    };
}
export const createCollectionSchema = Joi.object<CreateCollection>({
    name: Joi.string().required(),
    poster:Joi.string().required(),
    description: Joi.string().optional(),
    filter: Joi.string().required(),
    filterValues: Joi.object({
        limit: Joi.number().required(),
        query: Joi.object({
            installsExact: Joi.object({
                gte: Joi.number().optional(),
                lte: Joi.number().optional(),
            }).optional(),
            type: Joi.string().optional(),
            published: Joi.boolean().optional(),
            dailyInstalls: Joi.object({
                gte: Joi.number().optional(),
            }).optional(),
            timeLine: Joi.object({
                field: Joi.string().optional(),
            }).optional(),
            currentVersionReviewsCount: Joi.object({
                gte: Joi.number().optional(),
                lte: Joi.number().optional(),
            }).optional(),
        }).optional(),
        sort: Joi.object({
            released: Joi.number().optional(),
        }).optional(),
    }).required(),
    plan: Joi.array().items(Joi.string()).required(),
    keywords: Joi.array().items(Joi.string()).optional(),
    logs: Joi.array().items(Joi.string()).optional(),
    apps: Joi.array().items(Joi.object()).optional(),
});
// define joi schema for update collection request by id
export interface UpdateCollectionById extends Partial<CreateCollection> {}
export interface UpdateCollectionByIdRequest extends Request {
    body: UpdateCollectionById;
    params: {
        id: string;
    };
    query: {
        platform: 'gp'|"as";
    };
}
export const updateCollectionByIdSchema = Joi.object<UpdateCollectionById>({
    name: Joi.string().optional(),
    poster: Joi.string().optional(),
    description: Joi.string().optional(),
    filter: Joi.string().optional(),
    filterValues: Joi.object({
        limit: Joi.number().required(),
        query: Joi.object({
            installsExact: Joi.object({
                gte: Joi.number().optional(),
                lte: Joi.number().optional(),
            }).optional(),
            type: Joi.string().optional(),
            published: Joi.boolean().optional(),
            dailyInstalls: Joi.object({
                gte: Joi.number().optional(),
            }).optional(),
            timeLine: Joi.object({
                field: Joi.string().optional(),
            }).optional(),
            currentVersionReviewsCount: Joi.object({
                gte: Joi.number().optional(),
                lte: Joi.number().optional(),
            }).optional(),
        }).optional(),
        sort: Joi.object({
            released: Joi.number().optional(),
        }).optional(),
    }).optional(),
    plan: Joi.array().items(Joi.string()).optional(),
    keywords: Joi.array().items(Joi.string()).optional(),
    logs: Joi.array().items(Joi.string()).optional(),
    apps: Joi.array().items(Joi.object()).optional(),
});

// define joi schema for delete collection request by id

export interface DeleteCollectionByIdRequest extends Request {
    params: {
        id: string;
    };
    query: {
        platform: 'gp'|"as";
    };
}

export const deleteCollectionByIdSchema = Joi.object({
    id: Joi.string().required(),
});
