import { Schema, Document, Model, model } from "mongoose";
import { AppsBuild,IAppsBuild } from "../apps.schema";

export interface IScratchingApp extends IAppsBuild {
    images: string[];
}

// Schema for ScratchingApp
const ScratchingAppsSchema = new Schema<IScratchingApp>({
    images: { type: [String], required: true }
});

// Model for ScratchingApp using discriminator
export const ScratchingApps = AppsBuild.discriminator<IScratchingApp & Document>(
    "ScratchingApps",
    ScratchingAppsSchema
);
