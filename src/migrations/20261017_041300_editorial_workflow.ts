import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_editorial_reviews_doc_collection" AS ENUM('projects', 'pages');
  CREATE TYPE "public"."enum_editorial_reviews_status" AS ENUM('draft', 'in_review', 'changes_requested', 'approved');
  CREATE TYPE "public"."enum_editorial_notes_doc_collection" AS ENUM('projects', 'pages');
  CREATE TYPE "public"."enum_editorial_notes_kind" AS ENUM('comment', 'review', 'system');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "editorial_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_collection" "enum_editorial_reviews_doc_collection" NOT NULL,
  	"doc_id" numeric NOT NULL,
  	"status" "enum_editorial_reviews_status" DEFAULT 'draft' NOT NULL,
  	"requested_by_id" integer,
  	"requested_at" timestamp(3) with time zone,
  	"decided_by_id" integer,
  	"decided_at" timestamp(3) with time zone,
  	"approved_fingerprint" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "editorial_reviews_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "editorial_notes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_collection" "enum_editorial_notes_doc_collection" NOT NULL,
  	"doc_id" numeric NOT NULL,
  	"author_id" integer NOT NULL,
  	"kind" "enum_editorial_notes_kind" DEFAULT 'comment' NOT NULL,
  	"body" varchar NOT NULL,
  	"resolved" boolean DEFAULT false,
  	"resolved_by_id" integer,
  	"resolved_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "workflow_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"require_approval" boolean DEFAULT false,
  	"notify_by_email" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "editorial_reviews_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "editorial_notes_id" integer;
  ALTER TABLE "editorial_reviews" ADD CONSTRAINT "editorial_reviews_requested_by_id_users_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editorial_reviews" ADD CONSTRAINT "editorial_reviews_decided_by_id_users_id_fk" FOREIGN KEY ("decided_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editorial_reviews_rels" ADD CONSTRAINT "editorial_reviews_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."editorial_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "editorial_reviews_rels" ADD CONSTRAINT "editorial_reviews_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "editorial_notes" ADD CONSTRAINT "editorial_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editorial_notes" ADD CONSTRAINT "editorial_notes_resolved_by_id_users_id_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "editorial_reviews_doc_id_idx" ON "editorial_reviews" USING btree ("doc_id");
  CREATE INDEX "editorial_reviews_requested_by_idx" ON "editorial_reviews" USING btree ("requested_by_id");
  CREATE INDEX "editorial_reviews_decided_by_idx" ON "editorial_reviews" USING btree ("decided_by_id");
  CREATE INDEX "editorial_reviews_updated_at_idx" ON "editorial_reviews" USING btree ("updated_at");
  CREATE INDEX "editorial_reviews_created_at_idx" ON "editorial_reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "docCollection_docId_idx" ON "editorial_reviews" USING btree ("doc_collection","doc_id");
  CREATE INDEX "editorial_reviews_rels_order_idx" ON "editorial_reviews_rels" USING btree ("order");
  CREATE INDEX "editorial_reviews_rels_parent_idx" ON "editorial_reviews_rels" USING btree ("parent_id");
  CREATE INDEX "editorial_reviews_rels_path_idx" ON "editorial_reviews_rels" USING btree ("path");
  CREATE INDEX "editorial_reviews_rels_users_id_idx" ON "editorial_reviews_rels" USING btree ("users_id");
  CREATE INDEX "editorial_notes_author_idx" ON "editorial_notes" USING btree ("author_id");
  CREATE INDEX "editorial_notes_resolved_by_idx" ON "editorial_notes" USING btree ("resolved_by_id");
  CREATE INDEX "editorial_notes_updated_at_idx" ON "editorial_notes" USING btree ("updated_at");
  CREATE INDEX "editorial_notes_created_at_idx" ON "editorial_notes" USING btree ("created_at");
  CREATE INDEX "docCollection_docId_1_idx" ON "editorial_notes" USING btree ("doc_collection","doc_id");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_editorial_reviews_fk" FOREIGN KEY ("editorial_reviews_id") REFERENCES "public"."editorial_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_editorial_notes_fk" FOREIGN KEY ("editorial_notes_id") REFERENCES "public"."editorial_notes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_editorial_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("editorial_reviews_id");
  CREATE INDEX "payload_locked_documents_rels_editorial_notes_id_idx" ON "payload_locked_documents_rels" USING btree ("editorial_notes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "editorial_reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "editorial_reviews_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "editorial_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "workflow_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "editorial_reviews" CASCADE;
  DROP TABLE "editorial_reviews_rels" CASCADE;
  DROP TABLE "editorial_notes" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "workflow_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_editorial_reviews_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_editorial_notes_fk";
  
  DROP INDEX "payload_locked_documents_rels_editorial_reviews_id_idx";
  DROP INDEX "payload_locked_documents_rels_editorial_notes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "editorial_reviews_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "editorial_notes_id";
  DROP TYPE "public"."enum_editorial_reviews_doc_collection";
  DROP TYPE "public"."enum_editorial_reviews_status";
  DROP TYPE "public"."enum_editorial_notes_doc_collection";
  DROP TYPE "public"."enum_editorial_notes_kind";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
