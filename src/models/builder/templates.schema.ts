import { Schema, model, Document, Model } from "mongoose";

// Define an interface representing a document in MongoDB.
export interface ITemplate extends Document {
    name: string;
    type: 'application' | 'game';
    created_at: Date;
    updated_at?: Date;
    removed_at?: Date | null;
}

// Define the schema corresponding to the document interface.
const templateSchema = new Schema<ITemplate>({
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ["application", "game"], required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    removed_at: { type: Date, default: null }
});

// Create an index on the name field.
templateSchema.index({ name: 1 });

// Create a Model.
export const Templates: Model<ITemplate> = model<ITemplate>('Template', templateSchema);
