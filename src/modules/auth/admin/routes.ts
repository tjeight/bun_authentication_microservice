import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
	admin_login_post_call,
	admin_logout_post_call,
	admin_refresh_token_post_call,
	admin_signup_post_call,
} from "./route_services";

import { AdminSignupPOSTRequest, AdminLoginPostRequest } from "./schemas";
import type { AdminEnv } from "../../../utils/types";

export const adminAuthRouter = new Hono<AdminEnv>();

adminAuthRouter.post(
	"/signup",
	zValidator("json", AdminSignupPOSTRequest),
	admin_signup_post_call,
);

adminAuthRouter.post(
	"/login",
	zValidator("json", AdminLoginPostRequest),
	admin_login_post_call,
);

adminAuthRouter.post("/refresh", admin_refresh_token_post_call);

adminAuthRouter.post("/logout", admin_logout_post_call);
