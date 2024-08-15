import { Schema, model, Document } from "mongoose";
import { AppsBuild, IAppsBuild } from "../apps.schema";

export interface IContentItems {
  index: number;
  type: "text" | "image";
  content: string;
}
// TypeScript interfaces for the schemas
export interface IArticle {
  icon: string;
  title: string;
  shortTitle: string;
  items: IContentItems[];
  order: number;
}
export interface IChapter {
  title: string | null; 
  summary: string | null; 
  cover: string | null; 
  articles:IArticle [];
}

export interface IGuideApps extends IAppsBuild {
  chapters: IChapter[];
}

// Mongoose schemas

const ContentItems = new Schema<IContentItems>(
  {
    index: { type: Number },
    type: { type: String,enum: ["text", "image"] },
    content: { type: String },
  },
  { _id: false }
);

const ArticleSchema = new Schema<IArticle>(
  {
    icon: { type: String },
    title: { type: String },
    shortTitle: { type: String },
    items: { type: [ContentItems] },
    order: { type: Number },
  },
  { _id: false }
);

const ChapterSchema = new Schema<IChapter>(
  {
    articles: { type: [ArticleSchema] },
    title: { type: String },
    summary: { type: String },
    cover: { type: String },
  },
  { _id: false }
);

const GuideAppsSchema = new Schema<IGuideApps>({
  chapters: { type: [ChapterSchema] },
});

// Discriminator model
export const GuideApps = AppsBuild.discriminator<IGuideApps & Document>(
  "GuideApps",
  GuideAppsSchema
);
