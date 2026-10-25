import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_status" AS ENUM('invited', 'active', 'disabled');
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "users" ADD COLUMN "status" "enum_users_status" DEFAULT 'active';
  ALTER TABLE "users" ADD COLUMN "invited_by_id" integer;
  ALTER TABLE "users" ADD COLUMN "invited_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "invite_expires_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "activated_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "role_changed_by_id" integer;
  ALTER TABLE "users" ADD COLUMN "role_changed_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "disabled_by_id" integer;
  ALTER TABLE "users" ADD COLUMN "disabled_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD CONSTRAINT "users_invited_by_id_users_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_role_changed_by_id_users_id_fk" FOREIGN KEY ("role_changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_disabled_by_id_users_id_fk" FOREIGN KEY ("disabled_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_status_idx" ON "users" USING btree ("status");
  CREATE INDEX "users_invited_by_idx" ON "users" USING btree ("invited_by_id");
  CREATE INDEX "users_role_changed_by_idx" ON "users" USING btree ("role_changed_by_id");
  CREATE INDEX "users_disabled_by_idx" ON "users" USING btree ("disabled_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP CONSTRAINT "users_invited_by_id_users_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_role_changed_by_id_users_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_disabled_by_id_users_id_fk";
  
  DROP INDEX "users_status_idx";
  DROP INDEX "users_invited_by_idx";
  DROP INDEX "users_role_changed_by_idx";
  DROP INDEX "users_disabled_by_idx";
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "status";
  ALTER TABLE "users" DROP COLUMN "invited_by_id";
  ALTER TABLE "users" DROP COLUMN "invited_at";
  ALTER TABLE "users" DROP COLUMN "invite_expires_at";
  ALTER TABLE "users" DROP COLUMN "activated_at";
  ALTER TABLE "users" DROP COLUMN "role_changed_by_id";
  ALTER TABLE "users" DROP COLUMN "role_changed_at";
  ALTER TABLE "users" DROP COLUMN "disabled_by_id";
  ALTER TABLE "users" DROP COLUMN "disabled_at";
  DROP TYPE "public"."enum_users_status";`)
}
