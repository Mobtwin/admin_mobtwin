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
import { seedRolesAndPermissions } from "./scripts/role.seeder";
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
// initial the express server
const app: Express = express();
app.get("/", (req, res) => {
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
app.use(cors());
app.use(cookieParser());
// middleware to handle request logs
app.use(logger);

// dns validation(
app.get(
  "/.well-known/pki-validation/9C8A8C1AA245B8F5185A2C31766CD4ED.txt",
  (req, res) => {
    res.send(`28F8E3C99070885CECD6BF20314F0EAE4B64389DED6BEF7A956C95FD331DDF15
comodoca.com
621b7a5d39e7e15`);
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
          userName: { type: "string" },
          password: { type: "string" },
          email: { type: "string" },
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
          name: { type: "string" },
          type: { type: "string" },// application or game
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
          name: { type: "string" },
          type: { type: "string" },// application or game
        },
        example: {
          name: "quizeers",
          type: "application",
        },
      },
      Template: TemplateDefinition,
      Theme: ThemeDefinition,
      CreateTheme : {
        type: "object",
        required: ["name", "repoName", "repoOwner", "templateId"],
        properties: {
          name: { type: "string" },
          summary: { type: "string" }, // optional
          repoName: { type: "string" },
          repoOwner: { type: "string" },
          templateId: { type: "string" },
        },
        example: {
          name: "Dark Theme",
          summary: "A dark theme for the application",
          repoName: "theme-dark",
          repoOwner: "developer123",
          templateId: "template-001",
        },
      },
      UpdateTheme : {
        type: "object",
        required: [],
        properties: {
          name: { type: "string" },
          summary: { type: "string" }, // optional
          repoName: { type: "string" },
          repoOwner: { type: "string" },
          templateId: { type: "string" },
        },
        example: {
          name: "Dark Theme",
          summary: "A dark theme for the application",
          repoName: "theme-dark",
          repoOwner: "developer123",
          templateId: "template-001",
        },
      },
      Plan: PlansDefinition,
        "CreatePlan": {
          "type": "object",
          "required": [
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
            "builder"
          ],
          "properties": {
            "name": { "type": "string" },
            "prefix": { "type": "string" },
            "description": { "type": "string", "nullable": true },
            "stripeProductId": { "type": "string" },
            "stripeProductMonthlyPriceId": { "type": "string" },
            "lookupKey": { "type": "string" },
            "poster": { "type": "string", "nullable": true },
            "monthlyPrice": { "type": "number", "format": "float" },
            "interval": { 
              "type": "string", 
              "enum": ["month", "year"] 
            },
            "intervalCount": { "type": "integer" },
            "trialDays": { "type": "integer" },
            "features": { 
              "type": "array", 
              "items": { "type": "string" },
              "nullable": true 
            },
            "capability": { 
              "type": "string", 
              "enum": ["basic", "full"] 
            },
            "mode": { 
              "type": "string", 
              "enum": ["basic", "advanced"] 
            },
            "filters": {
              "type": "object",
              "required": ["limit", "sort", "skip", "nestedFilters"],
              "properties": {
                "limit": { "type": "integer" },
                "sort": {
                  "type": "object",
                  "required": ["released", "updated", "installsExact", "currentVersionReviewsCount", "dailyReviewsCount"],
                  "properties": {
                    "released": { "type": "boolean" },
                    "updated": { "type": "boolean" },
                    "installsExact": { "type": "boolean" },
                    "currentVersionReviewsCount": { "type": "boolean" },
                    "dailyReviewsCount": { "type": "boolean" }
                  }
                },
                "skip": { "type": "integer" },
                "nestedFilters": {
                  "type": "object",
                  "required": ["match", "range", "term"],
                  "properties": {
                    "match": { "type": "boolean" },
                    "range": { "type": "boolean" },
                    "term": { "type": "boolean" }
                  }
                }
              }
            },
            "pockets": {
              "type": "object",
              "required": ["limit", "maxItems"],
              "properties": {
                "limit": { "type": "integer" },
                "maxItems": { "type": "integer" }
              }
            },
            "builder": {
              "type": "object",
              "required": ["maxApps", "allowedApps", "allowedAds"],
              "properties": {
                "maxApps": { "type": "integer" },
                "allowedApps": {
                  "type": "array",
                  "items": { "type": "string" }
                },
                "allowedAds": {
                  "type": "array",
                  "items": { "type": "string" }
                }
              }
            }
          },
          "example": {
            "name": "Premium Plan",
            "prefix": "premium",
            "description": "A premium subscription plan",
            "stripeProductId": "prod_12345",
            "stripeProductMonthlyPriceId": "price_67890",
            "lookupKey": "premium_plan_123",
            "poster": "https://example.com/poster.jpg",
            "monthlyPrice": 29.99,
            "interval": "month",
            "intervalCount": 1,
            "trialDays": 14,
            "features": ["Feature 1", "Feature 2"],
            "capability": "full",
            "mode": "advanced",
            "filters": {
              "limit": 10,
              "sort": {
                "released": true,
                "updated": true,
                "installsExact": false,
                "currentVersionReviewsCount": true,
                "dailyReviewsCount": false
              },
              "skip": 5,
              "nestedFilters": {
                "match": true,
                "range": true,
                "term": false
              }
            },
            "pockets": {
              "limit": 20,
              "maxItems": 50
            },
            "builder": {
              "maxApps": 10,
              "allowedApps": ["App 1", "App 2"],
              "allowedAds": ["Ad 1", "Ad 2"]
            }
          }
      },      
        "UpdatePlan": {
          "type": "object",
          "required": [],
          "properties": {
            "name": { "type": "string" },
            "prefix": { "type": "string" },
            "description": { "type": "string", "nullable": true },
            "stripeProductId": { "type": "string" },
            "stripeProductMonthlyPriceId": { "type": "string" },
            "lookupKey": { "type": "string" },
            "poster": { "type": "string", "nullable": true },
            "monthlyPrice": { "type": "number", "format": "float" },
            "interval": { 
              "type": "string", 
              "enum": ["month", "year"] 
            },
            "intervalCount": { "type": "integer" },
            "trialDays": { "type": "integer" },
            "features": { 
              "type": "array", 
              "items": { "type": "string" },
              "nullable": true 
            },
            "capability": { 
              "type": "string", 
              "enum": ["basic", "full"] 
            },
            "mode": { 
              "type": "string", 
              "enum": ["basic", "advanced"] 
            },
            "filters": {
              "type": "object",
              "required": ["limit", "sort", "skip", "nestedFilters"],
              "properties": {
                "limit": { "type": "integer" },
                "sort": {
                  "type": "object",
                  "required": ["released", "updated", "installsExact", "currentVersionReviewsCount", "dailyReviewsCount"],
                  "properties": {
                    "released": { "type": "boolean" },
                    "updated": { "type": "boolean" },
                    "installsExact": { "type": "boolean" },
                    "currentVersionReviewsCount": { "type": "boolean" },
                    "dailyReviewsCount": { "type": "boolean" }
                  }
                },
                "skip": { "type": "integer" },
                "nestedFilters": {
                  "type": "object",
                  "required": ["match", "range", "term"],
                  "properties": {
                    "match": { "type": "boolean" },
                    "range": { "type": "boolean" },
                    "term": { "type": "boolean" }
                  }
                }
              }
            },
            "pockets": {
              "type": "object",
              "required": ["limit", "maxItems"],
              "properties": {
                "limit": { "type": "integer" },
                "maxItems": { "type": "integer" }
              }
            },
            "builder": {
              "type": "object",
              "required": ["maxApps", "allowedApps", "allowedAds"],
              "properties": {
                "maxApps": { "type": "integer" },
                "allowedApps": {
                  "type": "array",
                  "items": { "type": "string" }
                },
                "allowedAds": {
                  "type": "array",
                  "items": { "type": "string" }
                }
              }
            }
          },
          "example": {
            "name": "Premium Plan",
            "prefix": "premium",
            "description": "A premium subscription plan",
            "stripeProductId": "prod_12345",
            "stripeProductMonthlyPriceId": "price_67890",
            "lookupKey": "premium_plan_123",
            "poster": "https://example.com/poster.jpg",
            "monthlyPrice": 29.99,
            "interval": "month",
            "intervalCount": 1,
            "trialDays": 14,
            "features": ["Feature 1", "Feature 2"],
            "capability": "full",
            "mode": "advanced",
            "filters": {
              "limit": 10,
              "sort": {
                "released": true,
                "updated": true,
                "installsExact": false,
                "currentVersionReviewsCount": true,
                "dailyReviewsCount": false
              },
              "skip": 5,
              "nestedFilters": {
                "match": true,
                "range": true,
                "term": false
              }
            },
            "pockets": {
              "limit": 20,
              "maxItems": 50
            },
            "builder": {
              "maxApps": 10,
              "allowedApps": ["App 1", "App 2"],
              "allowedAds": ["Ad 1", "Ad 2"]
            }
          }
      },      
      CreateAdmin: {
        type: "object",
        required: ["userName", "password", "email", "role"],
        properties: {
          userName: { type: "string" },
          password: { type: "string" },
          email: { type: "string" },
          role: { type: "string" },
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
          userName: { type: "string" },
          email: { type: "string" },
          role: { type: "object", properties: { name: { type: "string" },_id: { type: "string" },permissions:{type:"array",items: { type: "string" }},createdAt: { type: "string" },updatedAt: { type: "string" }, } },
          _id: { type: "string" },
          devices: { type: "array", items: { $ref: "#/components/schemas/Device" } },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
      Device: {
        type: "object",
        properties: {
          _id: { type: "string" },
          ipAddress: { type: "string" },
          userAgent: { type: "string" },
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
      Role: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          permissions: { type: "array", items: { type: "string" } },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      }
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
  apis: ["./src/routes/*.ts"], // Path to the API files
};
// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

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
    app.listen(environment.PORT, () => {
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
