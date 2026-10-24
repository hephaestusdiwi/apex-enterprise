import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_typography_body_source" AS ENUM('default', 'google', 'upload');
  CREATE TYPE "public"."enum_site_settings_typography_body_google_family" AS ENUM('inter', 'poppins', 'roboto', 'open-sans', 'montserrat', 'lato', 'dm-sans', 'work-sans', 'manrope', 'space-grotesk', 'bebas-neue', 'playfair-display', 'lora', 'merriweather', 'cormorant-garamond', 'dm-serif-display', 'libre-baskerville');
  CREATE TYPE "public"."enum_site_settings_typography_heading_source" AS ENUM('default', 'google', 'upload');
  CREATE TYPE "public"."enum_site_settings_typography_heading_google_family" AS ENUM('inter', 'poppins', 'roboto', 'open-sans', 'montserrat', 'lato', 'dm-sans', 'work-sans', 'manrope', 'space-grotesk', 'bebas-neue', 'playfair-display', 'lora', 'merriweather', 'cormorant-garamond', 'dm-serif-display', 'libre-baskerville');
  ALTER TABLE "site_settings" ADD COLUMN "typography_body_source" "enum_site_settings_typography_body_source" DEFAULT 'default';
  ALTER TABLE "site_settings" ADD COLUMN "typography_body_google_family" "enum_site_settings_typography_body_google_family";
  ALTER TABLE "site_settings" ADD COLUMN "typography_body_file_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "typography_heading_source" "enum_site_settings_typography_heading_source" DEFAULT 'default';
  ALTER TABLE "site_settings" ADD COLUMN "typography_heading_google_family" "enum_site_settings_typography_heading_google_family";
  ALTER TABLE "site_settings" ADD COLUMN "typography_heading_file_id" integer;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_typography_body_file_id_media_id_fk" FOREIGN KEY ("typography_body_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_typography_heading_file_id_media_id_fk" FOREIGN KEY ("typography_heading_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_typography_body_typography_body_file_idx" ON "site_settings" USING btree ("typography_body_file_id");
  CREATE INDEX "site_settings_typography_heading_typography_heading_file_idx" ON "site_settings" USING btree ("typography_heading_file_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_typography_body_file_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_typography_heading_file_id_media_id_fk";
  
  DROP INDEX "site_settings_typography_body_typography_body_file_idx";
  DROP INDEX "site_settings_typography_heading_typography_heading_file_idx";
  ALTER TABLE "site_settings" DROP COLUMN "typography_body_source";
  ALTER TABLE "site_settings" DROP COLUMN "typography_body_google_family";
  ALTER TABLE "site_settings" DROP COLUMN "typography_body_file_id";
  ALTER TABLE "site_settings" DROP COLUMN "typography_heading_source";
  ALTER TABLE "site_settings" DROP COLUMN "typography_heading_google_family";
  ALTER TABLE "site_settings" DROP COLUMN "typography_heading_file_id";
  DROP TYPE "public"."enum_site_settings_typography_body_source";
  DROP TYPE "public"."enum_site_settings_typography_body_google_family";
  DROP TYPE "public"."enum_site_settings_typography_heading_source";
  DROP TYPE "public"."enum_site_settings_typography_heading_google_family";`)
}
