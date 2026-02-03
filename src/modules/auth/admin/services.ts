import type { AppContext } from "../../../utils/context";
import type {
	AdminSignupPOSTRequestSchema,
	AdminLoginPOSTRequestSchema,
} from "./schemas";
import {
	generateAccessToken,
	generateRefreshToken,
	hashPassword,
	verifyPassword,
	verifyToken,
} from "../../../utils/auth";
import { adminSessions, adminUsers } from "./models";
import { HTTP_STATUS } from "../../../utils/constants";
import { eq } from "drizzle-orm";
import { randomUUIDv7 } from "bun";

export async function adminSignupPost(
	db: AppContext["db"],
	payload: AdminSignupPOSTRequestSchema,
) {
	try {
		const hashedPassword = await hashPassword(payload.adminPassword);

		await db
			.insert(adminUsers)
			.values({
				adminEmail: payload.adminEmail,
				adminPassword: hashedPassword,
			})
			.execute();

		return {
			status: HTTP_STATUS.CREATED,
			message: "Admin signup successful",
		};
	} catch (err: any) {
		// postgres unique constraint violation
		if (err.code === "23505") {
			throw new Error("Admin email already exists");
		}
		throw err;
	}
}

export async function adminLoginPost(
	db: AppContext["db"],
	payload: AdminLoginPOSTRequestSchema,
) {
	const { adminEmail, adminPassword } = payload;

	// 1. Find admin
	const adminUser = await db
		.select()
		.from(adminUsers)
		.where(eq(adminUsers.adminEmail, adminEmail))
		.limit(1);

	if (adminUser.length === 0) {
		throw new Error("Invalid admin credentials");
	}

	const user = adminUser[0];

	// 2. Verify password
	const isValid = await verifyPassword(adminPassword, user.adminPassword);

	if (!isValid) {
		throw new Error("Invalid admin credentials");
	}

	// 3. Create session
	const sessionId = randomUUIDv7();

	// 4. Generate tokens WITH sessionId
	const accessToken = await generateAccessToken({
		adminId: user.adminId,
		sessionId,
	});

	const refreshToken = await generateRefreshToken({
		adminId: user.adminId,
		sessionId,
	});

	// 5. Hash refresh token before storing
	const refreshTokenHash = await hashPassword(refreshToken);

	// 6. Store session
	await db.insert(adminSessions).values({
		adminSessionId: sessionId,
		adminId: user.adminId,
		refreshTokenHash,
		expiresAt: new Date(
			Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
		),
	});

	// 7. Return tokens
	return {
		accessToken,
		refreshToken,
	};
}
export async function adminRefreshTokenPost(
	db: AppContext["db"],
	refreshToken: string,
) {
	// 1. Verify refresh token JWT (signature + expiry)
	const payload = await verifyToken<{
		adminId: string;
		sessionId: string;
	}>(refreshToken);

	const { adminId, sessionId } = payload;

	// 2. Fetch session by sessionId
	const session = await db
		.select()
		.from(adminSessions)
		.where(eq(adminSessions.adminSessionId, sessionId))
		.limit(1);

	if (session.length === 0) {
		throw new Error("Invalid session");
	}

	const currentSession = session[0];

	// 3. Check session state
	if (currentSession.revokedAt) {
		throw new Error("Session revoked");
	}

	if (currentSession.expiresAt < new Date()) {
		throw new Error("Session expired");
	}

	// 4. Verify refresh token against stored HASH
	const isValidRefreshToken = await verifyPassword(
		refreshToken,
		currentSession.refreshTokenHash,
	);

	if (!isValidRefreshToken) {
		// token reuse / theft detected
		throw new Error("Refresh token reuse detected");
	}

	// 5. Rotate tokens
	const newAccessToken = await generateAccessToken({
		adminId,
		sessionId,
	});

	const newRefreshToken = await generateRefreshToken({
		adminId,
		sessionId,
	});

	// 6. Hash new refresh token
	const newRefreshTokenHash = await hashPassword(newRefreshToken);

	// 7. Update session with rotated token
	await db
		.update(adminSessions)
		.set({
			refreshTokenHash: newRefreshTokenHash,
			lastRotatedAt: new Date(),
		})
		.where(eq(adminSessions.adminSessionId, sessionId))
		.execute();

	// 8. Return new tokens
	return {
		accessToken: newAccessToken,
		refreshToken: newRefreshToken,
	};
}

export async function adminLogoutPost(
	db: AppContext["db"],
	refreshToken: string,
) {
	// 1. Verify refresh token (get sessionId)
	const payload = await verifyToken<{
		sessionId: string;
	}>(refreshToken);

	// 2. Revoke that session
	await db
		.update(adminSessions)
		.set({
			revokedAt: new Date(),
		})
		.where(eq(adminSessions.adminSessionId, payload.sessionId))
		.execute();

	return { message: "Logged out successfully" };
}
