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
import { getAppsImageController, getAvatarController } from "./controllers/public.conroller";
import { seedRolesAndPermissions } from "./scripts/role.seeder";
//bullMQ
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { updateLogsAndActionsQueue } from "./config/queue.config";
import { transformResponseJson } from "./middlewares/response.middleware";
import { afterResponse } from "./middlewares/afterResponse.middleware";
import cookieParser from 'cookie-parser';
import { corsOptions } from "./config/cors.config";

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
  "/.well-known/pki-validation/C7EA7631321E42E8EA295E53788D31D2.txt",
  (req, res) => {
    res.send(`BB0A67923E3D998C4F42AA87D6199D3D15E699198AC9E2CBE00F6A01885B837F
comodoca.com
e86268acdcf13c7`);
  }
);


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
app.use("/api/v1/admin",routes.adminRouter );
app.use("/api/v1/plan",routes.planRouter );
app.use("/api/v1/user",routes.userRouter );
app.use("/api/v1/theme",routes.themeRouter );
app.use("/api/v1/template",routes.templateRouter );
app.use("/api/v1/appsBuild",routes.appsBuildRouter );
app.use("/api/v1/permission",routes.permissionRouter );
app.use("/api/v1/role",routes.roleRouter );


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
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog.log');
  });
