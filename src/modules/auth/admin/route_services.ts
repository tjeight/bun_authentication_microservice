import type { Context } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { AdminLoginPostRequest, AdminSignupPOSTRequest } from "./schemas";
import {
    adminLoginPost,
    adminLogoutPost,
    adminRefreshTokenPost,
    adminSignupPost,
} from "./services";
import "dotenv/config";
import { REFRESH_TOKEN_EXPIRES_IN_SECONDS } from "../../../configs/env";
import { HTTP_STATUS } from "../../../utils/constants";

import type { AdminEnv } from "../../../utils/types";

export async function admin_signup_post_call(c: Context<AdminEnv>) {
    const payload = await c.req.json();

    const db = c.get("db");

    const result = await adminSignupPost(db, payload);

    return c.json({ message: result.message }, result.status);
}

export async function admin_login_post_call(c: Context<AdminEnv>) {
    // 1. Validate JSON body
    const payload = AdminLoginPostRequest.parse(await c.req.json());

    // 2. Resolve DB
    const db = c.get("db");

    // 3. Call service
    const result = await adminLoginPost(db, payload);

    // 4. Set refresh token cookie
    setCookie(c, "admin_refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        path: "/api/admin/refresh",
        maxAge: REFRESH_TOKEN_EXPIRES_IN_SECONDS,
    });

    // 5. Return access token only
    return c.json(
        {
            message: "Admin login successful",
            accessToken: result.accessToken,
        },
        HTTP_STATUS.OK,
    );
}

export async function admin_refresh_token_post_call(c: Context<AdminEnv>) {
    // 1. Get refresh token from cookie
    const refreshToken = getCookie(c, "admin_refresh_token");

    if (!refreshToken) {
        return c.json(
            { message: "Refresh token missing" },
            HTTP_STATUS.UNAUTHORIZED,
        );
    }

    // 2. Resolve DB
    const db = c.get("db");

    // 3. Call refresh service
    const result = await adminRefreshTokenPost(db, refreshToken);

    // 4. Rotate refresh token cookie
    setCookie(c, "admin_refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        path: "/api/admin/refresh",
        maxAge: REFRESH_TOKEN_EXPIRES_IN_SECONDS,
    });

    // 5. Return new access token ONLY
    return c.json(
        {
            accessToken: result.accessToken,
        },
        HTTP_STATUS.OK,
    );
}

export async function admin_logout_post_call(c: Context<AdminEnv>) {
    // 1. Read refresh token from cookie
    const refreshToken = getCookie(c, "admin_refresh_token");

    if (!refreshToken) {
        return c.json({ message: "Already logged out" }, HTTP_STATUS.OK);
    }

    // 2. Resolve DB
    const db = c.get("db");

    // 3. Revoke session
    await adminLogoutPost(db, refreshToken);

    // 4. Clear refresh token cookie
    deleteCookie(c, "admin_refresh_token", {
        path: "/api/admin/refresh",
    });

    return c.json({ message: "Logout successful" }, HTTP_STATUS.OK);
}
