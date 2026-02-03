import type { Context, Next } from "hono";
import { db } from "../configs/pg";

export async function dbMiddleware(c: Context, next: Next) {
	c.set("db", db);
	await next();
}
