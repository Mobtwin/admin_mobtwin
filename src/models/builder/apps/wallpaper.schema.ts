import { Schema, model, Document } from "mongoose";
import { AppsBuild, IAppsBuild } from "../apps.schema";

// TypeScript interfaces for the schemas
export interface ICategory {
    category: string;
    icon: string;
    images: string[];
}

export interface IColorSchema {
    primary: string;
    secondary: string;
    neutral: string;
}

export interface IWallpaperApps extends IAppsBuild {
    categories?: ICategory[];
    carousel?: string[];
    colorSchema?: IColorSchema;
}

// Mongoose schemas
const CategorySchema = new Schema<ICategory>({
    category: { type: String, required: true },
    icon: { type: String, required: true },
    images: { type: [String], required: true }
}, { _id: false });

const ColorSchema = new Schema<IColorSchema>({
    primary: { type: String, default: "#2563eb" },
    secondary: { type: String, default: "#c026d3" },
    neutral: { type: String, default: "#f0f9ff" }
}, { _id: false });

const WallpaperAppsSchema = new Schema<IWallpaperApps>({
    categories: { type: [CategorySchema], default: [] },
    carousel: { type: [String], default: [] },
    colorSchema: { type: ColorSchema, default: { primary: "#2563eb", secondary: "#c026d3", neutral: "#f0f9ff" } }
});

// Discriminator model
export const WallpaperApps = AppsBuild.discriminator<IWallpaperApps & Document>("WallpaperApps", WallpaperAppsSchema);
