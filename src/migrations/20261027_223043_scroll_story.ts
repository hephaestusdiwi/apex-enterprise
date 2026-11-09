import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_projects_blocks_scroll_story_preset" AS ENUM('cinematic', 'split', 'sticky');
  CREATE TYPE "public"."enum_projects_blocks_scroll_story_animation" AS ENUM('auto', 'none', 'fade', 'reveal', 'zoom', 'parallax');
  CREATE TYPE "public"."enum_projects_blocks_scroll_story_text_position" AS ENUM('bottom', 'center');
  CREATE TYPE "public"."enum_projects_blocks_scroll_story_overlay" AS ENUM('soft', 'medium', 'strong');
  CREATE TYPE "public"."enum_projects_blocks_scroll_story_media_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_projects_blocks_scroll_story_sticky_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_projects_blocks_scroll_story_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_projects_blocks_scroll_story_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_projects_blocks_scroll_story_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__projects_v_blocks_scroll_story_preset" AS ENUM('cinematic', 'split', 'sticky');
  CREATE TYPE "public"."enum__projects_v_blocks_scroll_story_animation" AS ENUM('auto', 'none', 'fade', 'reveal', 'zoom', 'parallax');
  CREATE TYPE "public"."enum__projects_v_blocks_scroll_story_text_position" AS ENUM('bottom', 'center');
  CREATE TYPE "public"."enum__projects_v_blocks_scroll_story_overlay" AS ENUM('soft', 'medium', 'strong');
  CREATE TYPE "public"."enum__projects_v_blocks_scroll_story_media_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__projects_v_blocks_scroll_story_sticky_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__projects_v_blocks_scroll_story_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__projects_v_blocks_scroll_story_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__projects_v_blocks_scroll_story_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_scroll_story_preset" AS ENUM('cinematic', 'split', 'sticky');
  CREATE TYPE "public"."enum_pages_blocks_scroll_story_animation" AS ENUM('auto', 'none', 'fade', 'reveal', 'zoom', 'parallax');
  CREATE TYPE "public"."enum_pages_blocks_scroll_story_text_position" AS ENUM('bottom', 'center');
  CREATE TYPE "public"."enum_pages_blocks_scroll_story_overlay" AS ENUM('soft', 'medium', 'strong');
  CREATE TYPE "public"."enum_pages_blocks_scroll_story_media_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_scroll_story_sticky_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_scroll_story_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_scroll_story_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_scroll_story_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_scroll_story_preset" AS ENUM('cinematic', 'split', 'sticky');
  CREATE TYPE "public"."enum__pages_v_blocks_scroll_story_animation" AS ENUM('auto', 'none', 'fade', 'reveal', 'zoom', 'parallax');
  CREATE TYPE "public"."enum__pages_v_blocks_scroll_story_text_position" AS ENUM('bottom', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_scroll_story_overlay" AS ENUM('soft', 'medium', 'strong');
  CREATE TYPE "public"."enum__pages_v_blocks_scroll_story_media_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_scroll_story_sticky_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_scroll_story_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_scroll_story_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_scroll_story_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_scroll_story_preset" AS ENUM('cinematic', 'split', 'sticky');
  CREATE TYPE "public"."enum_posts_blocks_scroll_story_animation" AS ENUM('auto', 'none', 'fade', 'reveal', 'zoom', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_scroll_story_text_position" AS ENUM('bottom', 'center');
  CREATE TYPE "public"."enum_posts_blocks_scroll_story_overlay" AS ENUM('soft', 'medium', 'strong');
  CREATE TYPE "public"."enum_posts_blocks_scroll_story_media_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_posts_blocks_scroll_story_sticky_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_posts_blocks_scroll_story_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_scroll_story_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_scroll_story_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_scroll_story_preset" AS ENUM('cinematic', 'split', 'sticky');
  CREATE TYPE "public"."enum__posts_v_blocks_scroll_story_animation" AS ENUM('auto', 'none', 'fade', 'reveal', 'zoom', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_scroll_story_text_position" AS ENUM('bottom', 'center');
  CREATE TYPE "public"."enum__posts_v_blocks_scroll_story_overlay" AS ENUM('soft', 'medium', 'strong');
  CREATE TYPE "public"."enum__posts_v_blocks_scroll_story_media_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__posts_v_blocks_scroll_story_sticky_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__posts_v_blocks_scroll_story_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_scroll_story_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_scroll_story_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TABLE "projects_blocks_scroll_story_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer
  );
  CREATE TABLE "projects_blocks_scroll_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"preset" "enum_projects_blocks_scroll_story_preset" DEFAULT 'cinematic',
  	"animation" "enum_projects_blocks_scroll_story_animation" DEFAULT 'auto',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"video_id" integer,
  	"text_position" "enum_projects_blocks_scroll_story_text_position" DEFAULT 'bottom',
  	"overlay" "enum_projects_blocks_scroll_story_overlay" DEFAULT 'medium',
  	"media_side" "enum_projects_blocks_scroll_story_media_side" DEFAULT 'right',
  	"sticky_side" "enum_projects_blocks_scroll_story_sticky_side" DEFAULT 'left',
  	"layout_width" "enum_projects_blocks_scroll_story_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_scroll_story_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_scroll_story_layout_space_after" DEFAULT 'default',
  	"block_name" varchar
  );
  CREATE TABLE "_projects_v_blocks_scroll_story_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"_uuid" varchar
  );
  CREATE TABLE "_projects_v_blocks_scroll_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"preset" "enum__projects_v_blocks_scroll_story_preset" DEFAULT 'cinematic',
  	"animation" "enum__projects_v_blocks_scroll_story_animation" DEFAULT 'auto',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"video_id" integer,
  	"text_position" "enum__projects_v_blocks_scroll_story_text_position" DEFAULT 'bottom',
  	"overlay" "enum__projects_v_blocks_scroll_story_overlay" DEFAULT 'medium',
  	"media_side" "enum__projects_v_blocks_scroll_story_media_side" DEFAULT 'right',
  	"sticky_side" "enum__projects_v_blocks_scroll_story_sticky_side" DEFAULT 'left',
  	"layout_width" "enum__projects_v_blocks_scroll_story_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_scroll_story_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_scroll_story_layout_space_after" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE "pages_blocks_scroll_story_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer
  );
  CREATE TABLE "pages_blocks_scroll_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"preset" "enum_pages_blocks_scroll_story_preset" DEFAULT 'cinematic',
  	"animation" "enum_pages_blocks_scroll_story_animation" DEFAULT 'auto',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"video_id" integer,
  	"text_position" "enum_pages_blocks_scroll_story_text_position" DEFAULT 'bottom',
  	"overlay" "enum_pages_blocks_scroll_story_overlay" DEFAULT 'medium',
  	"media_side" "enum_pages_blocks_scroll_story_media_side" DEFAULT 'right',
  	"sticky_side" "enum_pages_blocks_scroll_story_sticky_side" DEFAULT 'left',
  	"layout_width" "enum_pages_blocks_scroll_story_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_scroll_story_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_scroll_story_layout_space_after" DEFAULT 'default',
  	"block_name" varchar
  );
  CREATE TABLE "_pages_v_blocks_scroll_story_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"_uuid" varchar
  );
  CREATE TABLE "_pages_v_blocks_scroll_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"preset" "enum__pages_v_blocks_scroll_story_preset" DEFAULT 'cinematic',
  	"animation" "enum__pages_v_blocks_scroll_story_animation" DEFAULT 'auto',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"video_id" integer,
  	"text_position" "enum__pages_v_blocks_scroll_story_text_position" DEFAULT 'bottom',
  	"overlay" "enum__pages_v_blocks_scroll_story_overlay" DEFAULT 'medium',
  	"media_side" "enum__pages_v_blocks_scroll_story_media_side" DEFAULT 'right',
  	"sticky_side" "enum__pages_v_blocks_scroll_story_sticky_side" DEFAULT 'left',
  	"layout_width" "enum__pages_v_blocks_scroll_story_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_scroll_story_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_scroll_story_layout_space_after" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE "posts_blocks_scroll_story_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer
  );
  CREATE TABLE "posts_blocks_scroll_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"preset" "enum_posts_blocks_scroll_story_preset" DEFAULT 'cinematic',
  	"animation" "enum_posts_blocks_scroll_story_animation" DEFAULT 'auto',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"video_id" integer,
  	"text_position" "enum_posts_blocks_scroll_story_text_position" DEFAULT 'bottom',
  	"overlay" "enum_posts_blocks_scroll_story_overlay" DEFAULT 'medium',
  	"media_side" "enum_posts_blocks_scroll_story_media_side" DEFAULT 'right',
  	"sticky_side" "enum_posts_blocks_scroll_story_sticky_side" DEFAULT 'left',
  	"layout_width" "enum_posts_blocks_scroll_story_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_scroll_story_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_scroll_story_layout_space_after" DEFAULT 'default',
  	"block_name" varchar
  );
  CREATE TABLE "_posts_v_blocks_scroll_story_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"_uuid" varchar
  );
  CREATE TABLE "_posts_v_blocks_scroll_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"preset" "enum__posts_v_blocks_scroll_story_preset" DEFAULT 'cinematic',
  	"animation" "enum__posts_v_blocks_scroll_story_animation" DEFAULT 'auto',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"media_id" integer,
  	"video_id" integer,
  	"text_position" "enum__posts_v_blocks_scroll_story_text_position" DEFAULT 'bottom',
  	"overlay" "enum__posts_v_blocks_scroll_story_overlay" DEFAULT 'medium',
  	"media_side" "enum__posts_v_blocks_scroll_story_media_side" DEFAULT 'right',
  	"sticky_side" "enum__posts_v_blocks_scroll_story_sticky_side" DEFAULT 'left',
  	"layout_width" "enum__posts_v_blocks_scroll_story_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_scroll_story_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_scroll_story_layout_space_after" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  ALTER TABLE "projects_blocks_scroll_story_panels" ADD CONSTRAINT "projects_blocks_scroll_story_panels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_scroll_story_panels" ADD CONSTRAINT "projects_blocks_scroll_story_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_scroll_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_scroll_story" ADD CONSTRAINT "projects_blocks_scroll_story_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_scroll_story" ADD CONSTRAINT "projects_blocks_scroll_story_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_scroll_story" ADD CONSTRAINT "projects_blocks_scroll_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_scroll_story_panels" ADD CONSTRAINT "_projects_v_blocks_scroll_story_panels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_scroll_story_panels" ADD CONSTRAINT "_projects_v_blocks_scroll_story_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_scroll_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_scroll_story" ADD CONSTRAINT "_projects_v_blocks_scroll_story_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_scroll_story" ADD CONSTRAINT "_projects_v_blocks_scroll_story_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_scroll_story" ADD CONSTRAINT "_projects_v_blocks_scroll_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_scroll_story_panels" ADD CONSTRAINT "pages_blocks_scroll_story_panels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_scroll_story_panels" ADD CONSTRAINT "pages_blocks_scroll_story_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_scroll_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_scroll_story" ADD CONSTRAINT "pages_blocks_scroll_story_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_scroll_story" ADD CONSTRAINT "pages_blocks_scroll_story_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_scroll_story" ADD CONSTRAINT "pages_blocks_scroll_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_scroll_story_panels" ADD CONSTRAINT "_pages_v_blocks_scroll_story_panels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_scroll_story_panels" ADD CONSTRAINT "_pages_v_blocks_scroll_story_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_scroll_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_scroll_story" ADD CONSTRAINT "_pages_v_blocks_scroll_story_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_scroll_story" ADD CONSTRAINT "_pages_v_blocks_scroll_story_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_scroll_story" ADD CONSTRAINT "_pages_v_blocks_scroll_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_scroll_story_panels" ADD CONSTRAINT "posts_blocks_scroll_story_panels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_scroll_story_panels" ADD CONSTRAINT "posts_blocks_scroll_story_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_scroll_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_scroll_story" ADD CONSTRAINT "posts_blocks_scroll_story_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_scroll_story" ADD CONSTRAINT "posts_blocks_scroll_story_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_scroll_story" ADD CONSTRAINT "posts_blocks_scroll_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_scroll_story_panels" ADD CONSTRAINT "_posts_v_blocks_scroll_story_panels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_scroll_story_panels" ADD CONSTRAINT "_posts_v_blocks_scroll_story_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_scroll_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_scroll_story" ADD CONSTRAINT "_posts_v_blocks_scroll_story_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_scroll_story" ADD CONSTRAINT "_posts_v_blocks_scroll_story_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_scroll_story" ADD CONSTRAINT "_posts_v_blocks_scroll_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_blocks_scroll_story_panels_order_idx" ON "projects_blocks_scroll_story_panels" USING btree ("_order");
  CREATE INDEX "projects_blocks_scroll_story_panels_parent_id_idx" ON "projects_blocks_scroll_story_panels" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_scroll_story_panels_media_idx" ON "projects_blocks_scroll_story_panels" USING btree ("media_id");
  CREATE INDEX "projects_blocks_scroll_story_order_idx" ON "projects_blocks_scroll_story" USING btree ("_order");
  CREATE INDEX "projects_blocks_scroll_story_parent_id_idx" ON "projects_blocks_scroll_story" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_scroll_story_path_idx" ON "projects_blocks_scroll_story" USING btree ("_path");
  CREATE INDEX "projects_blocks_scroll_story_media_idx" ON "projects_blocks_scroll_story" USING btree ("media_id");
  CREATE INDEX "projects_blocks_scroll_story_video_idx" ON "projects_blocks_scroll_story" USING btree ("video_id");
  CREATE INDEX "_projects_v_blocks_scroll_story_panels_order_idx" ON "_projects_v_blocks_scroll_story_panels" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_scroll_story_panels_parent_id_idx" ON "_projects_v_blocks_scroll_story_panels" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_scroll_story_panels_media_idx" ON "_projects_v_blocks_scroll_story_panels" USING btree ("media_id");
  CREATE INDEX "_projects_v_blocks_scroll_story_order_idx" ON "_projects_v_blocks_scroll_story" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_scroll_story_parent_id_idx" ON "_projects_v_blocks_scroll_story" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_scroll_story_path_idx" ON "_projects_v_blocks_scroll_story" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_scroll_story_media_idx" ON "_projects_v_blocks_scroll_story" USING btree ("media_id");
  CREATE INDEX "_projects_v_blocks_scroll_story_video_idx" ON "_projects_v_blocks_scroll_story" USING btree ("video_id");
  CREATE INDEX "pages_blocks_scroll_story_panels_order_idx" ON "pages_blocks_scroll_story_panels" USING btree ("_order");
  CREATE INDEX "pages_blocks_scroll_story_panels_parent_id_idx" ON "pages_blocks_scroll_story_panels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_scroll_story_panels_media_idx" ON "pages_blocks_scroll_story_panels" USING btree ("media_id");
  CREATE INDEX "pages_blocks_scroll_story_order_idx" ON "pages_blocks_scroll_story" USING btree ("_order");
  CREATE INDEX "pages_blocks_scroll_story_parent_id_idx" ON "pages_blocks_scroll_story" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_scroll_story_path_idx" ON "pages_blocks_scroll_story" USING btree ("_path");
  CREATE INDEX "pages_blocks_scroll_story_media_idx" ON "pages_blocks_scroll_story" USING btree ("media_id");
  CREATE INDEX "pages_blocks_scroll_story_video_idx" ON "pages_blocks_scroll_story" USING btree ("video_id");
  CREATE INDEX "_pages_v_blocks_scroll_story_panels_order_idx" ON "_pages_v_blocks_scroll_story_panels" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_scroll_story_panels_parent_id_idx" ON "_pages_v_blocks_scroll_story_panels" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_scroll_story_panels_media_idx" ON "_pages_v_blocks_scroll_story_panels" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_scroll_story_order_idx" ON "_pages_v_blocks_scroll_story" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_scroll_story_parent_id_idx" ON "_pages_v_blocks_scroll_story" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_scroll_story_path_idx" ON "_pages_v_blocks_scroll_story" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_scroll_story_media_idx" ON "_pages_v_blocks_scroll_story" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_scroll_story_video_idx" ON "_pages_v_blocks_scroll_story" USING btree ("video_id");
  CREATE INDEX "posts_blocks_scroll_story_panels_order_idx" ON "posts_blocks_scroll_story_panels" USING btree ("_order");
  CREATE INDEX "posts_blocks_scroll_story_panels_parent_id_idx" ON "posts_blocks_scroll_story_panels" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_scroll_story_panels_media_idx" ON "posts_blocks_scroll_story_panels" USING btree ("media_id");
  CREATE INDEX "posts_blocks_scroll_story_order_idx" ON "posts_blocks_scroll_story" USING btree ("_order");
  CREATE INDEX "posts_blocks_scroll_story_parent_id_idx" ON "posts_blocks_scroll_story" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_scroll_story_path_idx" ON "posts_blocks_scroll_story" USING btree ("_path");
  CREATE INDEX "posts_blocks_scroll_story_media_idx" ON "posts_blocks_scroll_story" USING btree ("media_id");
  CREATE INDEX "posts_blocks_scroll_story_video_idx" ON "posts_blocks_scroll_story" USING btree ("video_id");
  CREATE INDEX "_posts_v_blocks_scroll_story_panels_order_idx" ON "_posts_v_blocks_scroll_story_panels" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_scroll_story_panels_parent_id_idx" ON "_posts_v_blocks_scroll_story_panels" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_scroll_story_panels_media_idx" ON "_posts_v_blocks_scroll_story_panels" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_scroll_story_order_idx" ON "_posts_v_blocks_scroll_story" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_scroll_story_parent_id_idx" ON "_posts_v_blocks_scroll_story" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_scroll_story_path_idx" ON "_posts_v_blocks_scroll_story" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_scroll_story_media_idx" ON "_posts_v_blocks_scroll_story" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_scroll_story_video_idx" ON "_posts_v_blocks_scroll_story" USING btree ("video_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "projects_blocks_scroll_story_panels" CASCADE;
  DROP TABLE "projects_blocks_scroll_story" CASCADE;
  DROP TABLE "_projects_v_blocks_scroll_story_panels" CASCADE;
  DROP TABLE "_projects_v_blocks_scroll_story" CASCADE;
  DROP TABLE "pages_blocks_scroll_story_panels" CASCADE;
  DROP TABLE "pages_blocks_scroll_story" CASCADE;
  DROP TABLE "_pages_v_blocks_scroll_story_panels" CASCADE;
  DROP TABLE "_pages_v_blocks_scroll_story" CASCADE;
  DROP TABLE "posts_blocks_scroll_story_panels" CASCADE;
  DROP TABLE "posts_blocks_scroll_story" CASCADE;
  DROP TABLE "_posts_v_blocks_scroll_story_panels" CASCADE;
  DROP TABLE "_posts_v_blocks_scroll_story" CASCADE;
  DROP TYPE "public"."enum_projects_blocks_scroll_story_preset";
  DROP TYPE "public"."enum_projects_blocks_scroll_story_animation";
  DROP TYPE "public"."enum_projects_blocks_scroll_story_text_position";
  DROP TYPE "public"."enum_projects_blocks_scroll_story_overlay";
  DROP TYPE "public"."enum_projects_blocks_scroll_story_media_side";
  DROP TYPE "public"."enum_projects_blocks_scroll_story_sticky_side";
  DROP TYPE "public"."enum_projects_blocks_scroll_story_layout_width";
  DROP TYPE "public"."enum_projects_blocks_scroll_story_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_scroll_story_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_scroll_story_preset";
  DROP TYPE "public"."enum__projects_v_blocks_scroll_story_animation";
  DROP TYPE "public"."enum__projects_v_blocks_scroll_story_text_position";
  DROP TYPE "public"."enum__projects_v_blocks_scroll_story_overlay";
  DROP TYPE "public"."enum__projects_v_blocks_scroll_story_media_side";
  DROP TYPE "public"."enum__projects_v_blocks_scroll_story_sticky_side";
  DROP TYPE "public"."enum__projects_v_blocks_scroll_story_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_scroll_story_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_scroll_story_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_scroll_story_preset";
  DROP TYPE "public"."enum_pages_blocks_scroll_story_animation";
  DROP TYPE "public"."enum_pages_blocks_scroll_story_text_position";
  DROP TYPE "public"."enum_pages_blocks_scroll_story_overlay";
  DROP TYPE "public"."enum_pages_blocks_scroll_story_media_side";
  DROP TYPE "public"."enum_pages_blocks_scroll_story_sticky_side";
  DROP TYPE "public"."enum_pages_blocks_scroll_story_layout_width";
  DROP TYPE "public"."enum_pages_blocks_scroll_story_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_scroll_story_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_scroll_story_preset";
  DROP TYPE "public"."enum__pages_v_blocks_scroll_story_animation";
  DROP TYPE "public"."enum__pages_v_blocks_scroll_story_text_position";
  DROP TYPE "public"."enum__pages_v_blocks_scroll_story_overlay";
  DROP TYPE "public"."enum__pages_v_blocks_scroll_story_media_side";
  DROP TYPE "public"."enum__pages_v_blocks_scroll_story_sticky_side";
  DROP TYPE "public"."enum__pages_v_blocks_scroll_story_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_scroll_story_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_scroll_story_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_scroll_story_preset";
  DROP TYPE "public"."enum_posts_blocks_scroll_story_animation";
  DROP TYPE "public"."enum_posts_blocks_scroll_story_text_position";
  DROP TYPE "public"."enum_posts_blocks_scroll_story_overlay";
  DROP TYPE "public"."enum_posts_blocks_scroll_story_media_side";
  DROP TYPE "public"."enum_posts_blocks_scroll_story_sticky_side";
  DROP TYPE "public"."enum_posts_blocks_scroll_story_layout_width";
  DROP TYPE "public"."enum_posts_blocks_scroll_story_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_scroll_story_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_scroll_story_preset";
  DROP TYPE "public"."enum__posts_v_blocks_scroll_story_animation";
  DROP TYPE "public"."enum__posts_v_blocks_scroll_story_text_position";
  DROP TYPE "public"."enum__posts_v_blocks_scroll_story_overlay";
  DROP TYPE "public"."enum__posts_v_blocks_scroll_story_media_side";
  DROP TYPE "public"."enum__posts_v_blocks_scroll_story_sticky_side";
  DROP TYPE "public"."enum__posts_v_blocks_scroll_story_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_scroll_story_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_scroll_story_layout_space_after";`)
}
