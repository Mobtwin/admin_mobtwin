import { model, Schema, Document } from "mongoose";

// Define TypeScript interfaces for the schemas
export interface IAds {
    provider: "Admob" | "MetaAds" | "IronSource" | "Applovin" | "YandexAds";
    appId?: string;
    smartBanner?: string;
    nativeAds?: string;
    interstitial?: string;
    rewardedVideo?: string;
    token?: string;
}

export interface IStepContent {
    poster: string;
    title: string;
    description: string;
}
export interface IStep {
    index: number;
    content: IStepContent;
}

export interface IStorekeyConfig {
    keyPassword: string;
    keyAlias: string;
    keyAliasPassword: string;
    fullName: string;
    organization: string;
    organizationUnit: string;
    city: string;
    state: string;
    countryCode: string;    
}

export interface IAppsBuild extends Document {
    type: "application" | "game";
    themeId: Schema.Types.ObjectId;
    name: string;
    packageName: string;
    icon: string;
    mainColor: string;
    cover: string;
    details?: string;
    checkpoint?: string;
    version?: string;
    userId: Schema.Types.ObjectId;
    advertisements?: IAds[];
    intro?: IStep[];
    created_at?: Date;
    updated_at?: Date;
    removed_at?: Date;
    appType?: string;
    storekeyConfig?: IStorekeyConfig;
    filesPath?: string;

}

// Mongoose schemas
const AdsSchema = new Schema<IAds>({
    provider: { type: String, enum: ["Admob", "MetaAds", "IronSource", "Applovin", "YandexAds"] },
    appId: { type: String },
    smartBanner: { type: String },
    nativeAds: { type: String },
    interstitial: { type: String },
    rewardedVideo: { type: String },
    token: { type: String },
}, { _id: false });

const StepSchema = new Schema<IStep>({
    index: { type: Number, required: true },
    content: {
        poster: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
    }
}, { _id: false });

const StorekeyConfigSchema = new Schema<IStorekeyConfig>({
    keyPassword: { type: String, required: true },
    keyAlias: { type: String, required: true },
    keyAliasPassword: { type: String, required: true },
    fullName: { type: String, required: true },
    organization: { type: String, required: true },
    organizationUnit: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    countryCode: { type: String, required: true },
}, { _id: false });

const AppBuildSchema = new Schema<IAppsBuild>({
    type: { type: String, required: true, enum: ["application", "game"] },
    themeId: { type: Schema.Types.ObjectId, required: true, ref: "Theme" },
    name: { type: String, required: true, unique: true },
    packageName: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    cover: { type: String, required: true },
    details: { type: String },
    checkpoint: { type: String },
    version: { type: String, default: "1.0.0" },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    advertisements: { type: [AdsSchema] },
    intro: { type: [StepSchema] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    removed_at: { type: Date },
    appType: { type: String },
    mainColor: { type: String },
    storekeyConfig: { type: StorekeyConfigSchema },
    filesPath: { type: String },
}, { discriminatorKey: 'appType', collection: 'AppBuild' });

// Indexes
AppBuildSchema.index({ userId: 1 });
AppBuildSchema.index({ removed_at: 1 });

export const AppsBuild = model<IAppsBuild & Document>("AppBuild", AppBuildSchema);
