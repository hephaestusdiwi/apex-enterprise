import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_booking_settings_working_days" AS ENUM('0', '1', '2', '3', '4', '5', '6');
  CREATE TABLE "booking_settings_working_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_booking_settings_working_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "booking_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"capacity_per_day" numeric DEFAULT 2 NOT NULL,
  	"min_lead_days" numeric DEFAULT 3,
  	"max_advance_days" numeric DEFAULT 90,
  	"hold_hours" numeric DEFAULT 48,
  	"auto_confirm" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "booking_settings_id" integer;
  ALTER TABLE "booking_settings_working_days" ADD CONSTRAINT "booking_settings_working_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."booking_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "booking_settings_working_days_order_idx" ON "booking_settings_working_days" USING btree ("order");
  CREATE INDEX "booking_settings_working_days_parent_idx" ON "booking_settings_working_days" USING btree ("parent_id");
  CREATE INDEX "booking_settings_updated_at_1_idx" ON "booking_settings" USING btree ("updated_at");
  CREATE INDEX "booking_settings_created_at_1_idx" ON "booking_settings" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_booking_settings_fk" FOREIGN KEY ("booking_settings_id") REFERENCES "public"."booking_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_booking_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("booking_settings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "booking_settings_working_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "booking_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "booking_settings_working_days" CASCADE;
  DROP TABLE "booking_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_booking_settings_fk";
  
  DROP INDEX "payload_locked_documents_rels_booking_settings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "booking_settings_id";
  DROP TYPE "public"."enum_booking_settings_working_days";`)
}
