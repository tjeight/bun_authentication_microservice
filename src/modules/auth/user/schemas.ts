import { z } from "zod";

/* ---------- Requests ---------- */

export const LoginRequestSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/* ---------- Responses ---------- */

export const LoginResponseSchema = z.object({
	accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
