import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "booking_blackouts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"start_date" varchar NOT NULL,
  	"end_date" varchar,
  	"capacity" numeric,
  	"reason" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "booking_blackouts_id" integer;
  CREATE INDEX "booking_blackouts_updated_at_idx" ON "booking_blackouts" USING btree ("updated_at");
  CREATE INDEX "booking_blackouts_created_at_idx" ON "booking_blackouts" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_booking_blackouts_fk" FOREIGN KEY ("booking_blackouts_id") REFERENCES "public"."booking_blackouts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_booking_blackouts_id_idx" ON "payload_locked_documents_rels" USING btree ("booking_blackouts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_booking_blackouts_fk";
  DROP INDEX "payload_locked_documents_rels_booking_blackouts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "booking_blackouts_id";
  DROP TABLE "booking_blackouts" CASCADE;`)
}
