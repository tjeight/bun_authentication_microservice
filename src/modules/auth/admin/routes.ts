import { Hono } from "hono"
import { admin_signup_post_call } from "./route_services"

export const adminAuthRouter = new Hono()

adminAuthRouter.post("/signup", admin_signup_post_call)
