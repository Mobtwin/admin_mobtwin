import { Schema, Document, Model, model } from "mongoose";
import { AppsBuild,IAppsBuild } from "../apps.schema";

export interface IColouringApp extends IAppsBuild {
    images: string[];
}

// Schema for ColouringApp
const ColouringAppsSchema = new Schema<IColouringApp>({
    images: { type: [String], required: true }
});

// Model for ColouringApp using discriminator
export const ColouringApps = AppsBuild.discriminator<IColouringApp & Document>(
    "ColouringApps",
    ColouringAppsSchema
);
