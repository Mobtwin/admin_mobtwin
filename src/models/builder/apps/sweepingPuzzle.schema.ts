import { Schema, Document, Model, model } from "mongoose";
import { AppsBuild,IAppsBuild } from "../apps.schema";

export interface ISweepingPuzzle {
    images: string[];
    level: "easy" | "medium" | "hard";
}

// Schema for sweepingPuzzle
const SweepingPuzzleSchema = new Schema<ISweepingPuzzle>({
    images: { type: [String], required: true },
    level: { type: String, required: true,enum: ["easy", "medium", "hard"] },        
},{ _id : false });

export interface ISweepingPuzzleApp extends IAppsBuild {
    sweepingPuzzles: ISweepingPuzzle[];
}

// Schema for PuzzleApp
const SweepingPuzzleAppsSchema = new Schema<ISweepingPuzzleApp>({
    sweepingPuzzles: { type: [SweepingPuzzleSchema], required: true },       
});

// Model for PuzzleApp using discriminator
export const SweepingPuzzleApps = AppsBuild.discriminator<ISweepingPuzzleApp & Document>(
    "SweepingPuzzleApps",
    SweepingPuzzleAppsSchema
);
