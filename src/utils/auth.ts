import * as bcrypt from "bcryptjs";
import { sign, verify } from "hono/jwt";
import type { AlgorithmTypes } from "hono/jwt";

import {
	JWT_SECRET_KEY,
	JWT_ALGORITHM,
	ACCESS_TOKEN_EXPIRES_IN,
	REFRESH_TOKEN_EXPIRES_IN_SECONDS,
} from "../configs/env";

const JWT_ALG: AlgorithmTypes = (JWT_ALGORITHM as AlgorithmTypes) || "HS256";

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10);
}

export async function verifyPassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

/* ================= JWT ================= */

export async function generateAccessToken(
	payload: Record<string, unknown>,
): Promise<string> {
	return sign(
		{
			...payload,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + Number(ACCESS_TOKEN_EXPIRES_IN),
		},
		JWT_SECRET_KEY as string,
		JWT_ALG,
	);
}

export async function generateRefreshToken(
	payload: Record<string, unknown>,
): Promise<string> {
	return sign(
		{
			...payload,
			iat: Math.floor(Date.now() / 1000),
			exp:
				Math.floor(Date.now() / 1000) +
				Number(REFRESH_TOKEN_EXPIRES_IN_SECONDS),
		},
		JWT_SECRET_KEY as string,
		JWT_ALG,
	);
}

export async function verifyToken<T extends object>(token: string): Promise<T> {
	const payload = await verify(token, JWT_SECRET_KEY as string, JWT_ALG);

	return payload as T;
}
