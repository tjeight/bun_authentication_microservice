import type { Context } from "hono"
import { AdminSignupPOSTRequest } from "./schemas"
import { adminSignupPost } from "./services"

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
