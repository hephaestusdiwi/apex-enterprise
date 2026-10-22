import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_blocks_heading_level" AS ENUM('h2', 'h3');
  CREATE TYPE "public"."enum_posts_blocks_heading_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_heading_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_heading_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_heading_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_image_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_image_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_image_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_image_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_image_text_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_posts_blocks_image_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_image_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_image_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_image_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_gallery_variant" AS ENUM('grid-2', 'grid-3', 'staggered', 'strip', 'mosaic');
  CREATE TYPE "public"."enum_posts_blocks_gallery_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_gallery_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_gallery_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_gallery_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_video_provider" AS ENUM('vimeo', 'youtube', 'file');
  CREATE TYPE "public"."enum_posts_blocks_video_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_video_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_video_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_video_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_link_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_link_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_link_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_link_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_quote_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_quote_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_quote_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_quote_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_embed_aspect" AS ENUM('16-9', '4-3', '1-1', '21-9');
  CREATE TYPE "public"."enum_posts_blocks_embed_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_embed_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_embed_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_embed_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_list_style" AS ENUM('unordered', 'ordered');
  CREATE TYPE "public"."enum_posts_blocks_list_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_list_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_list_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_list_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_spacer_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_spacer_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_spacer_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_blocks_spacer_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_blocks_heading_level" AS ENUM('h2', 'h3');
  CREATE TYPE "public"."enum__posts_v_blocks_heading_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_heading_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_heading_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_heading_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_image_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_image_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_image_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_image_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_image_text_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__posts_v_blocks_image_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_image_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_image_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_image_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_gallery_variant" AS ENUM('grid-2', 'grid-3', 'staggered', 'strip', 'mosaic');
  CREATE TYPE "public"."enum__posts_v_blocks_gallery_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_gallery_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_gallery_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_gallery_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_video_provider" AS ENUM('vimeo', 'youtube', 'file');
  CREATE TYPE "public"."enum__posts_v_blocks_video_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_video_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_video_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_video_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_link_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_link_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_link_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_link_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_quote_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_quote_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_quote_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_quote_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_embed_aspect" AS ENUM('16-9', '4-3', '1-1', '21-9');
  CREATE TYPE "public"."enum__posts_v_blocks_embed_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_embed_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_embed_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_embed_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_list_style" AS ENUM('unordered', 'ordered');
  CREATE TYPE "public"."enum__posts_v_blocks_list_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_list_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_list_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_list_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_spacer_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_spacer_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_spacer_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_blocks_spacer_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_editorial_reviews_doc_collection" ADD VALUE IF NOT EXISTS 'posts';
  ALTER TYPE "public"."enum_editorial_notes_doc_collection" ADD VALUE IF NOT EXISTS 'posts';
  CREATE TABLE "post_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"level" "enum_posts_blocks_heading_level" DEFAULT 'h2',
  	"layout_width" "enum_posts_blocks_heading_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_heading_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_heading_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_heading_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"layout_width" "enum_posts_blocks_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_text_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"layout_width" "enum_posts_blocks_image_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_image_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_image_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_image_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"body" jsonb,
  	"image_side" "enum_posts_blocks_image_text_image_side" DEFAULT 'right',
  	"include_meta" boolean DEFAULT false,
  	"layout_width" "enum_posts_blocks_image_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_image_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_image_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_image_text_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_gallery_variant" DEFAULT 'grid-2',
  	"layout_width" "enum_posts_blocks_gallery_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_gallery_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_gallery_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_gallery_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"provider" "enum_posts_blocks_video_provider" DEFAULT 'vimeo',
  	"url" varchar,
  	"file_id" integer,
  	"caption" varchar,
  	"layout_width" "enum_posts_blocks_video_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_video_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_video_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_video_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"layout_width" "enum_posts_blocks_link_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_link_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_link_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_link_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"attribution" varchar,
  	"layout_width" "enum_posts_blocks_quote_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_quote_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_quote_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_quote_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"aspect" "enum_posts_blocks_embed_aspect" DEFAULT '16-9',
  	"layout_width" "enum_posts_blocks_embed_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_embed_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_embed_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_embed_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "posts_blocks_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_posts_blocks_list_style" DEFAULT 'unordered',
  	"layout_width" "enum_posts_blocks_list_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_list_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_list_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_list_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_posts_blocks_spacer_size" DEFAULT 'md',
  	"layout_width" "enum_posts_blocks_spacer_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_posts_blocks_spacer_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_posts_blocks_spacer_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_posts_blocks_spacer_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"category_id" integer,
  	"author_name" varchar,
  	"published_at" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_posts_v_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"level" "enum__posts_v_blocks_heading_level" DEFAULT 'h2',
  	"layout_width" "enum__posts_v_blocks_heading_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_heading_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_heading_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_heading_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"layout_width" "enum__posts_v_blocks_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_text_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"layout_width" "enum__posts_v_blocks_image_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_image_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_image_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_image_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"body" jsonb,
  	"image_side" "enum__posts_v_blocks_image_text_image_side" DEFAULT 'right',
  	"include_meta" boolean DEFAULT false,
  	"layout_width" "enum__posts_v_blocks_image_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_image_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_image_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_image_text_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_gallery_variant" DEFAULT 'grid-2',
  	"layout_width" "enum__posts_v_blocks_gallery_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_gallery_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_gallery_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_gallery_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider" "enum__posts_v_blocks_video_provider" DEFAULT 'vimeo',
  	"url" varchar,
  	"file_id" integer,
  	"caption" varchar,
  	"layout_width" "enum__posts_v_blocks_video_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_video_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_video_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_video_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"layout_width" "enum__posts_v_blocks_link_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_link_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_link_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_link_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"attribution" varchar,
  	"layout_width" "enum__posts_v_blocks_quote_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_quote_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_quote_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_quote_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"aspect" "enum__posts_v_blocks_embed_aspect" DEFAULT '16-9',
  	"layout_width" "enum__posts_v_blocks_embed_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_embed_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_embed_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_embed_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__posts_v_blocks_list_style" DEFAULT 'unordered',
  	"layout_width" "enum__posts_v_blocks_list_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_list_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_list_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_list_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__posts_v_blocks_spacer_size" DEFAULT 'md',
  	"layout_width" "enum__posts_v_blocks_spacer_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__posts_v_blocks_spacer_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__posts_v_blocks_spacer_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__posts_v_blocks_spacer_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_category_id" integer,
  	"version_author_name" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "posts_blocks_heading" ADD CONSTRAINT "posts_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_text" ADD CONSTRAINT "posts_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_image" ADD CONSTRAINT "posts_blocks_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_image" ADD CONSTRAINT "posts_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_image_text" ADD CONSTRAINT "posts_blocks_image_text_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_image_text" ADD CONSTRAINT "posts_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_gallery" ADD CONSTRAINT "posts_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_video" ADD CONSTRAINT "posts_blocks_video_file_id_videos_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_video" ADD CONSTRAINT "posts_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_link" ADD CONSTRAINT "posts_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_quote" ADD CONSTRAINT "posts_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_embed" ADD CONSTRAINT "posts_blocks_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_list_items" ADD CONSTRAINT "posts_blocks_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_list" ADD CONSTRAINT "posts_blocks_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_spacer" ADD CONSTRAINT "posts_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_heading" ADD CONSTRAINT "_posts_v_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_text" ADD CONSTRAINT "_posts_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_image" ADD CONSTRAINT "_posts_v_blocks_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_image" ADD CONSTRAINT "_posts_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_image_text" ADD CONSTRAINT "_posts_v_blocks_image_text_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_image_text" ADD CONSTRAINT "_posts_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_gallery" ADD CONSTRAINT "_posts_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_video" ADD CONSTRAINT "_posts_v_blocks_video_file_id_videos_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_video" ADD CONSTRAINT "_posts_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_link" ADD CONSTRAINT "_posts_v_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_quote" ADD CONSTRAINT "_posts_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_embed" ADD CONSTRAINT "_posts_v_blocks_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_list_items" ADD CONSTRAINT "_posts_v_blocks_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_list" ADD CONSTRAINT "_posts_v_blocks_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_spacer" ADD CONSTRAINT "_posts_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_post_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "post_categories_slug_idx" ON "post_categories" USING btree ("slug");
  CREATE INDEX "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
  CREATE INDEX "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
  CREATE INDEX "posts_blocks_heading_order_idx" ON "posts_blocks_heading" USING btree ("_order");
  CREATE INDEX "posts_blocks_heading_parent_id_idx" ON "posts_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_heading_path_idx" ON "posts_blocks_heading" USING btree ("_path");
  CREATE INDEX "posts_blocks_text_order_idx" ON "posts_blocks_text" USING btree ("_order");
  CREATE INDEX "posts_blocks_text_parent_id_idx" ON "posts_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_text_path_idx" ON "posts_blocks_text" USING btree ("_path");
  CREATE INDEX "posts_blocks_image_order_idx" ON "posts_blocks_image" USING btree ("_order");
  CREATE INDEX "posts_blocks_image_parent_id_idx" ON "posts_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_image_path_idx" ON "posts_blocks_image" USING btree ("_path");
  CREATE INDEX "posts_blocks_image_media_idx" ON "posts_blocks_image" USING btree ("media_id");
  CREATE INDEX "posts_blocks_image_text_order_idx" ON "posts_blocks_image_text" USING btree ("_order");
  CREATE INDEX "posts_blocks_image_text_parent_id_idx" ON "posts_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_image_text_path_idx" ON "posts_blocks_image_text" USING btree ("_path");
  CREATE INDEX "posts_blocks_image_text_media_idx" ON "posts_blocks_image_text" USING btree ("media_id");
  CREATE INDEX "posts_blocks_gallery_order_idx" ON "posts_blocks_gallery" USING btree ("_order");
  CREATE INDEX "posts_blocks_gallery_parent_id_idx" ON "posts_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_gallery_path_idx" ON "posts_blocks_gallery" USING btree ("_path");
  CREATE INDEX "posts_blocks_video_order_idx" ON "posts_blocks_video" USING btree ("_order");
  CREATE INDEX "posts_blocks_video_parent_id_idx" ON "posts_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_video_path_idx" ON "posts_blocks_video" USING btree ("_path");
  CREATE INDEX "posts_blocks_video_file_idx" ON "posts_blocks_video" USING btree ("file_id");
  CREATE INDEX "posts_blocks_link_order_idx" ON "posts_blocks_link" USING btree ("_order");
  CREATE INDEX "posts_blocks_link_parent_id_idx" ON "posts_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_link_path_idx" ON "posts_blocks_link" USING btree ("_path");
  CREATE INDEX "posts_blocks_quote_order_idx" ON "posts_blocks_quote" USING btree ("_order");
  CREATE INDEX "posts_blocks_quote_parent_id_idx" ON "posts_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_quote_path_idx" ON "posts_blocks_quote" USING btree ("_path");
  CREATE INDEX "posts_blocks_embed_order_idx" ON "posts_blocks_embed" USING btree ("_order");
  CREATE INDEX "posts_blocks_embed_parent_id_idx" ON "posts_blocks_embed" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_embed_path_idx" ON "posts_blocks_embed" USING btree ("_path");
  CREATE INDEX "posts_blocks_list_items_order_idx" ON "posts_blocks_list_items" USING btree ("_order");
  CREATE INDEX "posts_blocks_list_items_parent_id_idx" ON "posts_blocks_list_items" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_list_order_idx" ON "posts_blocks_list" USING btree ("_order");
  CREATE INDEX "posts_blocks_list_parent_id_idx" ON "posts_blocks_list" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_list_path_idx" ON "posts_blocks_list" USING btree ("_path");
  CREATE INDEX "posts_blocks_spacer_order_idx" ON "posts_blocks_spacer" USING btree ("_order");
  CREATE INDEX "posts_blocks_spacer_parent_id_idx" ON "posts_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_spacer_path_idx" ON "posts_blocks_spacer" USING btree ("_path");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_seo_seo_image_idx" ON "posts" USING btree ("seo_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_media_id_idx" ON "posts_rels" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_heading_order_idx" ON "_posts_v_blocks_heading" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_heading_parent_id_idx" ON "_posts_v_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_heading_path_idx" ON "_posts_v_blocks_heading" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_text_order_idx" ON "_posts_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_text_parent_id_idx" ON "_posts_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_text_path_idx" ON "_posts_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_image_order_idx" ON "_posts_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_image_parent_id_idx" ON "_posts_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_image_path_idx" ON "_posts_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_image_media_idx" ON "_posts_v_blocks_image" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_image_text_order_idx" ON "_posts_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_image_text_parent_id_idx" ON "_posts_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_image_text_path_idx" ON "_posts_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_image_text_media_idx" ON "_posts_v_blocks_image_text" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_gallery_order_idx" ON "_posts_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_gallery_parent_id_idx" ON "_posts_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_gallery_path_idx" ON "_posts_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_video_order_idx" ON "_posts_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_video_parent_id_idx" ON "_posts_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_video_path_idx" ON "_posts_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_video_file_idx" ON "_posts_v_blocks_video" USING btree ("file_id");
  CREATE INDEX "_posts_v_blocks_link_order_idx" ON "_posts_v_blocks_link" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_link_parent_id_idx" ON "_posts_v_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_link_path_idx" ON "_posts_v_blocks_link" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_quote_order_idx" ON "_posts_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_quote_parent_id_idx" ON "_posts_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_quote_path_idx" ON "_posts_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_embed_order_idx" ON "_posts_v_blocks_embed" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_embed_parent_id_idx" ON "_posts_v_blocks_embed" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_embed_path_idx" ON "_posts_v_blocks_embed" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_list_items_order_idx" ON "_posts_v_blocks_list_items" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_list_items_parent_id_idx" ON "_posts_v_blocks_list_items" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_list_order_idx" ON "_posts_v_blocks_list" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_list_parent_id_idx" ON "_posts_v_blocks_list" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_list_path_idx" ON "_posts_v_blocks_list" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_spacer_order_idx" ON "_posts_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_spacer_parent_id_idx" ON "_posts_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_spacer_path_idx" ON "_posts_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_image_idx" ON "_posts_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_media_id_idx" ON "_posts_v_rels" USING btree ("media_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "post_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_image_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_list_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_spacer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_heading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_image_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_list_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_spacer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "post_categories" CASCADE;
  DROP TABLE "posts_blocks_heading" CASCADE;
  DROP TABLE "posts_blocks_text" CASCADE;
  DROP TABLE "posts_blocks_image" CASCADE;
  DROP TABLE "posts_blocks_image_text" CASCADE;
  DROP TABLE "posts_blocks_gallery" CASCADE;
  DROP TABLE "posts_blocks_video" CASCADE;
  DROP TABLE "posts_blocks_link" CASCADE;
  DROP TABLE "posts_blocks_quote" CASCADE;
  DROP TABLE "posts_blocks_embed" CASCADE;
  DROP TABLE "posts_blocks_list_items" CASCADE;
  DROP TABLE "posts_blocks_list" CASCADE;
  DROP TABLE "posts_blocks_spacer" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_blocks_heading" CASCADE;
  DROP TABLE "_posts_v_blocks_text" CASCADE;
  DROP TABLE "_posts_v_blocks_image" CASCADE;
  DROP TABLE "_posts_v_blocks_image_text" CASCADE;
  DROP TABLE "_posts_v_blocks_gallery" CASCADE;
  DROP TABLE "_posts_v_blocks_video" CASCADE;
  DROP TABLE "_posts_v_blocks_link" CASCADE;
  DROP TABLE "_posts_v_blocks_quote" CASCADE;
  DROP TABLE "_posts_v_blocks_embed" CASCADE;
  DROP TABLE "_posts_v_blocks_list_items" CASCADE;
  DROP TABLE "_posts_v_blocks_list" CASCADE;
  DROP TABLE "_posts_v_blocks_spacer" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_post_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "editorial_reviews" ALTER COLUMN "doc_collection" SET DATA TYPE text;
  DROP TYPE "public"."enum_editorial_reviews_doc_collection";
  CREATE TYPE "public"."enum_editorial_reviews_doc_collection" AS ENUM('projects', 'pages');
  ALTER TABLE "editorial_reviews" ALTER COLUMN "doc_collection" SET DATA TYPE "public"."enum_editorial_reviews_doc_collection" USING "doc_collection"::"public"."enum_editorial_reviews_doc_collection";
  ALTER TABLE "editorial_notes" ALTER COLUMN "doc_collection" SET DATA TYPE text;
  DROP TYPE "public"."enum_editorial_notes_doc_collection";
  CREATE TYPE "public"."enum_editorial_notes_doc_collection" AS ENUM('projects', 'pages');
  ALTER TABLE "editorial_notes" ALTER COLUMN "doc_collection" SET DATA TYPE "public"."enum_editorial_notes_doc_collection" USING "doc_collection"::"public"."enum_editorial_notes_doc_collection";
  DROP INDEX "payload_locked_documents_rels_post_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "post_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  DROP TYPE "public"."enum_posts_blocks_heading_level";
  DROP TYPE "public"."enum_posts_blocks_heading_layout_width";
  DROP TYPE "public"."enum_posts_blocks_heading_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_heading_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_heading_layout_motion";
  DROP TYPE "public"."enum_posts_blocks_text_layout_width";
  DROP TYPE "public"."enum_posts_blocks_text_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_text_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_text_layout_motion";
  DROP TYPE "public"."enum_posts_blocks_image_layout_width";
  DROP TYPE "public"."enum_posts_blocks_image_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_image_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_image_layout_motion";
  DROP TYPE "public"."enum_posts_blocks_image_text_image_side";
  DROP TYPE "public"."enum_posts_blocks_image_text_layout_width";
  DROP TYPE "public"."enum_posts_blocks_image_text_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_image_text_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_image_text_layout_motion";
  DROP TYPE "public"."enum_posts_blocks_gallery_variant";
  DROP TYPE "public"."enum_posts_blocks_gallery_layout_width";
  DROP TYPE "public"."enum_posts_blocks_gallery_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_gallery_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_gallery_layout_motion";
  DROP TYPE "public"."enum_posts_blocks_video_provider";
  DROP TYPE "public"."enum_posts_blocks_video_layout_width";
  DROP TYPE "public"."enum_posts_blocks_video_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_video_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_video_layout_motion";
  DROP TYPE "public"."enum_posts_blocks_link_layout_width";
  DROP TYPE "public"."enum_posts_blocks_link_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_link_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_link_layout_motion";
  DROP TYPE "public"."enum_posts_blocks_quote_layout_width";
  DROP TYPE "public"."enum_posts_blocks_quote_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_quote_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_quote_layout_motion";
  DROP TYPE "public"."enum_posts_blocks_embed_aspect";
  DROP TYPE "public"."enum_posts_blocks_embed_layout_width";
  DROP TYPE "public"."enum_posts_blocks_embed_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_embed_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_embed_layout_motion";
  DROP TYPE "public"."enum_posts_blocks_list_style";
  DROP TYPE "public"."enum_posts_blocks_list_layout_width";
  DROP TYPE "public"."enum_posts_blocks_list_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_list_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_list_layout_motion";
  DROP TYPE "public"."enum_posts_blocks_spacer_size";
  DROP TYPE "public"."enum_posts_blocks_spacer_layout_width";
  DROP TYPE "public"."enum_posts_blocks_spacer_layout_space_before";
  DROP TYPE "public"."enum_posts_blocks_spacer_layout_space_after";
  DROP TYPE "public"."enum_posts_blocks_spacer_layout_motion";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_blocks_heading_level";
  DROP TYPE "public"."enum__posts_v_blocks_heading_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_heading_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_heading_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_heading_layout_motion";
  DROP TYPE "public"."enum__posts_v_blocks_text_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_text_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_text_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_text_layout_motion";
  DROP TYPE "public"."enum__posts_v_blocks_image_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_image_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_image_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_image_layout_motion";
  DROP TYPE "public"."enum__posts_v_blocks_image_text_image_side";
  DROP TYPE "public"."enum__posts_v_blocks_image_text_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_image_text_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_image_text_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_image_text_layout_motion";
  DROP TYPE "public"."enum__posts_v_blocks_gallery_variant";
  DROP TYPE "public"."enum__posts_v_blocks_gallery_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_gallery_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_gallery_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_gallery_layout_motion";
  DROP TYPE "public"."enum__posts_v_blocks_video_provider";
  DROP TYPE "public"."enum__posts_v_blocks_video_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_video_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_video_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_video_layout_motion";
  DROP TYPE "public"."enum__posts_v_blocks_link_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_link_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_link_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_link_layout_motion";
  DROP TYPE "public"."enum__posts_v_blocks_quote_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_quote_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_quote_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_quote_layout_motion";
  DROP TYPE "public"."enum__posts_v_blocks_embed_aspect";
  DROP TYPE "public"."enum__posts_v_blocks_embed_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_embed_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_embed_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_embed_layout_motion";
  DROP TYPE "public"."enum__posts_v_blocks_list_style";
  DROP TYPE "public"."enum__posts_v_blocks_list_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_list_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_list_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_list_layout_motion";
  DROP TYPE "public"."enum__posts_v_blocks_spacer_size";
  DROP TYPE "public"."enum__posts_v_blocks_spacer_layout_width";
  DROP TYPE "public"."enum__posts_v_blocks_spacer_layout_space_before";
  DROP TYPE "public"."enum__posts_v_blocks_spacer_layout_space_after";
  DROP TYPE "public"."enum__posts_v_blocks_spacer_layout_motion";
  DROP TYPE "public"."enum__posts_v_version_status";`)
}
