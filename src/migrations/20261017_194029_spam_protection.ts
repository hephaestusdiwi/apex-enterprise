import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_contacts_status" ADD VALUE 'spam';
  ALTER TABLE "contacts" ADD COLUMN "spam_score" numeric DEFAULT 0;
  ALTER TABLE "contacts" ADD COLUMN "spam_reasons" varchar;
  ALTER TABLE "contacts" ADD COLUMN "ip_hash" varchar;
  CREATE INDEX "contacts_ip_hash_idx" ON "contacts" USING btree ("ip_hash");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contacts" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "contacts" ALTER COLUMN "status" SET DEFAULT 'new'::text;
  DROP TYPE "public"."enum_contacts_status";
  CREATE TYPE "public"."enum_contacts_status" AS ENUM('new', 'read', 'archived');
  ALTER TABLE "contacts" ALTER COLUMN "status" SET DEFAULT 'new'::"public"."enum_contacts_status";
  ALTER TABLE "contacts" ALTER COLUMN "status" SET DATA TYPE "public"."enum_contacts_status" USING "status"::"public"."enum_contacts_status";
  DROP INDEX "contacts_ip_hash_idx";
  ALTER TABLE "contacts" DROP COLUMN "spam_score";
  ALTER TABLE "contacts" DROP COLUMN "spam_reasons";
  ALTER TABLE "contacts" DROP COLUMN "ip_hash";`)
}
