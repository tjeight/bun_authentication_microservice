CREATE TABLE "admin_sessions" (
	"admin_session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"refresh_token_hash" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"last_rotated_at" timestamp DEFAULT now(),
	"revoked_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_id_admin_users_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("admin_id") ON DELETE no action ON UPDATE no action;