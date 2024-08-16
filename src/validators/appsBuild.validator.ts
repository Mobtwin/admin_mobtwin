import { Request } from "express";
import { APP_TYPES, IAppsBuild } from "../models/builder/apps.schema";
import Joi from "joi";

//define a Joi schema for appBuils creation request 
export interface CreateAppsBuild extends IAppsBuild {}
export interface CreateAppsBuildRequest extends Request {
    body: CreateAppsBuild;
}
export const createAppsBuildSchema = Joi.object<CreateAppsBuild>({
    type: Joi.string().valid("application", "game").required(),
    themeId: Joi.string().required(),
    name: Joi.string().required(),
    packageName: Joi.string().required(),
    icon: Joi.string().required(),
    mainColor: Joi.string().required(),
    cover: Joi.string().required(),
    details: Joi.string().optional(),
    checkpoint: Joi.string().optional(),
    version: Joi.string().optional(),
    userId: Joi.string().required(),
    advertisements: Joi.array().items(Joi.object({
        provider: Joi.string().valid("Admob", "MetaAds", "IronSource", "Applovin", "YandexAds").required(),
        appId: Joi.string().optional(),
        smartBanner: Joi.string().optional(),
        nativeAds: Joi.string().optional(),
        interstitial: Joi.string().optional(),
        rewardedVideo: Joi.string().optional(),
        token: Joi.string().optional(),
    })).optional(),
    intro: Joi.array().items(Joi.object({
        index: Joi.number().required(),
        content: Joi.object({
            poster: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
        }).required(),
    })).optional(),
    storekeyConfig: Joi.object({
        keyPassword: Joi.string().required(),
        keyAlias: Joi.string().required(),
        keyAliasPassword: Joi.string().required(),
        fullName: Joi.string().required(),
        organization: Joi.string().required(),
        organizationUnit: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        countryCode: Joi.string().required(),
    }).optional(),
    filesPath: Joi.string().optional(),
});
//define a Joi schema for appBuils update request
export interface UpdateAppsBuild extends Partial<Omit<IAppsBuild,"removed_at">> {}
export interface UpdateAppsBuildRequest extends Request {
    body: UpdateAppsBuild;
    params: {
        id: string;
    }
}
export const updateAppsBuildSchema = Joi.object<UpdateAppsBuild>({
    type: Joi.string().valid("application", "game").optional(),
    themeId: Joi.string().optional(),
    name: Joi.string().optional(),
    packageName: Joi.string().optional(),
    icon: Joi.string().optional(),
    mainColor: Joi.string().optional(),
    cover: Joi.string().optional(),
    details: Joi.string().optional(),
    checkpoint: Joi.string().optional(),
    version: Joi.string().optional(),
    userId: Joi.string().optional(),
    advertisements: Joi.array().items(Joi.object({
        provider: Joi.string().valid("Admob", "MetaAds", "IronSource", "Applovin", "YandexAds").required(),
        appId: Joi.string().optional(),
        smartBanner: Joi.string().optional(),
        nativeAds: Joi.string().optional(),
        interstitial: Joi.string().optional(),
        rewardedVideo: Joi.string().optional(),
        token: Joi.string().optional(),
    })).optional(),
    intro: Joi.array().items(Joi.object({
        index: Joi.number().required(),
        content: Joi.object({
            poster: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
        }).required(),
    })).optional(),
    storekeyConfig: Joi.object({
        keyPassword: Joi.string().required(),
        keyAlias: Joi.string().required(),
        keyAliasPassword: Joi.string().required(),
        fullName: Joi.string().required(),
        organization: Joi.string().required(),
        organizationUnit: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        countryCode: Joi.string().required(),
    }).optional(),
    filesPath: Joi.string().optional(),
});
//define a Joi schema for appBuils deletion retrieval request
export interface AppBuildById {
    id: string;
}
export interface AppsBuildByIdRequest extends Request {
    params: {
        id: string;
    }
}
export const appsBuildByIdSchema = Joi.object<AppBuildById>({
    id: Joi.string().required(),
});






