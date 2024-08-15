import { Schema, Document, Model, model } from "mongoose";
import { AppsBuild,IAppsBuild } from "../apps.schema";

export interface IDrawing {
    images: string[];
    name: string;
    icon:string;
}

export interface IDrawingApp extends IAppsBuild {
    drawings: IDrawing[];
}
//schema for drawing object
const DrawingSchema = new Schema<IDrawing>({
    images: { type: [String], required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true }
},{_id : false});
// Schema for DrawingApp
const DrawingAppsSchema = new Schema<IDrawingApp>({
    drawings: { type: [DrawingSchema], required: true }
});

// Model for DrawingApp using discriminator
export const DrawingApps = AppsBuild.discriminator<IDrawingApp & Document>(
    "DrawingApps",
    DrawingAppsSchema
);
