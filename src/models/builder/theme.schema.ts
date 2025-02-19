import { Schema, model, Document, Model } from "mongoose";
import { ITemplateDocument } from "./templates.schema";
import mongooseToSwagger from 'mongoose-to-swagger';

export const THEME_APPROVED = "approved";
export const THEME_PENDING = "pending";
export const THEME_REJECTED = "rejected";

export type ThemeStatus = "pending" | "approved" | "rejected";
// Define an interface representing a document in MongoDB.
export interface ITheme {
    name: string;
    summary?: string;
    repoName: string;
    repoOwner: string;
    status: ThemeStatus;
    posters: string[];
    featured: boolean;
    templateId: Schema.Types.ObjectId;

}
export interface IThemePopulated extends ITheme {
    template: ITemplateDocument;
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
    posters: {type: [String],required:true},
    featured: {type: Boolean, default: false},
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    // Use a reference to the Template model. This allows us to associate a theme with a specific template.
    templateId: { type: Schema.Types.ObjectId, required: true, },
    removed_at: { type: Date, default: null }
},{ timestamps: true,});

// Create an index on the name field.
themeSchema.index({ name: 1 });
themeSchema.virtual('template',{
    ref: 'Template',
    localField: 'templateId',
    foreignField: '_id',
    justOne: true
});

// tell Mongoose to retreive the virtual fields
themeSchema.set('toObject', { virtuals: true });
themeSchema.set('toJSON', { virtuals: true });
// Create a Model.
export const Theme: Model<IThemeDocument> = model<IThemeDocument>('Theme', themeSchema);
export const ThemeDefinition = mongooseToSwagger(Theme);
