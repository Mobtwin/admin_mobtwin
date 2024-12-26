import { adminRouter } from "./admin.route";
import { userRouter } from "./user.route";
import { templateRouter } from "./template.route";
import { themeRouter } from "./theme.route";
import { appsBuildRouter } from "./appsBuild.route";
import { planRouter } from "./plan.route";
import { permissionRouter } from "./permission.route";
import { roleRouter } from "./role.route";
import { uploadRouter } from "./public.route";
import { collectionRouter } from "./collection.route";


const routes = {
    adminRouter,
    userRouter,
    templateRouter,
    themeRouter,
    appsBuildRouter,
    planRouter,
    roleRouter,
    permissionRouter,
    uploadRouter,
    collectionRouter
};

export default routes;