import * as bcrypt from "bcryptjs"

import { SignJWT, jwtVerify } from "jose"
import {
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN_SECONDS,
} from "../configs/env"



export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash)
}


// jose requires Uint8Array secret
const secretKey = new TextEncoder().encode(JWT_SECRET_KEY)


export async function generateAccessToken(
    payload: Record<string, unknown>
): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: JWT_ALGORITHM || "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${ACCESS_TOKEN_EXPIRES_IN}s`)
        .sign(secretKey)
}

/**
 * Generate Refresh Token (long-lived)
 */
export async function generateRefreshToken(
    payload: Record<string, unknown>
): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: JWT_ALGORITHM || "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${REFRESH_TOKEN_EXPIRES_IN_SECONDS}s`)
        .sign(secretKey)
}

/**
 * Verify JWT (access or refresh)
 */
export async function verifyToken<T extends object>(
    token: string
): Promise<T> {
    const { payload } = await jwtVerify(token, secretKey, {
        algorithms: [JWT_ALGORITHM || "HS256"],
    })

    return payload as T
}
