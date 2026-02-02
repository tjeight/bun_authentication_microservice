import type { Context } from "hono"
import { AdminLoginPostRequest, AdminSignupPOSTRequest } from "./schemas"
import { adminLoginPost, adminSignupPost } from "./services"

export async function admin_signup_post_call(c: Context) {
    // validate request
    const payload = AdminSignupPOSTRequest.parse(
        await c.req.json()
    )

    // resolve dependency in router
    const db = c.get("db")

    // call service
    const result = await adminSignupPost(db, payload)

    return c.json(
        { message: result.message },
        result.status
    )
}


export async function admin_login_post_call(c: Context) {
    // validate request
    const payload = AdminLoginPostRequest.parse(
        await c.req.json()
    )

    // resolve dependency in router
    const db = c.get("db")

    // call service
    const result = await adminLoginPost(db, payload)

    // set the cookie for refresh token
    c.cookie("admin_refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return c.json(
        { message: result.message },
        result.status
    )
}

