import { Hono } from "hono";
import adminRouter from "./routes/admin_routes";
import { dbMiddleware } from "./utils/db.middleware";
import type { AppContext } from "./utils/context";
import { cors } from 'hono/cors'

const app = new Hono<{ Variables: AppContext }>();

// middleware
app.use("*", dbMiddleware);
app.use(
	"/api/*",
	cors({
		origin: "http://localhost:5500",
		credentials: true,
	})
)

// IMPORTANT: allow preflight
app.options("/api/*", (c) => c.text("", 204))
// routes
app.route("/api", adminRouter);

app.get("/", (c) => c.text("Welcome to the Bun Authentication Microservice!"));
// 🔹 START SERVER
Bun.serve({
	port: 3000,
	fetch: app.fetch,
});

console.log("🚀 Server running on http://localhost:3000");
