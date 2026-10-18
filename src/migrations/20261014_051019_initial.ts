// Migrasi awal (baseline). Semua statement dibuat idempotent (IF NOT EXISTS / EXCEPTION duplicate_object)
// supaya aman dijalankan di database baru maupun di database lama yang schema-nya dibuat lewat dev push.
// File .json dengan nama sama adalah snapshot schema untuk `payload migrate:create` berikutnya; jangan dihapus.
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
DO $$ BEGIN
    CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_heading_level" AS ENUM('h2', 'h3');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_heading_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_heading_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_heading_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_heading_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_image_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_image_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_image_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_image_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_image_text_image_side" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_image_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_image_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_image_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_image_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_gallery_variant" AS ENUM('grid-2', 'grid-3', 'staggered', 'strip', 'mosaic');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_gallery_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_gallery_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_gallery_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_gallery_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_video_provider" AS ENUM('vimeo', 'youtube', 'file');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_video_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_video_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_video_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_video_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_link_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_link_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_link_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_link_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_quote_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_quote_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_quote_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_quote_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_embed_aspect" AS ENUM('16-9', '4-3', '1-1', '21-9');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_embed_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_embed_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_embed_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_embed_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_list_style" AS ENUM('unordered', 'ordered');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_list_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_list_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_list_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_list_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_spacer_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_spacer_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_spacer_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_spacer_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_title_slot_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_title_slot_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_title_slot_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_title_slot_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_meta_slot_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_meta_slot_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_meta_slot_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_blocks_meta_slot_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_home_size" AS ENUM('small', 'medium', 'large', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_home_align" AS ENUM('left', 'center', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_heading_level" AS ENUM('h2', 'h3');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_heading_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_heading_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_heading_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_heading_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_image_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_image_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_image_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_image_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_image_text_image_side" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_image_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_image_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_image_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_image_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_gallery_variant" AS ENUM('grid-2', 'grid-3', 'staggered', 'strip', 'mosaic');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_gallery_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_gallery_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_gallery_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_gallery_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_video_provider" AS ENUM('vimeo', 'youtube', 'file');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_video_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_video_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_video_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_video_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_link_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_link_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_link_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_link_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_quote_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_quote_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_quote_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_quote_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_embed_aspect" AS ENUM('16-9', '4-3', '1-1', '21-9');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_embed_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_embed_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_embed_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_embed_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_list_style" AS ENUM('unordered', 'ordered');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_list_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_list_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_list_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_list_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_spacer_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_spacer_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_spacer_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_spacer_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_title_slot_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_title_slot_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_title_slot_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_title_slot_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_meta_slot_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_meta_slot_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_meta_slot_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_blocks_meta_slot_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_version_home_size" AS ENUM('small', 'medium', 'large', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_version_home_align" AS ENUM('left', 'center', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_heading_level" AS ENUM('h2', 'h3');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_heading_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_heading_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_heading_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_heading_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_image_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_image_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_image_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_image_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_image_text_image_side" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_image_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_image_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_image_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_image_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_gallery_variant" AS ENUM('grid-2', 'grid-3', 'staggered', 'strip', 'mosaic');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_gallery_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_gallery_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_gallery_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_gallery_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_video_provider" AS ENUM('vimeo', 'youtube', 'file');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_video_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_video_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_video_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_video_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_link_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_link_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_link_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_link_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_quote_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_quote_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_quote_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_quote_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_embed_aspect" AS ENUM('16-9', '4-3', '1-1', '21-9');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_embed_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_embed_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_embed_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_embed_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_list_style" AS ENUM('unordered', 'ordered');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_list_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_list_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_list_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_list_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_spacer_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_spacer_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_spacer_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_spacer_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_title_slot_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_title_slot_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_title_slot_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_title_slot_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_meta_slot_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_meta_slot_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_meta_slot_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_meta_slot_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_heading_level" AS ENUM('h2', 'h3');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_heading_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_heading_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_heading_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_heading_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_image_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_image_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_image_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_image_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_image_text_image_side" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_image_text_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_image_text_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_image_text_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_image_text_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_gallery_variant" AS ENUM('grid-2', 'grid-3', 'staggered', 'strip', 'mosaic');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_gallery_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_gallery_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_gallery_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_gallery_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_video_provider" AS ENUM('vimeo', 'youtube', 'file');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_video_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_video_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_video_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_video_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_link_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_link_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_link_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_link_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_quote_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_quote_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_quote_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_quote_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_embed_aspect" AS ENUM('16-9', '4-3', '1-1', '21-9');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_embed_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_embed_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_embed_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_embed_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_list_style" AS ENUM('unordered', 'ordered');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_list_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_list_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_list_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_list_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_spacer_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_spacer_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_spacer_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_spacer_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_title_slot_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_title_slot_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_title_slot_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_title_slot_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_meta_slot_layout_width" AS ENUM('default', 'narrow', 'content', 'wide', 'full');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_meta_slot_layout_space_before" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_meta_slot_layout_space_after" AS ENUM('default', 'none', 'sm', 'md', 'lg', 'xl');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_meta_slot_layout_motion" AS ENUM('default', 'none', 'reveal', 'parallax');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_contacts_status" AS ENUM('new', 'read', 'archived');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
      CREATE TYPE "public"."enum_visits_device" AS ENUM('desktop', 'mobile', 'tablet', 'other');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE TABLE IF NOT EXISTS "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "projects_meta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"level" "enum_projects_blocks_heading_level" DEFAULT 'h2',
  	"layout_width" "enum_projects_blocks_heading_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_heading_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_heading_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_heading_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"layout_width" "enum_projects_blocks_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_text_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"layout_width" "enum_projects_blocks_image_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_image_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_image_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_image_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"body" jsonb,
  	"image_side" "enum_projects_blocks_image_text_image_side" DEFAULT 'right',
  	"include_meta" boolean DEFAULT false,
  	"layout_width" "enum_projects_blocks_image_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_image_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_image_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_image_text_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_projects_blocks_gallery_variant" DEFAULT 'grid-2',
  	"layout_width" "enum_projects_blocks_gallery_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_gallery_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_gallery_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_gallery_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"provider" "enum_projects_blocks_video_provider" DEFAULT 'vimeo',
  	"url" varchar,
  	"file_id" integer,
  	"caption" varchar,
  	"layout_width" "enum_projects_blocks_video_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_video_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_video_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_video_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"layout_width" "enum_projects_blocks_link_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_link_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_link_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_link_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"attribution" varchar,
  	"layout_width" "enum_projects_blocks_quote_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_quote_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_quote_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_quote_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"aspect" "enum_projects_blocks_embed_aspect" DEFAULT '16-9',
  	"layout_width" "enum_projects_blocks_embed_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_embed_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_embed_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_embed_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_projects_blocks_list_style" DEFAULT 'unordered',
  	"layout_width" "enum_projects_blocks_list_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_list_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_list_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_list_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_projects_blocks_spacer_size" DEFAULT 'md',
  	"layout_width" "enum_projects_blocks_spacer_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_spacer_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_spacer_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_spacer_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_title_slot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_width" "enum_projects_blocks_title_slot_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_title_slot_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_title_slot_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_title_slot_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_blocks_meta_slot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_width" "enum_projects_blocks_meta_slot_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_projects_blocks_meta_slot_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_projects_blocks_meta_slot_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_projects_blocks_meta_slot_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"slug" varchar,
  	"hero_id" integer,
  	"home_cover_id" integer,
  	"home_cover_video_id" integer,
  	"home_size" "enum_projects_home_size" DEFAULT 'medium',
  	"home_align" "enum_projects_home_align" DEFAULT 'center',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_version_meta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"level" "enum__projects_v_blocks_heading_level" DEFAULT 'h2',
  	"layout_width" "enum__projects_v_blocks_heading_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_heading_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_heading_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_heading_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"layout_width" "enum__projects_v_blocks_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_text_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"layout_width" "enum__projects_v_blocks_image_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_image_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_image_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_image_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"body" jsonb,
  	"image_side" "enum__projects_v_blocks_image_text_image_side" DEFAULT 'right',
  	"include_meta" boolean DEFAULT false,
  	"layout_width" "enum__projects_v_blocks_image_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_image_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_image_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_image_text_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__projects_v_blocks_gallery_variant" DEFAULT 'grid-2',
  	"layout_width" "enum__projects_v_blocks_gallery_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_gallery_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_gallery_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_gallery_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider" "enum__projects_v_blocks_video_provider" DEFAULT 'vimeo',
  	"url" varchar,
  	"file_id" integer,
  	"caption" varchar,
  	"layout_width" "enum__projects_v_blocks_video_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_video_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_video_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_video_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"layout_width" "enum__projects_v_blocks_link_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_link_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_link_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_link_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"attribution" varchar,
  	"layout_width" "enum__projects_v_blocks_quote_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_quote_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_quote_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_quote_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"aspect" "enum__projects_v_blocks_embed_aspect" DEFAULT '16-9',
  	"layout_width" "enum__projects_v_blocks_embed_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_embed_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_embed_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_embed_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__projects_v_blocks_list_style" DEFAULT 'unordered',
  	"layout_width" "enum__projects_v_blocks_list_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_list_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_list_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_list_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__projects_v_blocks_spacer_size" DEFAULT 'md',
  	"layout_width" "enum__projects_v_blocks_spacer_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_spacer_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_spacer_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_spacer_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_title_slot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_width" "enum__projects_v_blocks_title_slot_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_title_slot_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_title_slot_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_title_slot_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_blocks_meta_slot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_width" "enum__projects_v_blocks_meta_slot_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__projects_v_blocks_meta_slot_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__projects_v_blocks_meta_slot_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__projects_v_blocks_meta_slot_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_hero_id" integer,
  	"version_home_cover_id" integer,
  	"version_home_cover_video_id" integer,
  	"version_home_size" "enum__projects_v_version_home_size" DEFAULT 'medium',
  	"version_home_align" "enum__projects_v_version_home_align" DEFAULT 'center',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"level" "enum_pages_blocks_heading_level" DEFAULT 'h2',
  	"layout_width" "enum_pages_blocks_heading_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_heading_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_heading_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_heading_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"layout_width" "enum_pages_blocks_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_text_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"layout_width" "enum_pages_blocks_image_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_image_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_image_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_image_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"body" jsonb,
  	"image_side" "enum_pages_blocks_image_text_image_side" DEFAULT 'right',
  	"include_meta" boolean DEFAULT false,
  	"layout_width" "enum_pages_blocks_image_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_image_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_image_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_image_text_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_gallery_variant" DEFAULT 'grid-2',
  	"layout_width" "enum_pages_blocks_gallery_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_gallery_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_gallery_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_gallery_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"provider" "enum_pages_blocks_video_provider" DEFAULT 'vimeo',
  	"url" varchar,
  	"file_id" integer,
  	"caption" varchar,
  	"layout_width" "enum_pages_blocks_video_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_video_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_video_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_video_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"layout_width" "enum_pages_blocks_link_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_link_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_link_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_link_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"attribution" varchar,
  	"layout_width" "enum_pages_blocks_quote_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_quote_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_quote_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_quote_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"aspect" "enum_pages_blocks_embed_aspect" DEFAULT '16-9',
  	"layout_width" "enum_pages_blocks_embed_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_embed_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_embed_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_embed_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_list_style" DEFAULT 'unordered',
  	"layout_width" "enum_pages_blocks_list_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_list_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_list_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_list_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_spacer_size" DEFAULT 'md',
  	"layout_width" "enum_pages_blocks_spacer_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_spacer_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_spacer_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_spacer_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_title_slot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_width" "enum_pages_blocks_title_slot_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_title_slot_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_title_slot_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_title_slot_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_meta_slot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_width" "enum_pages_blocks_meta_slot_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum_pages_blocks_meta_slot_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum_pages_blocks_meta_slot_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum_pages_blocks_meta_slot_layout_motion" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"level" "enum__pages_v_blocks_heading_level" DEFAULT 'h2',
  	"layout_width" "enum__pages_v_blocks_heading_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_heading_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_heading_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_heading_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"layout_width" "enum__pages_v_blocks_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_text_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"layout_width" "enum__pages_v_blocks_image_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_image_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_image_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_image_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"body" jsonb,
  	"image_side" "enum__pages_v_blocks_image_text_image_side" DEFAULT 'right',
  	"include_meta" boolean DEFAULT false,
  	"layout_width" "enum__pages_v_blocks_image_text_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_image_text_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_image_text_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_image_text_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_gallery_variant" DEFAULT 'grid-2',
  	"layout_width" "enum__pages_v_blocks_gallery_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_gallery_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_gallery_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_gallery_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider" "enum__pages_v_blocks_video_provider" DEFAULT 'vimeo',
  	"url" varchar,
  	"file_id" integer,
  	"caption" varchar,
  	"layout_width" "enum__pages_v_blocks_video_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_video_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_video_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_video_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"layout_width" "enum__pages_v_blocks_link_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_link_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_link_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_link_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"attribution" varchar,
  	"layout_width" "enum__pages_v_blocks_quote_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_quote_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_quote_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_quote_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"aspect" "enum__pages_v_blocks_embed_aspect" DEFAULT '16-9',
  	"layout_width" "enum__pages_v_blocks_embed_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_embed_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_embed_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_embed_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_list_style" DEFAULT 'unordered',
  	"layout_width" "enum__pages_v_blocks_list_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_list_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_list_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_list_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_spacer_size" DEFAULT 'md',
  	"layout_width" "enum__pages_v_blocks_spacer_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_spacer_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_spacer_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_spacer_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_title_slot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_width" "enum__pages_v_blocks_title_slot_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_title_slot_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_title_slot_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_title_slot_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_meta_slot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_width" "enum__pages_v_blocks_meta_slot_layout_width" DEFAULT 'default',
  	"layout_space_before" "enum__pages_v_blocks_meta_slot_layout_space_before" DEFAULT 'default',
  	"layout_space_after" "enum__pages_v_blocks_meta_slot_layout_space_after" DEFAULT 'default',
  	"layout_motion" "enum__pages_v_blocks_meta_slot_layout_motion" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_contacts_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "visits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar NOT NULL,
  	"referrer" varchar,
  	"device" "enum_visits_device",
  	"browser" varchar,
  	"os" varchar,
  	"country" varchar,
  	"visitor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"videos_id" integer,
  	"projects_id" integer,
  	"pages_id" integer,
  	"contacts_id" integer,
  	"visits_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"home_hero_video_id" integer,
  	"home_hero_image_id" integer,
  	"home_hero_heading" varchar,
  	"home_hero_tagline" varchar,
  	"instagram_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "contact_settings_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "contact_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
DO $$ BEGIN
    ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_meta" ADD CONSTRAINT "projects_meta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_heading" ADD CONSTRAINT "projects_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_text" ADD CONSTRAINT "projects_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_image" ADD CONSTRAINT "projects_blocks_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_image" ADD CONSTRAINT "projects_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_image_text" ADD CONSTRAINT "projects_blocks_image_text_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_image_text" ADD CONSTRAINT "projects_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_gallery" ADD CONSTRAINT "projects_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_video" ADD CONSTRAINT "projects_blocks_video_file_id_videos_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_video" ADD CONSTRAINT "projects_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_link" ADD CONSTRAINT "projects_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_quote" ADD CONSTRAINT "projects_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_embed" ADD CONSTRAINT "projects_blocks_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_list_items" ADD CONSTRAINT "projects_blocks_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_list"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_list" ADD CONSTRAINT "projects_blocks_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_spacer" ADD CONSTRAINT "projects_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_title_slot" ADD CONSTRAINT "projects_blocks_title_slot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_blocks_meta_slot" ADD CONSTRAINT "projects_blocks_meta_slot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects" ADD CONSTRAINT "projects_home_cover_id_media_id_fk" FOREIGN KEY ("home_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects" ADD CONSTRAINT "projects_home_cover_video_id_videos_id_fk" FOREIGN KEY ("home_cover_video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_version_meta" ADD CONSTRAINT "_projects_v_version_meta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_heading" ADD CONSTRAINT "_projects_v_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_text" ADD CONSTRAINT "_projects_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_image" ADD CONSTRAINT "_projects_v_blocks_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_image" ADD CONSTRAINT "_projects_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_image_text" ADD CONSTRAINT "_projects_v_blocks_image_text_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_image_text" ADD CONSTRAINT "_projects_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_gallery" ADD CONSTRAINT "_projects_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_video" ADD CONSTRAINT "_projects_v_blocks_video_file_id_videos_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_video" ADD CONSTRAINT "_projects_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_link" ADD CONSTRAINT "_projects_v_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_quote" ADD CONSTRAINT "_projects_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_embed" ADD CONSTRAINT "_projects_v_blocks_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_list_items" ADD CONSTRAINT "_projects_v_blocks_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_list"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_list" ADD CONSTRAINT "_projects_v_blocks_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_spacer" ADD CONSTRAINT "_projects_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_title_slot" ADD CONSTRAINT "_projects_v_blocks_title_slot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_blocks_meta_slot" ADD CONSTRAINT "_projects_v_blocks_meta_slot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_id_media_id_fk" FOREIGN KEY ("version_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_home_cover_id_media_id_fk" FOREIGN KEY ("version_home_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_home_cover_video_id_videos_id_fk" FOREIGN KEY ("version_home_cover_video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_heading" ADD CONSTRAINT "pages_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_file_id_videos_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_link" ADD CONSTRAINT "pages_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_quote" ADD CONSTRAINT "pages_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_embed" ADD CONSTRAINT "pages_blocks_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_list_items" ADD CONSTRAINT "pages_blocks_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_list"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_list" ADD CONSTRAINT "pages_blocks_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_title_slot" ADD CONSTRAINT "pages_blocks_title_slot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_blocks_meta_slot" ADD CONSTRAINT "pages_blocks_meta_slot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_heading" ADD CONSTRAINT "_pages_v_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_text" ADD CONSTRAINT "_pages_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_file_id_videos_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_link" ADD CONSTRAINT "_pages_v_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_quote" ADD CONSTRAINT "_pages_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_embed" ADD CONSTRAINT "_pages_v_blocks_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_list_items" ADD CONSTRAINT "_pages_v_blocks_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_list"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_list" ADD CONSTRAINT "_pages_v_blocks_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_title_slot" ADD CONSTRAINT "_pages_v_blocks_title_slot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_meta_slot" ADD CONSTRAINT "_pages_v_blocks_meta_slot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visits_fk" FOREIGN KEY ("visits_id") REFERENCES "public"."visits"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_home_hero_video_id_videos_id_fk" FOREIGN KEY ("home_hero_video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_home_hero_image_id_media_id_fk" FOREIGN KEY ("home_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE "contact_settings_recipients" ADD CONSTRAINT "contact_settings_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX IF NOT EXISTS "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "videos_filename_idx" ON "videos" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "projects_meta_order_idx" ON "projects_meta" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_meta_parent_id_idx" ON "projects_meta" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_heading_order_idx" ON "projects_blocks_heading" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_heading_parent_id_idx" ON "projects_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_heading_path_idx" ON "projects_blocks_heading" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_text_order_idx" ON "projects_blocks_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_text_parent_id_idx" ON "projects_blocks_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_text_path_idx" ON "projects_blocks_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_image_order_idx" ON "projects_blocks_image" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_image_parent_id_idx" ON "projects_blocks_image" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_image_path_idx" ON "projects_blocks_image" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_image_media_idx" ON "projects_blocks_image" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_image_text_order_idx" ON "projects_blocks_image_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_image_text_parent_id_idx" ON "projects_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_image_text_path_idx" ON "projects_blocks_image_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_image_text_media_idx" ON "projects_blocks_image_text" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_gallery_order_idx" ON "projects_blocks_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_gallery_parent_id_idx" ON "projects_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_gallery_path_idx" ON "projects_blocks_gallery" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_video_order_idx" ON "projects_blocks_video" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_video_parent_id_idx" ON "projects_blocks_video" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_video_path_idx" ON "projects_blocks_video" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_video_file_idx" ON "projects_blocks_video" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_link_order_idx" ON "projects_blocks_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_link_parent_id_idx" ON "projects_blocks_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_link_path_idx" ON "projects_blocks_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_quote_order_idx" ON "projects_blocks_quote" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_quote_parent_id_idx" ON "projects_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_quote_path_idx" ON "projects_blocks_quote" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_embed_order_idx" ON "projects_blocks_embed" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_embed_parent_id_idx" ON "projects_blocks_embed" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_embed_path_idx" ON "projects_blocks_embed" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_list_items_order_idx" ON "projects_blocks_list_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_list_items_parent_id_idx" ON "projects_blocks_list_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_list_order_idx" ON "projects_blocks_list" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_list_parent_id_idx" ON "projects_blocks_list" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_list_path_idx" ON "projects_blocks_list" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_spacer_order_idx" ON "projects_blocks_spacer" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_spacer_parent_id_idx" ON "projects_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_spacer_path_idx" ON "projects_blocks_spacer" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_title_slot_order_idx" ON "projects_blocks_title_slot" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_title_slot_parent_id_idx" ON "projects_blocks_title_slot" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_title_slot_path_idx" ON "projects_blocks_title_slot" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects_blocks_meta_slot_order_idx" ON "projects_blocks_meta_slot" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_blocks_meta_slot_parent_id_idx" ON "projects_blocks_meta_slot" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_blocks_meta_slot_path_idx" ON "projects_blocks_meta_slot" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE UNIQUE INDEX IF NOT EXISTS "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "projects_hero_idx" ON "projects" USING btree ("hero_id");
  CREATE INDEX IF NOT EXISTS "projects_home_home_cover_idx" ON "projects" USING btree ("home_cover_id");
  CREATE INDEX IF NOT EXISTS "projects_home_home_cover_video_idx" ON "projects" USING btree ("home_cover_video_id");
  CREATE INDEX IF NOT EXISTS "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_meta_order_idx" ON "_projects_v_version_meta" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_meta_parent_id_idx" ON "_projects_v_version_meta" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_heading_order_idx" ON "_projects_v_blocks_heading" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_heading_parent_id_idx" ON "_projects_v_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_heading_path_idx" ON "_projects_v_blocks_heading" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_text_order_idx" ON "_projects_v_blocks_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_text_parent_id_idx" ON "_projects_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_text_path_idx" ON "_projects_v_blocks_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_image_order_idx" ON "_projects_v_blocks_image" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_image_parent_id_idx" ON "_projects_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_image_path_idx" ON "_projects_v_blocks_image" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_image_media_idx" ON "_projects_v_blocks_image" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_image_text_order_idx" ON "_projects_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_image_text_parent_id_idx" ON "_projects_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_image_text_path_idx" ON "_projects_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_image_text_media_idx" ON "_projects_v_blocks_image_text" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_gallery_order_idx" ON "_projects_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_gallery_parent_id_idx" ON "_projects_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_gallery_path_idx" ON "_projects_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_video_order_idx" ON "_projects_v_blocks_video" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_video_parent_id_idx" ON "_projects_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_video_path_idx" ON "_projects_v_blocks_video" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_video_file_idx" ON "_projects_v_blocks_video" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_link_order_idx" ON "_projects_v_blocks_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_link_parent_id_idx" ON "_projects_v_blocks_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_link_path_idx" ON "_projects_v_blocks_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_quote_order_idx" ON "_projects_v_blocks_quote" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_quote_parent_id_idx" ON "_projects_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_quote_path_idx" ON "_projects_v_blocks_quote" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_embed_order_idx" ON "_projects_v_blocks_embed" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_embed_parent_id_idx" ON "_projects_v_blocks_embed" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_embed_path_idx" ON "_projects_v_blocks_embed" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_list_items_order_idx" ON "_projects_v_blocks_list_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_list_items_parent_id_idx" ON "_projects_v_blocks_list_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_list_order_idx" ON "_projects_v_blocks_list" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_list_parent_id_idx" ON "_projects_v_blocks_list" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_list_path_idx" ON "_projects_v_blocks_list" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_spacer_order_idx" ON "_projects_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_spacer_parent_id_idx" ON "_projects_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_spacer_path_idx" ON "_projects_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_title_slot_order_idx" ON "_projects_v_blocks_title_slot" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_title_slot_parent_id_idx" ON "_projects_v_blocks_title_slot" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_title_slot_path_idx" ON "_projects_v_blocks_title_slot" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_meta_slot_order_idx" ON "_projects_v_blocks_meta_slot" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_meta_slot_parent_id_idx" ON "_projects_v_blocks_meta_slot" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_blocks_meta_slot_path_idx" ON "_projects_v_blocks_meta_slot" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_version__order_idx" ON "_projects_v" USING btree ("version__order");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_version_hero_idx" ON "_projects_v" USING btree ("version_hero_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_home_version_home_cover_idx" ON "_projects_v" USING btree ("version_home_cover_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_home_version_home_cover_video_idx" ON "_projects_v" USING btree ("version_home_cover_video_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_heading_order_idx" ON "pages_blocks_heading" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_heading_parent_id_idx" ON "pages_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_heading_path_idx" ON "pages_blocks_heading" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_text_order_idx" ON "pages_blocks_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_text_parent_id_idx" ON "pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_text_path_idx" ON "pages_blocks_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_media_idx" ON "pages_blocks_image" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_text_order_idx" ON "pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_text_parent_id_idx" ON "pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_text_path_idx" ON "pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_text_media_idx" ON "pages_blocks_image_text" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_file_idx" ON "pages_blocks_video" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_link_order_idx" ON "pages_blocks_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_link_parent_id_idx" ON "pages_blocks_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_link_path_idx" ON "pages_blocks_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_quote_order_idx" ON "pages_blocks_quote" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_quote_parent_id_idx" ON "pages_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_quote_path_idx" ON "pages_blocks_quote" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_embed_order_idx" ON "pages_blocks_embed" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_embed_parent_id_idx" ON "pages_blocks_embed" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_embed_path_idx" ON "pages_blocks_embed" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_list_items_order_idx" ON "pages_blocks_list_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_list_items_parent_id_idx" ON "pages_blocks_list_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_list_order_idx" ON "pages_blocks_list" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_list_parent_id_idx" ON "pages_blocks_list" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_list_path_idx" ON "pages_blocks_list" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_title_slot_order_idx" ON "pages_blocks_title_slot" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_title_slot_parent_id_idx" ON "pages_blocks_title_slot" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_title_slot_path_idx" ON "pages_blocks_title_slot" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_meta_slot_order_idx" ON "pages_blocks_meta_slot" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_meta_slot_parent_id_idx" ON "pages_blocks_meta_slot" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_meta_slot_path_idx" ON "pages_blocks_meta_slot" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_order_idx" ON "_pages_v_blocks_heading" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_parent_id_idx" ON "_pages_v_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_path_idx" ON "_pages_v_blocks_heading" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_order_idx" ON "_pages_v_blocks_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_parent_id_idx" ON "_pages_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_path_idx" ON "_pages_v_blocks_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_order_idx" ON "_pages_v_blocks_image" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_parent_id_idx" ON "_pages_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_path_idx" ON "_pages_v_blocks_image" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_media_idx" ON "_pages_v_blocks_image" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_text_order_idx" ON "_pages_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_text_parent_id_idx" ON "_pages_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_text_path_idx" ON "_pages_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_text_media_idx" ON "_pages_v_blocks_image_text" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_file_idx" ON "_pages_v_blocks_video" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_link_order_idx" ON "_pages_v_blocks_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_link_parent_id_idx" ON "_pages_v_blocks_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_link_path_idx" ON "_pages_v_blocks_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quote_order_idx" ON "_pages_v_blocks_quote" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quote_parent_id_idx" ON "_pages_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quote_path_idx" ON "_pages_v_blocks_quote" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_embed_order_idx" ON "_pages_v_blocks_embed" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_embed_parent_id_idx" ON "_pages_v_blocks_embed" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_embed_path_idx" ON "_pages_v_blocks_embed" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_list_items_order_idx" ON "_pages_v_blocks_list_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_list_items_parent_id_idx" ON "_pages_v_blocks_list_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_list_order_idx" ON "_pages_v_blocks_list" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_list_parent_id_idx" ON "_pages_v_blocks_list" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_list_path_idx" ON "_pages_v_blocks_list" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_title_slot_order_idx" ON "_pages_v_blocks_title_slot" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_title_slot_parent_id_idx" ON "_pages_v_blocks_title_slot" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_title_slot_path_idx" ON "_pages_v_blocks_title_slot" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_meta_slot_order_idx" ON "_pages_v_blocks_meta_slot" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_meta_slot_parent_id_idx" ON "_pages_v_blocks_meta_slot" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_meta_slot_path_idx" ON "_pages_v_blocks_meta_slot" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "contacts_status_idx" ON "contacts" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "visits_path_idx" ON "visits" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "visits_visitor_idx" ON "visits" USING btree ("visitor");
  CREATE INDEX IF NOT EXISTS "visits_updated_at_idx" ON "visits" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "visits_created_at_idx" ON "visits" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_visits_id_idx" ON "payload_locked_documents_rels" USING btree ("visits_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "site_settings_home_hero_home_hero_video_idx" ON "site_settings" USING btree ("home_hero_video_id");
  CREATE INDEX IF NOT EXISTS "site_settings_home_hero_home_hero_image_idx" ON "site_settings" USING btree ("home_hero_image_id");
  CREATE INDEX IF NOT EXISTS "contact_settings_recipients_order_idx" ON "contact_settings_recipients" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "contact_settings_recipients_parent_id_idx" ON "contact_settings_recipients" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "projects_meta" CASCADE;
  DROP TABLE "projects_blocks_heading" CASCADE;
  DROP TABLE "projects_blocks_text" CASCADE;
  DROP TABLE "projects_blocks_image" CASCADE;
  DROP TABLE "projects_blocks_image_text" CASCADE;
  DROP TABLE "projects_blocks_gallery" CASCADE;
  DROP TABLE "projects_blocks_video" CASCADE;
  DROP TABLE "projects_blocks_link" CASCADE;
  DROP TABLE "projects_blocks_quote" CASCADE;
  DROP TABLE "projects_blocks_embed" CASCADE;
  DROP TABLE "projects_blocks_list_items" CASCADE;
  DROP TABLE "projects_blocks_list" CASCADE;
  DROP TABLE "projects_blocks_spacer" CASCADE;
  DROP TABLE "projects_blocks_title_slot" CASCADE;
  DROP TABLE "projects_blocks_meta_slot" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_meta" CASCADE;
  DROP TABLE "_projects_v_blocks_heading" CASCADE;
  DROP TABLE "_projects_v_blocks_text" CASCADE;
  DROP TABLE "_projects_v_blocks_image" CASCADE;
  DROP TABLE "_projects_v_blocks_image_text" CASCADE;
  DROP TABLE "_projects_v_blocks_gallery" CASCADE;
  DROP TABLE "_projects_v_blocks_video" CASCADE;
  DROP TABLE "_projects_v_blocks_link" CASCADE;
  DROP TABLE "_projects_v_blocks_quote" CASCADE;
  DROP TABLE "_projects_v_blocks_embed" CASCADE;
  DROP TABLE "_projects_v_blocks_list_items" CASCADE;
  DROP TABLE "_projects_v_blocks_list" CASCADE;
  DROP TABLE "_projects_v_blocks_spacer" CASCADE;
  DROP TABLE "_projects_v_blocks_title_slot" CASCADE;
  DROP TABLE "_projects_v_blocks_meta_slot" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "pages_blocks_heading" CASCADE;
  DROP TABLE "pages_blocks_text" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages_blocks_image_text" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_link" CASCADE;
  DROP TABLE "pages_blocks_quote" CASCADE;
  DROP TABLE "pages_blocks_embed" CASCADE;
  DROP TABLE "pages_blocks_list_items" CASCADE;
  DROP TABLE "pages_blocks_list" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages_blocks_title_slot" CASCADE;
  DROP TABLE "pages_blocks_meta_slot" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_heading" CASCADE;
  DROP TABLE "_pages_v_blocks_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_link" CASCADE;
  DROP TABLE "_pages_v_blocks_quote" CASCADE;
  DROP TABLE "_pages_v_blocks_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_list_items" CASCADE;
  DROP TABLE "_pages_v_blocks_list" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v_blocks_title_slot" CASCADE;
  DROP TABLE "_pages_v_blocks_meta_slot" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "visits" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "contact_settings_recipients" CASCADE;
  DROP TABLE "contact_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_projects_blocks_heading_level";
  DROP TYPE "public"."enum_projects_blocks_heading_layout_width";
  DROP TYPE "public"."enum_projects_blocks_heading_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_heading_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_heading_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_text_layout_width";
  DROP TYPE "public"."enum_projects_blocks_text_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_text_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_text_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_image_layout_width";
  DROP TYPE "public"."enum_projects_blocks_image_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_image_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_image_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_image_text_image_side";
  DROP TYPE "public"."enum_projects_blocks_image_text_layout_width";
  DROP TYPE "public"."enum_projects_blocks_image_text_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_image_text_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_image_text_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_gallery_variant";
  DROP TYPE "public"."enum_projects_blocks_gallery_layout_width";
  DROP TYPE "public"."enum_projects_blocks_gallery_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_gallery_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_gallery_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_video_provider";
  DROP TYPE "public"."enum_projects_blocks_video_layout_width";
  DROP TYPE "public"."enum_projects_blocks_video_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_video_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_video_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_link_layout_width";
  DROP TYPE "public"."enum_projects_blocks_link_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_link_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_link_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_quote_layout_width";
  DROP TYPE "public"."enum_projects_blocks_quote_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_quote_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_quote_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_embed_aspect";
  DROP TYPE "public"."enum_projects_blocks_embed_layout_width";
  DROP TYPE "public"."enum_projects_blocks_embed_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_embed_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_embed_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_list_style";
  DROP TYPE "public"."enum_projects_blocks_list_layout_width";
  DROP TYPE "public"."enum_projects_blocks_list_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_list_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_list_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_spacer_size";
  DROP TYPE "public"."enum_projects_blocks_spacer_layout_width";
  DROP TYPE "public"."enum_projects_blocks_spacer_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_spacer_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_spacer_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_title_slot_layout_width";
  DROP TYPE "public"."enum_projects_blocks_title_slot_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_title_slot_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_title_slot_layout_motion";
  DROP TYPE "public"."enum_projects_blocks_meta_slot_layout_width";
  DROP TYPE "public"."enum_projects_blocks_meta_slot_layout_space_before";
  DROP TYPE "public"."enum_projects_blocks_meta_slot_layout_space_after";
  DROP TYPE "public"."enum_projects_blocks_meta_slot_layout_motion";
  DROP TYPE "public"."enum_projects_home_size";
  DROP TYPE "public"."enum_projects_home_align";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_blocks_heading_level";
  DROP TYPE "public"."enum__projects_v_blocks_heading_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_heading_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_heading_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_heading_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_text_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_text_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_text_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_text_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_image_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_image_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_image_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_image_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_image_text_image_side";
  DROP TYPE "public"."enum__projects_v_blocks_image_text_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_image_text_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_image_text_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_image_text_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_gallery_variant";
  DROP TYPE "public"."enum__projects_v_blocks_gallery_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_gallery_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_gallery_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_gallery_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_video_provider";
  DROP TYPE "public"."enum__projects_v_blocks_video_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_video_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_video_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_video_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_link_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_link_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_link_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_link_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_quote_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_quote_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_quote_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_quote_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_embed_aspect";
  DROP TYPE "public"."enum__projects_v_blocks_embed_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_embed_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_embed_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_embed_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_list_style";
  DROP TYPE "public"."enum__projects_v_blocks_list_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_list_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_list_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_list_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_spacer_size";
  DROP TYPE "public"."enum__projects_v_blocks_spacer_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_spacer_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_spacer_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_spacer_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_title_slot_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_title_slot_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_title_slot_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_title_slot_layout_motion";
  DROP TYPE "public"."enum__projects_v_blocks_meta_slot_layout_width";
  DROP TYPE "public"."enum__projects_v_blocks_meta_slot_layout_space_before";
  DROP TYPE "public"."enum__projects_v_blocks_meta_slot_layout_space_after";
  DROP TYPE "public"."enum__projects_v_blocks_meta_slot_layout_motion";
  DROP TYPE "public"."enum__projects_v_version_home_size";
  DROP TYPE "public"."enum__projects_v_version_home_align";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_pages_blocks_heading_level";
  DROP TYPE "public"."enum_pages_blocks_heading_layout_width";
  DROP TYPE "public"."enum_pages_blocks_heading_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_heading_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_heading_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_text_layout_width";
  DROP TYPE "public"."enum_pages_blocks_text_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_text_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_text_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_image_layout_width";
  DROP TYPE "public"."enum_pages_blocks_image_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_image_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_image_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_image_text_image_side";
  DROP TYPE "public"."enum_pages_blocks_image_text_layout_width";
  DROP TYPE "public"."enum_pages_blocks_image_text_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_image_text_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_image_text_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_gallery_variant";
  DROP TYPE "public"."enum_pages_blocks_gallery_layout_width";
  DROP TYPE "public"."enum_pages_blocks_gallery_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_gallery_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_gallery_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_video_provider";
  DROP TYPE "public"."enum_pages_blocks_video_layout_width";
  DROP TYPE "public"."enum_pages_blocks_video_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_video_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_video_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_link_layout_width";
  DROP TYPE "public"."enum_pages_blocks_link_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_link_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_link_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_quote_layout_width";
  DROP TYPE "public"."enum_pages_blocks_quote_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_quote_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_quote_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_embed_aspect";
  DROP TYPE "public"."enum_pages_blocks_embed_layout_width";
  DROP TYPE "public"."enum_pages_blocks_embed_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_embed_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_embed_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_list_style";
  DROP TYPE "public"."enum_pages_blocks_list_layout_width";
  DROP TYPE "public"."enum_pages_blocks_list_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_list_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_list_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_spacer_size";
  DROP TYPE "public"."enum_pages_blocks_spacer_layout_width";
  DROP TYPE "public"."enum_pages_blocks_spacer_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_spacer_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_spacer_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_title_slot_layout_width";
  DROP TYPE "public"."enum_pages_blocks_title_slot_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_title_slot_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_title_slot_layout_motion";
  DROP TYPE "public"."enum_pages_blocks_meta_slot_layout_width";
  DROP TYPE "public"."enum_pages_blocks_meta_slot_layout_space_before";
  DROP TYPE "public"."enum_pages_blocks_meta_slot_layout_space_after";
  DROP TYPE "public"."enum_pages_blocks_meta_slot_layout_motion";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_heading_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_heading_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_heading_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_heading_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_text_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_text_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_text_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_text_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_image_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_image_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_image_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_image_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_image_side";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_variant";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_video_provider";
  DROP TYPE "public"."enum__pages_v_blocks_video_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_video_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_video_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_video_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_link_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_link_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_link_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_link_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_quote_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_quote_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_quote_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_quote_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_embed_aspect";
  DROP TYPE "public"."enum__pages_v_blocks_embed_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_embed_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_embed_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_embed_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_list_style";
  DROP TYPE "public"."enum__pages_v_blocks_list_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_list_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_list_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_list_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_size";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_title_slot_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_title_slot_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_title_slot_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_title_slot_layout_motion";
  DROP TYPE "public"."enum__pages_v_blocks_meta_slot_layout_width";
  DROP TYPE "public"."enum__pages_v_blocks_meta_slot_layout_space_before";
  DROP TYPE "public"."enum__pages_v_blocks_meta_slot_layout_space_after";
  DROP TYPE "public"."enum__pages_v_blocks_meta_slot_layout_motion";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_contacts_status";
  DROP TYPE "public"."enum_visits_device";`)
}
