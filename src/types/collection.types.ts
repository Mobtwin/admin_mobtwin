// src/types/collectionInterfaces.ts

export interface TimeLineEntry {
  date: Date;
  field: string;
  before: string[]; // Array of strings
  after: string[]; // Array of strings
  lang: string;
  country: string;
}

export interface GAppPreview {
  _id: string;
  rank: number;
  previousRank: number;
  name: string;
  icon: string;
  installs: number;
  installsExact: number;
  dailyInstalls: number;
  released: Date;
  timeLine: TimeLineEntry[]; // Array of timeLine entries
}

export interface CollectionQuery {
  installsExact?: {
    $gte?: number;
    $lte?: number;
  };
  type?: string;
  published?: boolean;
  dailyInstalls?: {
    $gte?: number;
  };
  "timeLine.field"?: string; // Dot notation for nested field
  currentVersionReviewsCount?: {
    $gte?: number;
    $lte?: number;
  };
}

export interface CollectionSort {
  released?: number; // Sorting by released date (assumed to be a number timestamp)
}

export interface Collection {
  poster?: string;
  name: string;
  plan: string[];
  description?: string;
  filter: string; // Assuming 'filter' is a string, possibly a JSON path or filter type
  filterValues?: {
    limit: number;
    query?: CollectionQuery;
    sort?: CollectionSort;
  };
  keywords?: string[];
  logs?: string[];
  apps?: GAppPreview[];
}
