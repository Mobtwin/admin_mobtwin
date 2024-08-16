import { Schema, model, Document, Model } from "mongoose";

// Define an interface representing a document in MongoDB.
export interface ITheme {
    name: string;
    summary?: string;
    codeSource: string;
    templateId: Schema.Types.ObjectId;

}
export interface IThemeDocument extends ITheme, Document {
    removed_at: Date|null;
}

// Define the schema corresponding to the document interface.
const themeSchema = new Schema<IThemeDocument>({
    name: { type: String, required: true, unique: true },
    summary: { type: String },
    codeSource: { type: String, required: true },
    templateId: { type: Schema.Types.ObjectId, required: true, ref: "Template" },
    removed_at: { type: Date, default: null }
},{ timestamps: true });

// Create an index on the name field.
themeSchema.index({ name: 1 });

// Create a Model.
export const Theme: Model<IThemeDocument> = model<IThemeDocument>('Theme', themeSchema);
