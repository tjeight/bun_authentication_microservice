CREATE TABLE "admin_users" (
	"admin_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_email" varchar NOT NULL,
	"admin_password" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "admin_users_adminEmail_unique" UNIQUE("admin_email")
);
