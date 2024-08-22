import { Schema, model, Document, Model } from "mongoose";

export type ThemeStatus = "pending" | "approved" | "rejected";
// Define an interface representing a document in MongoDB.
export interface ITheme {
    name: string;
    summary?: string;
    repoName: string;
    repoOwner: string;
    status: ThemeStatus;
    templateId: Schema.Types.ObjectId;

}
export interface IThemeDocument extends ITheme, Document {
    removed_at: Date|null;
}

// Define the schema corresponding to the document interface.
const themeSchema = new Schema<IThemeDocument>({
    name: { type: String, required: true, unique: true },
    summary: { type: String },
    repoName: { type: String, required: true, unique: true},
    repoOwner: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    // Use a reference to the Template model. This allows us to associate a theme with a specific template.
    templateId: { type: Schema.Types.ObjectId, required: true, ref: "Template" },
    removed_at: { type: Date, default: null }
},{ timestamps: true });

// Create an index on the name field.
themeSchema.index({ name: 1 });

// Create a Model.
export const Theme: Model<IThemeDocument> = model<IThemeDocument>('Theme', themeSchema);
