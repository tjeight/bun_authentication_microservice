import type { AppContext } from "../../../utils/context"
import type { AdminSignupPOSTRequestSchema, AdminLoginPOSTRequestSchema } from "./schemas"
import { generateAccessToken, generateRefreshToken, hashPassword, verifyPassword } from "../../../utils/auth"
import { adminUsers } from "./models"
import { HTTP_STATUS } from "../../../utils/constants"
import { eq } from "drizzle-orm"

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


export async function adminLoginPost(
    db: AppContext["db"],
    payload: AdminLoginPOSTRequestSchema
) {
    const { adminEmail, adminPassword } = payload

    // 1. Find admin by email
    const adminUser = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.adminEmail, adminEmail))
        .limit(1)

    if (adminUser.length === 0) {
        throw new Error("Invalid admin credentials")
    }

    const user = adminUser[0]

    // 2. Verify password
    const isPasswordValid = await verifyPassword(
        adminPassword,
        user.adminPassword
    )

    if (!isPasswordValid) {
        throw new Error("Invalid admin credentials")
    }

    // 3. Generate tokens
    const accessToken = await generateAccessToken({
        adminId: user.adminId,
    })

    const refreshToken = await generateRefreshToken({
        adminId: user.adminId,
    })

    // 4. Return auth result
    return {
        status: HTTP_STATUS.OK,
        message: "Admin login successful",
        accessToken,
        refreshToken,
    }
}
