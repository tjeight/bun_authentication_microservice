import { eq } from "drizzle-orm"
import { users } from "./models"
import type { AppContext } from "../../../utils/context"

export const findUserByEmail = async (
    db: AppContext["db"],
    email: string
) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    return result[0] ?? null
}
