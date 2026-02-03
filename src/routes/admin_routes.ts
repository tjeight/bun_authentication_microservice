import { Hono } from "hono";
import { adminAuthRouter } from "../modules/auth/admin/routes";

// create main admin router
const adminRouter = new Hono();

adminRouter.route("/admin", adminAuthRouter);

export default adminRouter;
