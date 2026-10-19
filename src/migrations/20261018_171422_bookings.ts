import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_bookings_status" AS ENUM('pending', 'confirmed', 'rejected', 'cancelled', 'completed', 'expired', 'spam');
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"service_package_id" integer NOT NULL,
  	"package_title" varchar,
  	"package_price" numeric,
  	"date" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"notes" varchar,
  	"status" "enum_bookings_status" DEFAULT 'pending' NOT NULL,
  	"hold_until" timestamp(3) with time zone,
  	"admin_note" varchar,
  	"spam_score" numeric DEFAULT 0,
  	"spam_reasons" varchar,
  	"ip_hash" varchar,
  	"access_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_booking_settings_fk";
  
  DROP INDEX "payload_locked_documents_rels_booking_settings_id_idx";
  DROP INDEX "booking_settings_updated_at_1_idx";
  DROP INDEX "booking_settings_created_at_1_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "bookings_id" integer;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_package_id_service_packages_id_fk" FOREIGN KEY ("service_package_id") REFERENCES "public"."service_packages"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "bookings_code_idx" ON "bookings" USING btree ("code");
  CREATE INDEX "bookings_service_package_idx" ON "bookings" USING btree ("service_package_id");
  CREATE INDEX "bookings_date_idx" ON "bookings" USING btree ("date");
  CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");
  CREATE INDEX "bookings_ip_hash_idx" ON "bookings" USING btree ("ip_hash");
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "booking_settings_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bookings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "bookings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_bookings_fk";
  
  DROP INDEX "payload_locked_documents_rels_bookings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "booking_settings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_booking_settings_fk" FOREIGN KEY ("booking_settings_id") REFERENCES "public"."booking_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_booking_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("booking_settings_id");
  CREATE INDEX "booking_settings_updated_at_1_idx" ON "booking_settings" USING btree ("updated_at");
  CREATE INDEX "booking_settings_created_at_1_idx" ON "booking_settings" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "bookings_id";
  DROP TYPE "public"."enum_bookings_status";`)
}
