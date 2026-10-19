import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_service_packages_price_type" AS ENUM('fixed', 'from', 'custom');
  CREATE TYPE "public"."enum_service_packages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__service_packages_v_version_price_type" AS ENUM('fixed', 'from', 'custom');
  CREATE TYPE "public"."enum__service_packages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "service_packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "service_packages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"tagline" varchar,
  	"description" varchar,
  	"price_type" "enum_service_packages_price_type" DEFAULT 'fixed',
  	"price" numeric,
  	"price_note" varchar,
  	"highlighted" boolean DEFAULT false,
  	"bookable" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_service_packages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_service_packages_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_packages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_tagline" varchar,
  	"version_description" varchar,
  	"version_price_type" "enum__service_packages_v_version_price_type" DEFAULT 'fixed',
  	"version_price" numeric,
  	"version_price_note" varchar,
  	"version_highlighted" boolean DEFAULT false,
  	"version_bookable" boolean DEFAULT true,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__service_packages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "service_packages_id" integer;
  ALTER TABLE "service_packages_features" ADD CONSTRAINT "service_packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_packages" ADD CONSTRAINT "service_packages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_packages_v_version_features" ADD CONSTRAINT "_service_packages_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_packages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_packages_v" ADD CONSTRAINT "_service_packages_v_parent_id_service_packages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_packages_v" ADD CONSTRAINT "_service_packages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "service_packages_features_order_idx" ON "service_packages_features" USING btree ("_order");
  CREATE INDEX "service_packages_features_parent_id_idx" ON "service_packages_features" USING btree ("_parent_id");
  CREATE INDEX "service_packages__order_idx" ON "service_packages" USING btree ("_order");
  CREATE UNIQUE INDEX "service_packages_slug_idx" ON "service_packages" USING btree ("slug");
  CREATE INDEX "service_packages_seo_seo_image_idx" ON "service_packages" USING btree ("seo_image_id");
  CREATE INDEX "service_packages_updated_at_idx" ON "service_packages" USING btree ("updated_at");
  CREATE INDEX "service_packages_created_at_idx" ON "service_packages" USING btree ("created_at");
  CREATE INDEX "service_packages__status_idx" ON "service_packages" USING btree ("_status");
  CREATE INDEX "_service_packages_v_version_features_order_idx" ON "_service_packages_v_version_features" USING btree ("_order");
  CREATE INDEX "_service_packages_v_version_features_parent_id_idx" ON "_service_packages_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_service_packages_v_parent_idx" ON "_service_packages_v" USING btree ("parent_id");
  CREATE INDEX "_service_packages_v_version_version__order_idx" ON "_service_packages_v" USING btree ("version__order");
  CREATE INDEX "_service_packages_v_version_version_slug_idx" ON "_service_packages_v" USING btree ("version_slug");
  CREATE INDEX "_service_packages_v_version_seo_version_seo_image_idx" ON "_service_packages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_service_packages_v_version_version_updated_at_idx" ON "_service_packages_v" USING btree ("version_updated_at");
  CREATE INDEX "_service_packages_v_version_version_created_at_idx" ON "_service_packages_v" USING btree ("version_created_at");
  CREATE INDEX "_service_packages_v_version_version__status_idx" ON "_service_packages_v" USING btree ("version__status");
  CREATE INDEX "_service_packages_v_created_at_idx" ON "_service_packages_v" USING btree ("created_at");
  CREATE INDEX "_service_packages_v_updated_at_idx" ON "_service_packages_v" USING btree ("updated_at");
  CREATE INDEX "_service_packages_v_latest_idx" ON "_service_packages_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_packages_fk" FOREIGN KEY ("service_packages_id") REFERENCES "public"."service_packages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_service_packages_id_idx" ON "payload_locked_documents_rels" USING btree ("service_packages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "service_packages_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_packages_v_version_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_packages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "service_packages_features" CASCADE;
  DROP TABLE "service_packages" CASCADE;
  DROP TABLE "_service_packages_v_version_features" CASCADE;
  DROP TABLE "_service_packages_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_service_packages_fk";
  
  DROP INDEX "payload_locked_documents_rels_service_packages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "service_packages_id";
  DROP TYPE "public"."enum_service_packages_price_type";
  DROP TYPE "public"."enum_service_packages_status";
  DROP TYPE "public"."enum__service_packages_v_version_price_type";
  DROP TYPE "public"."enum__service_packages_v_version_status";`)
}
