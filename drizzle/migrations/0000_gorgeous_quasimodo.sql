CREATE TYPE "public"."role" AS ENUM('master', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PENDING', 'APPROVED', 'PROVEN', 'COMPLETED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "travel_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"traveler_id" uuid NOT NULL,
	"destination_region" varchar(255) NOT NULL,
	"travel_reason" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"days" integer,
	"proof_deadline" date,
	"deposit_amount" numeric(10, 2),
	"proven_amount" numeric(10, 2),
	"difference_favor_traveler" numeric(10, 2),
	"difference_favor_company" numeric(10, 2),
	"is_proven_on_time" boolean DEFAULT false,
	"is_proven_late" boolean DEFAULT false,
	"proof_date" date,
	"request_email" varchar(255),
	"status" "status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "travelers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"department" varchar(255),
	"job_title" varchar(255),
	"base_region" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "travel_requests" ADD CONSTRAINT "travel_requests_traveler_id_travelers_id_fk" FOREIGN KEY ("traveler_id") REFERENCES "public"."travelers"("id") ON DELETE cascade ON UPDATE no action;