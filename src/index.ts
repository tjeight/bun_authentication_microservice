import { Hono } from "hono"
import adminRouter from "./routes/admin_routes"
import { dbMiddleware } from "./utils/db.middleware"
import type { AppContext } from "./utils/context"

const app = new Hono<{ Variables: AppContext }>()

// middleware
app.use("*", dbMiddleware)

// routes
app.route("/api", adminRouter)

app.get("/", (c) => c.text("Welcome to the Bun Authentication Microservice!"))
// 🔹 START SERVER
Bun.serve({
  port: 3000,
  fetch: app.fetch,
})

console.log("🚀 Server running on http://localhost:3000")
