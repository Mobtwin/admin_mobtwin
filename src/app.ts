import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";

import { environment } from "./utils/loadEnvironment";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { logEvents, logger } from "./middlewares/logger";
import routes from "./routes";
import { authMiddleWare } from "./middlewares/auth.middleware";
import { authRouter } from "./routes/auth.route";
import {
  getAppsImageController,
  getAvatarController,
} from "./controllers/public.conroller";
// import { seedRolesAndPermissions } from "./scripts/role.seeder";
//bullMQ
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { updateLogsAndActionsQueue } from "./config/queue.config";
import { transformResponseJson } from "./middlewares/response.middleware";
import { afterResponse } from "./middlewares/afterResponse.middleware";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors.config";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { UserDefinition } from "./models/user.schema";
import { PlansDefinition } from "./models/plan.schema";
import { ThemeDefinition } from "./models/builder/theme.schema";
import { TemplateDefinition } from "./models/builder/templates.schema";

import { checkRedisConnection } from "./utils/redis";
import { transporter } from "./config/mailer.config";

// initial the express server
const app: Express = express();
// ✅ Trust proxy headers (important if running behind a proxy like Nginx, Cloudflare, or Vercel)
app.set("trust proxy", 1);
app.get("/", (_req, res) => {
  res.send("welcome to the api");
});

// bullMQ adapter
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullMQAdapter(updateLogsAndActionsQueue)],
  serverAdapter: serverAdapter,
});
serverAdapter.setBasePath("/admin");

app.use("/admin", serverAdapter.getRouter());

// middleware to handle CORS
app.use(cors(corsOptions));
app.use(cookieParser());
// middleware to handle request logs
app.use(logger);

// dns validation(
app.get(
  "/.well-known/pki-validation/2280DCF2B0F5D3414E5AC7C43BFEF750.txt",
  (_req, res) => {
    res.send(`765D94EE0D817B78B6A861E5D0CCEA0C73B57C1DE05AD2405655675C102BFF02
  comodoca.com
  8320f152a168360`);
  }
);
// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Node.js Express API with Swagger",
    version: "1.0.0",
    description: "This is a simple API with Swagger integration",
  },
  servers: [
    {
      url: `${environment.HOST}/api/v1`,
    },
  ],
  components: {
    schemas: {
      CreateUser: {
        type: "object",
        required: ["userName", "password", "email"],
        properties: {
          userName: {
            type: "string",
          },
          password: {
            type: "string",
          },
          email: {
            type: "string",
          },
        },
        example: {
          userName: "admin",
          password: "admin123",
          email: "admin@example.com",
        },
      },
      User: UserDefinition,
      CreateTemplate: {
        type: "object",
        required: ["name", "type"],
        properties: {
          name: {
            type: "string",
          },
          type: {
            type: "string",
          }, // application or game
        },
        example: {
          name: "quizeers",
          type: "application",
        },
      },
      UpdateTemplate: {
        type: "object",
        required: [],
        properties: {
          name: {
            type: "string",
          },
          type: {
            type: "string",
          }, // application or game
        },
        example: {
          name: "quizeers",
          type: "application",
        },
      },
      Template: TemplateDefinition,
      Theme: ThemeDefinition,
      CreateTheme: {
        type: "object",
        required: ["name", "repoName", "repoOwner", "templateId"],
        properties: {
          name: {
            type: "string",
          },
          summary: {
            type: "string",
          }, // optional
          repoName: {
            type: "string",
          },
          repoOwner: {
            type: "string",
          },
          templateId: {
            type: "string",
          },
          featured: {
            type: "boolean",
            default: false,
          },
          posters: {
            type: "array",
            items: {
              type: "string",
            },
          }
        },
        example: {
          name: "Dark Theme",
          summary: "A dark theme for the application",
          repoName: "theme-dark",
          repoOwner: "developer123",
          templateId: "template-001",
          featured: true,
          posters: ["poster1.jpg", "poster2.jpg"],
        },
      },
      UpdateTheme: {
        type: "object",
        required: [],
        properties: {
          name: {
            type: "string",
          },
          summary: {
            type: "string",
          }, // optional
          repoName: {
            type: "string",
          },
          repoOwner: {
            type: "string",
          },
          templateId: {
            type: "string",
          },
          featured: {
            type: "boolean",
            default: false,
          },
          posters: {
            type: "array",
            items: {
              type: "string",
            },
          }
        },
        example: {
          name: "Dark Theme",
          summary: "A dark theme for the application",
          repoName: "theme-dark",
          repoOwner: "developer123",
          templateId: "template-001",
          featured: true,
          posters: ["poster1.jpg", "poster2.jpg"],
        },
      },
      Plan: PlansDefinition,
      CreatePlan: {
        type: "object",
        required: [
          "name",
          "prefix",
          "stripeProductId",
          "stripeProductMonthlyPriceId",
          "lookupKey",
          "monthlyPrice",
          "interval",
          "intervalCount",
          "trialDays",
          "capability",
          "mode",
          "filters",
          "pockets",
          "builder",
        ],
        properties: {
          name: {
            type: "string",
          },
          prefix: {
            type: "string",
          },
          description: {
            type: "string",
            nullable: true,
          },
          stripeProductId: {
            type: "string",
          },
          stripeProductMonthlyPriceId: {
            type: "string",
          },
          lookupKey: {
            type: "string",
          },
          poster: {
            type: "string",
            nullable: true,
          },
          monthlyPrice: {
            type: "number",
            format: "float",
          },
          interval: {
            type: "string",
            enum: ["month", "year"],
          },
          intervalCount: {
            type: "integer",
          },
          trialDays: {
            type: "integer",
          },
          features: {
            type: "array",
            items: {
              type: "string",
            },
            nullable: true,
          },
          capability: {
            type: "string",
            enum: ["basic", "full"],
          },
          mode: {
            type: "string",
            enum: ["basic", "advanced"],
          },
          filters: {
            type: "object",
            required: ["limit", "sort", "skip", "nestedFilters"],
            properties: {
              limit: {
                type: "integer",
              },
              preOrder: {
                type: "boolean",
              },
              sort: {
                type: "object",
                required: [
                  "released",
                  "updated",
                  "installsExact",
                  "currentVersionReviewsCount",
                  "dailyReviewsCount",
                ],
                properties: {
                  released: {
                    type: "boolean",
                  },
                  updated: {
                    type: "boolean",
                  },
                  installsExact: {
                    type: "boolean",
                  },
                  currentVersionReviewsCount: {
                    type: "boolean",
                  },
                  dailyReviewsCount: {
                    type: "boolean",
                  },
                },
              },
              skip: {
                type: "integer",
              },
              nestedFilters: {
                type: "object",
                required: ["match", "range", "term"],
                properties: {
                  match: {
                    type: "boolean",
                  },
                  range: {
                    type: "boolean",
                  },
                  term: {
                    type: "boolean",
                  },
                },
              },
            },
          },
          pockets: {
            type: "object",
            required: ["limit", "maxItems"],
            properties: {
              limit: {
                type: "integer",
              },
              maxItems: {
                type: "integer",
              },
            },
          },
          builder: {
            type: "object",
            required: ["maxApps", "allowedApps", "allowedAds"],
            properties: {
              maxApps: {
                type: "integer",
              },
              allowedApps: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              allowedAds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
          },
          isUpsell: {
            type: "boolean",
          },
          coupon: {
            type: "string",
            nullable: true,
          },
          analytics: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
              },
            },
          },
          iconGenerator: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
              },
            },
          },
          asoGenerator: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
              },
            },
          },
          keywordsAnalytics: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
              },
            },
          },
          pagesGenerator: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
              },
            },
          },
          planUsage: {
            type: "object",
            required: ["builder", "asoGenerator", "analytics", "iconGenerator"],
            properties: {
              builder: {
                type: "object",
                required: ["count", "androidCount", "iosCount"],
                properties: {
                  count: {
                    type: "integer",
                  },
                  androidCount: {
                    type: "integer",
                  },
                  iosCount: {
                    type: "integer",
                  },
                },
              },
              asoGenerator: {
                type: "object",
                required: ["count"],
                properties: {
                  count: {
                    type: "integer",
                  },
                },
              },
              analytics: {
                type: "object",
                required: ["count"],
                properties: {
                  count: {
                    type: "integer",
                  },
                },
              },
              iconGenerator: {
                type: "object",
                required: ["count"],
                properties: {
                  count: {
                    type: "integer",
                  },
                },
              },
            },
          },
        },
        example: {
          name: "Premium Plan",
          prefix: "premium",
          description: "A premium subscription plan",
          stripeProductId: "prod_12345",
          stripeProductMonthlyPriceId: "price_67890",
          lookupKey: "premium_plan_123",
          poster: "https://example.com/poster.jpg",
          monthlyPrice: 29.99,
          interval: "month",
          intervalCount: 1,
          trialDays: 14,
          features: ["Feature 1", "Feature 2"],
          capability: "full",
          mode: "advanced",
          filters: {
            limit: 10,
            sort: {
              released: true,
              updated: true,
              installsExact: false,
              currentVersionReviewsCount: true,
              dailyReviewsCount: false,
            },
            skip: 5,
            nestedFilters: {
              match: true,
              range: true,
              term: false,
            },
          },
          pockets: {
            limit: 20,
            maxItems: 50,
          },
          builder: {
            maxApps: 10,
            allowedApps: ["App 1", "App 2"],
            allowedAds: ["Ad 1", "Ad 2"],
          },
          isUpsell: true,
          coupon: "coupon123",
          analytics: {
            limit: 1000,
          },
          iconGenerator: {
            limit: 100,
          },
          asoGenerator: {
            limit: 100,
          },
          keywordsAnalytics: {
            limit: 100,
          },
          pagesGenerator: {
            limit: 100,
          },
          planUsage: {
            builder: {
              count: 100,
              androidCount: 50,
              iosCount: 50,
            },
            asoGenerator: {
              count: 100,
            },
            analytics: {
              count: 100,
            },
            iconGenerator: {
              count: 100,
            },
          },
        },
      },
      UpdatePlan: {
        type: "object",
        required: [],
        properties: {
          name: {
            type: "string",
          },
          prefix: {
            type: "string",
          },
          description: {
            type: "string",
            nullable: true,
          },
          stripeProductId: {
            type: "string",
          },
          stripeProductMonthlyPriceId: {
            type: "string",
          },
          lookupKey: {
            type: "string",
          },
          poster: {
            type: "string",
            nullable: true,
          },
          monthlyPrice: {
            type: "number",
            format: "float",
          },
          interval: {
            type: "string",
            enum: ["month", "year"],
          },
          intervalCount: {
            type: "integer",
          },
          trialDays: {
            type: "integer",
          },
          features: {
            type: "array",
            items: {
              type: "string",
            },
            nullable: true,
          },
          capability: {
            type: "string",
            enum: ["basic", "full"],
          },
          mode: {
            type: "string",
            enum: ["basic", "advanced"],
          },
          filters: {
            type: "object",
            required: ["limit", "sort", "skip", "nestedFilters"],
            properties: {
              limit: {
                type: "integer",
              },
              preOrder: {
                type: "boolean",
              },
              sort: {
                type: "object",
                required: [
                  "released",
                  "updated",
                  "installsExact",
                  "currentVersionReviewsCount",
                  "dailyReviewsCount",
                ],
                properties: {
                  released: {
                    type: "boolean",
                  },
                  updated: {
                    type: "boolean",
                  },
                  installsExact: {
                    type: "boolean",
                  },
                  currentVersionReviewsCount: {
                    type: "boolean",
                  },
                  dailyReviewsCount: {
                    type: "boolean",
                  },
                },
              },
              skip: {
                type: "integer",
              },
              nestedFilters: {
                type: "object",
                required: ["match", "range", "term"],
                properties: {
                  match: {
                    type: "boolean",
                  },
                  range: {
                    type: "boolean",
                  },
                  term: {
                    type: "boolean",
                  },
                },
              },
            },
          },
          pockets: {
            type: "object",
            required: ["limit", "maxItems"],
            properties: {
              limit: {
                type: "integer",
              },
              maxItems: {
                type: "integer",
              },
            },
          },
          builder: {
            type: "object",
            required: ["maxApps", "allowedApps", "allowedAds"],
            properties: {
              maxApps: {
                type: "integer",
              },
              allowedApps: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              allowedAds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
          },
          isUpsell: {
            type: "boolean",
          },
          coupon: {
            type: "string",
            nullable: true,
          },
          analytics: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
              },
            },
          },
          iconGenerator: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
              },
            },
          },
          asoGenerator: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
              },
            },
          },
          keywordsAnalytics: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
              },
            },
          },
          pagesGenerator: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
              },
            },
          },
          planUsage: {
            type: "object",
            required: ["builder", "asoGenerator", "analytics", "iconGenerator"],
            properties: {
              builder: {
                type: "object",
                required: ["count", "androidCount", "iosCount"],
                properties: {
                  count: {
                    type: "integer",
                  },
                  androidCount: {
                    type: "integer",
                  },
                  iosCount: {
                    type: "integer",
                  },
                },
              },
              asoGenerator: {
                type: "object",
                required: ["count"],
                properties: {
                  count: {
                    type: "integer",
                  },
                },
              },
              analytics: {
                type: "object",
                required: ["count"],
                properties: {
                  count: {
                    type: "integer",
                  },
                },
              },
              iconGenerator: {
                type: "object",
                required: ["count"],
                properties: {
                  count: {
                    type: "integer",
                  },
                },
              },
            },
          },
        },
        example: {
          name: "Premium Plan",
          prefix: "premium",
          description: "A premium subscription plan",
          stripeProductId: "prod_12345",
          stripeProductMonthlyPriceId: "price_67890",
          lookupKey: "premium_plan_123",
          poster: "https://example.com/poster.jpg",
          monthlyPrice: 29.99,
          interval: "month",
          intervalCount: 1,
          trialDays: 14,
          features: ["Feature 1", "Feature 2"],
          capability: "full",
          mode: "advanced",
          filters: {
            limit: 10,
            sort: {
              released: true,
              updated: true,
              installsExact: false,
              currentVersionReviewsCount: true,
              dailyReviewsCount: false,
            },
            skip: 5,
            nestedFilters: {
              match: true,
              range: true,
              term: false,
            },
          },
          pockets: {
            limit: 20,
            maxItems: 50,
          },
          builder: {
            maxApps: 10,
            allowedApps: ["App 1", "App 2"],
            allowedAds: ["Ad 1", "Ad 2"],
          },
          isUpsell: false,
          coupon: null,
          analytics: {
            limit: 1000,
          },
          iconGenerator: {
            limit: 100,
          },
          asoGenerator: {
            limit: 100,
          },
          keywordsAnalytics: {
            limit: 100,
          },
          pagesGenerator: {
            limit: 100,
          },
          planUsage: {
            builder: {
              count: 1000,
              androidCount: 500,
              iosCount: 500,
            },
            asoGenerator: {
              count: 100,
            },
            analytics: {
              count: 1000,
            },
            iconGenerator: {
              count: 100,
            },
          },
        },
      },
      CreateAdmin: {
        type: "object",
        required: ["userName", "password", "email", "role"],
        properties: {
          userName: {
            type: "string",
          },
          password: {
            type: "string",
          },
          email: {
            type: "string",
          },
          role: {
            type: "string",
          },
        },
        example: {
          userName: "admin",
          password: "admin123",
          email: "admin@example.com",
          role: "66cee7ddfa76ee3b7353e962",
        },
      },
      Admin: {
        type: "object",
        properties: {
          userName: {
            type: "string",
          },
          email: {
            type: "string",
          },
          role: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              _id: {
                type: "string",
              },
              permissions: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              createdAt: {
                type: "string",
              },
              updatedAt: {
                type: "string",
              },
            },
          },
          _id: {
            type: "string",
          },
          devices: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Device",
            },
          },
          createdAt: {
            type: "string",
          },
          updatedAt: {
            type: "string",
          },
        },
      },
      Device: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          ipAddress: {
            type: "string",
          },
          userAgent: {
            type: "string",
          },
          accessToken: {
            type: "string",
          },
          refreshToken: {
            type: "string",
          },
          createdAt: {
            type: "string",
          },
          updatedAt: {
            type: "string",
          },
        },
      },
      Role: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          permissions: {
            type: "array",
            items: {
              type: "string",
            },
          },
          createdAt: {
            type: "string",
          },
          updatedAt: {
            type: "string",
          },
        },
      },
      TimeLineEntry: {
        type: "object",
        required: ["date", "field", "before", "after", "lang", "country"],
        properties: {
          date: {
            type: "string",
            format: "date-time",
          },
          field: {
            type: "string",
          },
          before: {
            type: "array",
            items: {
              type: "string",
            },
          },
          after: {
            type: "array",
            items: {
              type: "string",
            },
          },
          lang: {
            type: "string",
          },
          country: {
            type: "string",
          },
        },
        example: {
          date: "2023-12-25T14:00:00Z",
          field: "rating",
          before: ["3 stars"],
          after: ["4 stars"],
          lang: "en",
          country: "US",
        },
      },

      GAppPreview: {
        type: "object",
        required: [
          "_id",
          "rank",
          "previousRank",
          "name",
          "icon",
          "installs",
          "installsExact",
          "dailyInstalls",
          "released",
          "timeLine",
        ],
        properties: {
          _id: {
            type: "string",
          },
          rank: {
            type: "integer",
          },
          previousRank: {
            type: "integer",
          },
          name: {
            type: "string",
          },
          icon: {
            type: "string",
          },
          installs: {
            type: "integer",
          },
          installsExact: {
            type: "integer",
          },
          dailyInstalls: {
            type: "integer",
          },
          released: {
            type: "string",
            format: "date-time",
          },
          timeLine: {
            type: "array",
            items: {
              $ref: "#/components/schemas/TimeLineEntry",
            },
          },
        },
        example: {
          _id: "app12345",
          rank: 1,
          previousRank: 2,
          name: "My Awesome App",
          icon: "https://example.com/icon.png",
          installs: 1000000,
          installsExact: 1050000,
          dailyInstalls: 5000,
          released: "2022-01-01T12:00:00Z",
          timeLine: [
            {
              date: "2023-12-25T14:00:00Z",
              field: "rating",
              before: ["3 stars"],
              after: ["4 stars"],
              lang: "en",
              country: "US",
            },
          ],
        },
      },

      CollectionQuery: {
        type: "object",
        properties: {
          installsExact: {
            type: "object",
            properties: {
              $gte: {
                type: "integer",
              },
              $lte: {
                type: "integer",
              },
            },
          },
          type: {
            type: "string",
          },
          published: {
            type: "boolean",
          },
          dailyInstalls: {
            type: "object",
            properties: {
              $gte: {
                type: "integer",
              },
            },
          },
          timeLine: {
            type: "object",
            properties: {
              field: {
                type: "string",
              },
            },
          },
          currentVersionReviewsCount: {
            type: "object",
            properties: {
              $gte: {
                type: "integer",
              },
              $lte: {
                type: "integer",
              },
            },
          },
        },
        example: {
          installsExact: {
            $gte: 50000,
          },
          type: "game",
          published: true,
          dailyInstalls: {
            $gte: 100,
          },
          timeLine: {
            field: "rating",
          },
          currentVersionReviewsCount: {
            $gte: 1000,
          },
        },
      },

      CollectionSort: {
        type: "object",
        properties: {
          released: {
            type: "integer",
            description: "Sort by release date (timestamp)",
          },
        },
        example: {
          released: -1, // -1 for descending, 1 for ascending
        },
      },

      Collection: {
        type: "object",
        required: ["name", "plan", "filter", "filterValues"],
        properties: {
          poster: {
            type: "string",
          },
          name: {
            type: "string",
          },
          plan: {
            type: "array",
            items: {
              type: "string",
            },
          },
          description: {
            type: "string",
          },
          filter: {
            type: "string",
          },
          filterValues: {
            type: "object",
            properties: {
              limit: {
                type: "integer",
              },
              query: {
                $ref: "#/components/schemas/CollectionQuery",
              },
              sort: {
                $ref: "#/components/schemas/CollectionSort",
              },
            },
          },
          keywords: {
            type: "array",
            items: {
              type: "string",
            },
          },
          logs: {
            type: "array",
            items: {
              type: "string",
            },
          },
          apps: {
            type: "array",
            items: {
              $ref: "#/components/schemas/GAppPreview",
            },
          },
        },
        example: {
          name: "Top Games",
          plan: ["free", "premium"],
          description: "A collection of the best games.",
          filter: "gameType",
          filterValues: {
            limit: 10,
            query: {
              type: "game",
            },
            sort: {
              released: -1,
            },
          },
          keywords: ["game", "top"],
          logs: ["Collection created"],
          apps: [
            {
              _id: "app12345",
              rank: 1,
              previousRank: 2,
              name: "My Awesome App",
              icon: "https://example.com/icon.png",
              installs: 1000000,
              installsExact: 1050000,
              dailyInstalls: 5000,
              released: "2022-01-01T12:00:00Z",
              timeLine: [
                {
                  date: "2023-12-25T14:00:00Z",
                  field: "rating",
                  before: ["3 stars"],
                  after: ["4 stars"],
                  lang: "en",
                  country: "US",
                },
              ],
            },
          ],
        },
      },
      CreateCollection: {
        type: "object",
        required: ["name", "poster", "filter", "filterValues", "plan"],
        properties: {
          name: {
            type: "string",
            description: "The name of the collection.",
          },
          poster: {
            type: "string",
            description: "URL of the collection poster.",
          },
          description: {
            type: "string",
            description: "Optional description of the collection.",
          },
          filter: {
            type: "string",
            description: "Filter criteria for the collection.",
          },
          filterValues: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "number",
                description: "The limit for the collection.",
              },
              query: {
                type: "object",
                properties: {
                  installsExact: {
                    type: "object",
                    properties: {
                      gte: { type: "number" },
                      lte: { type: "number" },
                    },
                  },
                  type: { type: "string" },
                  published: { type: "boolean" },
                  dailyInstalls: {
                    type: "object",
                    properties: {
                      gte: { type: "number" },
                    },
                  },
                  timeLine: {
                    type: "object",
                    properties: {
                      field: { type: "string" },
                    },
                  },
                  currentVersionReviewsCount: {
                    type: "object",
                    properties: {
                      gte: { type: "number" },
                      lte: { type: "number" },
                    },
                  },
                },
              },
              sort: {
                type: "object",
                properties: {
                  released: { type: "number" },
                },
              },
            },
          },
          plan: {
            type: "array",
            items: { type: "string" },
            description: "List of plan identifiers.",
          },
          keywords: {
            type: "array",
            items: { type: "string" },
            description: "Optional list of keywords.",
          }
        },
        example: {
          name: "Top Trending Apps",
          poster: "https://example.com/poster.jpg",
          description: "A collection of trending apps.",
          filter: "popular",
          filterValues: {
            limit: 10,
            query: {
              installsExact: {
                gte: 10000,
                lte: 1000000,
              },
              type: "game",
              published: true,
              dailyInstalls: {
                gte: 500,
              },
              timeLine: {
                field: "createdAt",
              },
              currentVersionReviewsCount: {
                gte: 50,
                lte: 5000,
              },
            },
            sort: {
              released: 1,
            },
          },
          plan: ["free", "premium"],
          keywords: ["trending", "top apps"],
        },
      },      
      UpdateCollection: {
        type: "object",
        required: [],
        properties: {
          name: {
            type: "string",
            description: "The name of the collection",
          },
          description: {
            type: "string",
            description: "A brief description of the collection",
          },
          filter: {
            type: "string",
            description: "The filter type or category for the collection",
          },
          filterValues: {
            type: "object",
            required: ["limit"],
            properties: {
              limit: {
                type: "integer",
                description:
                  "The limit of the number of items in the collection",
              },
              query: {
                type: "object",
                properties: {
                  installsExact: {
                    type: "object",
                    properties: {
                      $gte: {
                        type: "integer",
                      },
                      $lte: {
                        type: "integer",
                      },
                    },
                  },
                  type: {
                    type: "string",
                  },
                  published: {
                    type: "boolean",
                  },
                  dailyInstalls: {
                    type: "object",
                    properties: {
                      $gte: {
                        type: "integer",
                      },
                    },
                  },
                  "timeLine.field": {
                    type: "string",
                  },
                  currentVersionReviewsCount: {
                    type: "object",
                    properties: {
                      $gte: {
                        type: "integer",
                      },
                      $lte: {
                        type: "integer",
                      },
                    },
                  },
                },
              },
              sort: {
                type: "object",
                properties: {
                  released: {
                    type: "integer",
                    description: "Sort by release date (timestamp)",
                  },
                },
              },
            },
          },
          plan: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of plans for the collection",
          },
          keywords: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of keywords related to the collection",
          },
          logs: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Log entries for tracking collection creation and updates",
          },
          apps: {
            type: "array",
            items: {
              type: "object",
            },
            description: "List of apps associated with the collection",
          },
        },
        example: {
          name: "Top Games",
          description: "A collection of the best games",
          filter: "gameType",
          filterValues: {
            limit: 10,
            query: {
              installsExact: {
                $gte: 1000,
                $lte: 50000,
              },
              type: "game",
              published: true,
              dailyInstalls: {
                $gte: 200,
              },
              "timeLine.field": "rating",
              currentVersionReviewsCount: {
                $gte: 1000,
                $lte: 5000,
              },
            },
            sort: {
              released: -1,
            },
          },
          plan: ["free", "premium"],
          keywords: ["top", "games", "popular"],
          logs: ["Collection created", "Collection updated"],
          apps: [
            {
              _id: "app123",
              rank: 1,
              previousRank: 2,
              name: "SuperGame",
              icon: "https://example.com/icon.png",
              installs: 1000000,
              installsExact: 1100000,
              dailyInstalls: 5000,
              released: "2022-01-01T12:00:00Z",
              timeLine: [
                {
                  date: "2023-12-25T14:00:00Z",
                  field: "rating",
                  before: ["3 stars"],
                  after: ["4 stars"],
                  lang: "en",
                  country: "US",
                },
              ],
            },
          ],
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

// Options for swagger-jsdoc
const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"], // Path to the API files
};
// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);
// Basic Authentication Middleware
app.use("/api-docs", (req, res, next) => {
  const auth = { username: "MFfzPbSL", password: "RAcC7TNxlZiO" }; // Change these credentials

  // Parse login credentials from the Authorization header
  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [user, pass] = Buffer.from(b64auth, "base64").toString().split(":");

  // Validate login credentials
  if (user === auth.username && pass === auth.password) {
    return next(); // Access granted
  }

  // Access denied
  res.set("WWW-Authenticate", 'Basic realm="401"'); // Prompt for login
  res.status(401).send("Authentication required."); // Unauthorized
});
// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// middleware to parse incoming JSON requests
app.use(express.json());
// middleware to save response json in res.locals.responseData
app.use(transformResponseJson);
// after response logging middleware
app.use(afterResponse);
// routes
//unprotected routes
app.use("/api/v1/auth", authRouter);
//get public avatar image
app.use("/a/:id", getAvatarController);
//get public apps image
app.use("/apps/:id", getAppsImageController);
//protected routes
app.use(authMiddleWare);
app.use("/api/v1/admin", routes.adminRouter);
app.use("/api/v1/plan", routes.planRouter);
app.use("/api/v1/user", routes.userRouter);
app.use("/api/v1/theme", routes.themeRouter);
app.use("/api/v1/template", routes.templateRouter);
app.use("/api/v1/appsBuild", routes.appsBuildRouter);
app.use("/api/v1/permission", routes.permissionRouter);
app.use("/api/v1/role", routes.roleRouter);
app.use("/api/v1/images", routes.uploadRouter);
app.use("/api/v1/collection", routes.collectionRouter);
app.use("/api/v1/scrapper", routes.scrapperRouter);

//not found route
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

//error handler
app.use(errorHandler);

//db connection
mongoose
  .connect(environment.MONGODB_URI as string)
  .then((_value: mongoose.Mongoose) => {
    console.log("🎉 connection established successfully with mongo db");
    app.listen(environment.PORT, async () => {
      await checkRedisConnection();
      transporter.verify((error, success) => {
        if (error) {
          console.error("Error connecting to the mail server:", error);
        } else {
          console.log("Server is ready to send emails:", success);
        }
      });
      console.log(`🚀 Server is running on port: ${environment.PORT}`);
      // seedRolesAndPermissions();
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("🚨 error while establishing connection with mongo db");
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log"
    );
  });
