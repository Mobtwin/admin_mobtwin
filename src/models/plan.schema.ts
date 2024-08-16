import { randomUUID } from "crypto";
import { Schema, model, Document, Types, Model } from "mongoose";

export interface ISort {
  released: boolean;
  updated: boolean;
  installsExact: boolean;
  currentVersionReviewsCount: boolean;
  dailyReviewsCount: boolean;
}

export interface INestedFilters {
  match: boolean;
  range: boolean;
  term: boolean;
}

export interface IFilters {
  limit: number;
  sort: ISort;
  skip: number;
  nestedFilters: INestedFilters;
}

export interface IPockets {
  limit: number;
  maxItems: number;
}

export interface IBuilder {
  maxApps: number;
  allowedApps: string[];
  allowedAds: string[];
}

export interface IPlan {
  name: string;
  prefix: string;
  description?: string;
  stripeProductId: string;
  stripeProductMonthlyPriceId: string;
  lookupKey: string;
  poster?: string;
  monthlyPrice: number;
  interval: 'month' | 'year';
  intervalCount: number;
  trialDays: number;
  features?: string[];
  capability: 'basic' | 'full';
  mode: 'basic' | 'advanced';
  filters: IFilters;
  pockets: IPockets;
  builder: IBuilder;
}
export interface IPlanDocument extends IPlan, Document {
  removed_at: Date | null;
}
const sortSchema = new Schema<ISort>(
  {
    released: { type: Boolean, default: false },
    updated: { type: Boolean, default: false },
    installsExact: { type: Boolean, default: false },
    currentVersionReviewsCount: { type: Boolean, default: false },
    dailyReviewsCount: { type: Boolean, default: false },
  },
  { _id: false }
);

const nestedFiltersSchema = new Schema<INestedFilters>(
  {
    match: { type: Boolean, default: true },
    range: { type: Boolean, default: false },
    term: { type: Boolean, default: false },
  },
  { _id: false }
);

const filtersSchema = new Schema<IFilters>(
  {
    limit: { type: Number, default: 10 },
    sort: sortSchema,
    skip: { type: Number, default: 0 },
    nestedFilters: nestedFiltersSchema,
  },
  { _id: false }
);

const pocketsSchema = new Schema<IPockets>(
  {
    limit: { type: Number, default: 2 },
    maxItems: { type: Number, default: 5 },
  },
  { _id: false }
);

const builderSchema = new Schema<IBuilder>(
  {
    maxApps: { type: Number, default: 5 },
    allowedApps: { type: [String], default: ["Android"] },
    allowedAds: { type: [String], default: ["Admob"] },
  },
  { _id: false }
);

const planSchema = new Schema<IPlanDocument>({
  name: { type: String, required: true },
  prefix: { type: String, required: true },
  description: { type: String },
  stripeProductId: { type: String, required: true, unique: true },
  stripeProductMonthlyPriceId: { type: String, required: true, unique: true },
  lookupKey: { type: String, required: true, unique: true },
  poster: { type: String },
  monthlyPrice: { type: Number, required: true },
  interval: {
    type: String,
    required: true,
    enum: ["month", "year"],
    default: "month",
  },
  intervalCount: { type: Number, required: true, min: 1 },
  trialDays: { type: Number, default: 0 },
  features: { type: [String] },
  capability: {
    type: String,
    required: true,
    enum: ["basic", "full"],
    default: "basic",
  },
  mode: {
    type: String,
    required: true,
    enum: ["basic", "advanced"],
    default: "basic",
  },
  filters: filtersSchema,
  pockets: pocketsSchema,
  builder: builderSchema,
  removed_at: { type: Date, default: null },
}, { timestamps: true });

planSchema.index({
  name: 1,
  stripeProductId: 1,
  stripeProductMonthlyPriceId: 1,
});

export const Plans:Model<IPlanDocument> = model<IPlanDocument>("Plan", planSchema);
