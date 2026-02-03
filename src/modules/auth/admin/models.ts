import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

// Admin Users Model
export const adminUsers = table("admin_users", {
	adminId: t.uuid().defaultRandom().primaryKey(),
	adminEmail: t.varchar().notNull().unique(),
	adminPassword: t.varchar().notNull(),
	createdAt: t.timestamp().defaultNow(),
	updatedAt: t.timestamp().defaultNow(),
	deletedAt: t.timestamp(), // nullable by default
});

//  Admin Sessions Model
export const adminSessions = table("admin_sessions", {
	adminSessionId: t.uuid().defaultRandom().primaryKey(),

	adminId: t
		.uuid()
		.notNull()
		.references(() => adminUsers.adminId),

	refreshTokenHash: t.varchar({ length: 255 }).notNull(),

	//  Session expiry
	expiresAt: t.timestamp().notNull(),

	// Rotation trackings
	lastRotatedAt: t.timestamp().defaultNow(),

	//
	revokedAt: t.timestamp(),

	createdAt: t.timestamp().defaultNow(),
	updatedAt: t.timestamp().defaultNow(),
});
