import { Document } from "mongoose";

export type ICollection = {
  _id: string;
  apps: string[];
};

export type IScreenShot = {
  url: string;
  type: string;
};

export type IPosition = {
  collection: string;
  category: string;
  position: number;
  country: string;
  platform: string;
};

export type ITimeLineEntry = {
  app: string;
  date: string;
  field: string;
  before: [string];
  after: [string];
  lang: string;
  country: string;
};

export type IEstimate = {
  d: number;
  r: number;
  date: string;
  month: string;
  country: string;
};

export type IActiveCountries = {
  count: number;
  list: string[];
};

export type IOSApp = {
  _id: string;
  name: string;
  summary: string;
  categories: string[];
  devName: string;
  devId: String;
  removed: string;
  published: boolean;
  version: string;
  feature: string;
  size: number;
  image: string;
  released: string;
  type: string;
};

export type ISteamGame = {
  _id: String;
  name: String;
  summary: String;
  description: String;
  about_the_game: String;
  reviews: String;
  header_image: String;
  released: String;
  published: Boolean;
  removed: String;
  website: String;
  support_url: String;
  support_email: String;
  developers: [String];
  windows: Boolean;
  mac: Boolean;
  linux: Boolean;
  metacritic_score: number;
  metacritic_url: String;
  achievements: number;
  recommendations: number;
  notes: String;
  support_languages: [String];
  full_audio_languages: [String];
  packages: [
    {
      title: String;
      description: String;
      subs: [{ text: String; description: String; price: number }];
    }
  ];
  publishers: [String];
  categories: [String];
  genres: [String];
  screenshots: [String];
  movies: [String];
  user_score: number;
  score_rank: String;
  positive: number;
  negative: number;
  estimated_owners: String;
  average_playtime_forever: number;
  average_playtime_2weeks: number;
  median_playtime_forever: number;
  median_playtime_2weeks: number;
  peak_ccu: number;
  tags: [{ key: String; count: number }];
  price: number;
  dlc_count: number;
};

export type IGApp = {
  _id: string;
  name: string;
  summary: string;
  ipd: Number;
  categories: string[];
  installs: number;
  added: string;
  installsExact: number;
  ratingsValue: string;
  ratingsCount: number;
  reviewsCount: number;
  devName: string;
  revenueForGuests: number;
  downloadsForGuests: number;
  description: string;
  downloads: number;
  store: string;
  website: string;
  revenue: number;
  removed: string;
  published: boolean;
  crawled: string;
  version: string;
  trailer: string;
  feature: string;
  ages: string;
  size: number;
  image: string;
  updated: string;
  released: string;
  type: string;
  free: string;
  grossing: string;
  paid: string;
  new_free: string;
  new_paid: string;
  movers_shakers: string;
  freeDiff: string;
  paidDiff: string;
  grossingDiff: string;
  newFreeDiff: string;
  moversShakersDiff: string;
  newPaidDiff: string;
  whatsnew: string;
  wearos: string;
  editorial: string;
  price: string;
  priceDropends: string;
  priceDrop: string;
  ads: boolean;
  inapp: boolean;
  similarOutPosition: string;
  devCountry: string;
  growth: string;
  rank: string;
  totalReverseEngrApps: number;
  totalSimilarApps: number;
  reverseEngApps: string[];
  similarApps: string[];
  screenshots: IScreenShot[];
  collections: string[];
  activeCountries: IActiveCountries;
  positions: IPosition[];
  timeLine: ITimeLineEntry[];
  estimates: IEstimate[];
};
export interface IGAppDocument extends Document {}

export interface IFilter {
  filters: {
    match: any[];
    range: any[];
    term: any;
  };
  sort: any[];
  skip: number;
  limit: number;
}
export interface IGFilterCharts {
  collection: [String];
  category: String;
  country: String;
  name: String;
  totalInstalls: FloatRange;
  releaseDate: DateRange;
  skip: number;
  limit: number;
}
export interface IASFilterCharts extends IFilter {
  collection: [String];
  category: String;
  country: String;
}

export type IIosFilter = {
  name: String;
  description: String;
  whatsNew: String;
  published: Boolean;
  type: String;
  category: [String];
  collection: [String];
  rating: FloatRange;
  releaseDate: DateRange;
  lastUpdateDate: DateRange;
  removalDate: DateRange;
  price: FloatRange;
  totalInstalls: FloatRange;
  skip: number;
  limit: number;
};

export type FloatRange = {
  from: number;
  to: number;
};

export type DateRange = {
  from: String;
  to: String;
};
