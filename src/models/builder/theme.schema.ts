import { Schema, model, Document, Model } from "mongoose";

// Define an interface representing a document in MongoDB.
export interface ITheme extends Document {
    name: string;
    summary?: string;
    codeSource: string;
    templateId: Schema.Types.ObjectId;
    created_at: Date;
    updated_at?: Date;
    removed_at?: Date | null;
}

// Define the schema corresponding to the document interface.
const themeSchema = new Schema<ITheme>({
    name: { type: String, required: true, unique: true },
    summary: { type: String },
    codeSource: { type: String, required: true },
    templateId: { type: Schema.Types.ObjectId, required: true, ref: "Template" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    removed_at: { type: Date, default: null }
});

// Create an index on the name field.
themeSchema.index({ name: 1 });

// Create a Model.
export const Theme: Model<ITheme> = model<ITheme>('Theme', themeSchema);
