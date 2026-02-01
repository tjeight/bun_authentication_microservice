import type { AppContext } from "../../../utils/context"
import type { AdminSignupPOSTRequestSchema } from "./schemas"
import { hashPassword } from "../../../utils/auth"
import { adminUsers } from "./models"
import { HTTP_STATUS } from "../../../utils/constants"

export async function adminSignupPost(
    db: AppContext["db"],
    payload: AdminSignupPOSTRequestSchema
) {
    try {
        const hashedPassword = await hashPassword(payload.adminPassword)

        await db
            .insert(adminUsers)
            .values({
                adminEmail: payload.adminEmail,
                adminPassword: hashedPassword,
            })
            .execute()

        return {
            status: HTTP_STATUS.CREATED,
            message: "Admin signup successful",
        }
    } catch (err: any) {
        // postgres unique constraint violation
        if (err.code === "23505") {
            throw new Error("Admin email already exists")
        }
        throw err
    }
}
