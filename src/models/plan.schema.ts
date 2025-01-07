import mongooseToSwagger from "mongoose-to-swagger";
import mongoose from "mongoose";
import { Schema, model, Document, Types, Model } from "mongoose";

export enum PLAN  {
  FREE = "free",
  GOLD = "gold",
  PREMIUM = "premium",
}

export interface ISort {
  released: boolean;
  updated: boolean;
  installsExact: boolean;
  currentVersionReviewsCount: boolean;
  dailyReviewsCount: boolean;
  dailyInstalls: boolean;
}

export interface IMatch {
  published: boolean;
}
export interface IRange {
  released: boolean;
}

export interface INestedFilters {
  match: boolean;
  range: boolean;
  term: boolean;
}

export interface IFilters {
  limit: number;
  sort: ISort;
  match: IMatch;
  range:IRange;
  skip: number;
  nestedFilters: INestedFilters;
}

export interface IPockets {
  limit: number;
  maxItems: number;
}

export interface IBuilder {
  maxApps: number;
  maxAppsIos: number;
  maxAppsAndroid: number;
  allowedApps: string[];
  allowedAds: string[];
}

export interface IBoxNiches {
  limit: number;
  niches: string[];
  allowedApps: string[];
}

export interface IKeywordsAnalytics {
  limit: number;
}

export interface IAsoGenerator {
  limit: number;
}

export interface IIconGenerator {
  limit: number;
}

export interface IPagesGenerator {
  limit: number;
}

export interface IPlanUsage {
  builder: {
    count: number;
    iosCount: number;
    androidCount: number;
  };
  asoGenerator: {
    count: number;
  };
  iconGenerator: {
    count: number;
  };
}

export interface IAnalytics {
  limit:number|"unlimited";
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
  coupon?: string;
  filters: IFilters;
  pockets: IPockets;
  builder: IBuilder;
  boxNiches: IBoxNiches;
  keywordsAnalytics: IKeywordsAnalytics;
  asoGenerator: IAsoGenerator;
  iconGenerator: IIconGenerator;
  pagesGenerator: IPagesGenerator;
  planUsage: IPlanUsage;
  analytics: IAnalytics;
  isUpsell: boolean;
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

const matchSchema = new Schema<IMatch>(
  {
    published: { type: Boolean, default: false },
  },
  { _id: false }
);

const rangeSchema = new Schema<IRange>(
  {
    released: { type: Boolean, default: false },
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
    match: matchSchema,
    range: rangeSchema,
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
    maxAppsIos: { type: Number, default: 5 },
    maxAppsAndroid: { type: Number, default: 5 },
    allowedApps: { type: [String], default: ["Android"] },
    allowedAds: { type: [String], default: ["Admob"] },
  },
  { _id: false }
);

const boxNichesSchema = new Schema<IBoxNiches>(
  {
    limit: { type: Number, default: 2 },
    niches: { type: [String], default: [] },
    allowedApps: { type: [String], default: ["Android"] },
  },
  { _id: false }
);

const analyticsSchema = new Schema<IAnalytics>(
  {
    limit: {type: mongoose.Schema.Types.Mixed, // Allows for both number and string
    validate: {
      validator: function (value: any) {
        // Custom validation: Must be a number or the string "unlimited"
        return typeof value === 'number' || value === 'unlimited';
      },
      message: props => `${props.value} is not a valid token value!`,
    },
    required: true,}
  },
  { _id: false }
);

const asoGeneratorSchema = new Schema<IAsoGenerator>(
  {
    limit: { type: Number, default: 0 },
  },
  { _id: false }
);

const iconGeneratorSchema = new Schema<IIconGenerator>(
  {
    limit: { type: Number, default: 0 },
  },
  { _id: false }
);

const pagesGeneratorSchema = new Schema<IPagesGenerator>(
  {
    limit: { type: Number, default: 0 },
  },
  { _id: false }
);

const planUsageSchema = new Schema<IPlanUsage>(
  {
    builder: {
      count: { type: Number, default: 0 },
      iosCount: { type: Number, default: 0 },
      androidCount: { type: Number, default: 0 },
    },
    asoGenerator: {
      count: { type: Number, default: 0 },
    },
    iconGenerator: {
      count: { type: Number, default: 0 },
    },
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
  coupon: { type: String },
  filters: filtersSchema,
  pockets: pocketsSchema,
  builder: builderSchema,
  boxNiches: boxNichesSchema,
  asoGenerator: asoGeneratorSchema,
  iconGenerator: iconGeneratorSchema,
  pagesGenerator: pagesGeneratorSchema,
  planUsage: planUsageSchema,
  analytics:analyticsSchema,
  isUpsell: { type: Boolean, default: false },
  removed_at: { type: Date, default: null },
}, { timestamps: true });

planSchema.index({
  name: 1,
  stripeProductId: 1,
  stripeProductMonthlyPriceId: 1,
});

export const Plans:Model<IPlanDocument> = model<IPlanDocument>("Plan", planSchema);

export const PlansDefinition = mongooseToSwagger(Plans);

