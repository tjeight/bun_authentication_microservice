import { pgTable as table } from "drizzle-orm/pg-core"
import * as t from "drizzle-orm/pg-core"

// Admin Users Model
export const adminUsers = table("admin_users", {
    adminId: t.uuid().defaultRandom().primaryKey(),
    adminEmail: t.varchar().notNull().unique(),
    adminPassword: t.varchar().notNull(),
    createdAt: t.timestamp().defaultNow(),
    updatedAt: t.timestamp().defaultNow(),
    deletedAt: t.timestamp(), // nullable by default
})
