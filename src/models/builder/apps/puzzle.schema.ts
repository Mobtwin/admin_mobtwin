import { Schema, Document, Model, model } from "mongoose";
import { AppsBuild,IAppsBuild } from "../apps.schema";

export interface IPuzzle {
    images: string[];
    level: "easy" | "medium" | "hard";
}

// Schema for Puzzle
const PuzzleSchema = new Schema<IPuzzle>({
    images: { type: [String], required: true },
    level: { type: String, required: true,enum: ["easy", "medium", "hard"] },        
},{ _id : false });

export interface IPuzzleApp extends IAppsBuild {
    puzzles: IPuzzle[];
}

// Schema for PuzzleApp
const PuzzleAppsSchema = new Schema<IPuzzleApp>({
    puzzles: { type: [PuzzleSchema], required: true },      
});

// Model for PuzzleApp using discriminator
export const PuzzleApps = AppsBuild.discriminator<IPuzzleApp & Document>(
    "PuzzleApps",
    PuzzleAppsSchema
);
