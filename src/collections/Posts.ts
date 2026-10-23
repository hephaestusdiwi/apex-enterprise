import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { adminOnly, publishedOrStaff, staffOnly } from '@/access'
import { postBlocks } from '../blocks'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { previewLinkEndpoint } from '../preview/endpoint'
import { afterDeleteCleanup, afterPublish, publishGate } from '../editorial/hooks'

/**
 * Tanggal terbit terisi otomatis saat artikel pertama kali dipublikasikan (termasuk lewat jadwal
 * publikasi). Nilai yang diisi editor dihormati; dikosongkan lalu dipublikasikan = diisi waktu sekarang.
 */
const fillPublishedAt: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (data?._status !== 'published') return data
  const current = 'publishedAt' in data ? data.publishedAt : originalDoc?.publishedAt
  if (current) return data
  return { ...data, publishedAt: new Date().toISOString() }
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Artikel', plural: 'Artikel' },
  admin: {
    group: 'Blog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt', 'preview'],
    // Wajib ada agar slot tombol Preview tampil. URL asli dibuat endpoint /preview-link (bertoken), bukan fungsi ini.
    preview: () => null,
    components: {
      edit: { PreviewButton: '/components/admin/PreviewButton#PreviewButton' },
    },
  },
  endpoints: [previewLinkEndpoint('posts')],
  versions: {
    // Jadwal publikasi bawaan Payload (tombol Publish > Schedule).
    drafts: { schedulePublish: { timeFormat: 'HH:mm', timeIntervals: 15 } },
    maxPerDoc: 25,
  },
  access: {
    read: publishedOrStaff,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  hooks: {
    // Gerbang persetujuan dulu; tanggal terbit hanya diisi bila publikasi memang diizinkan.
    beforeChange: [publishGate('posts'), fillPublishedAt],
    afterChange: [afterPublish('posts')],
    afterDelete: [afterDeleteCleanup('posts')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul',
      required: true,
      admin: { placeholder: 'Tulis judul artikel di sini' },
    },
    {
      // Kartu checklist di sidebar (tidak punya kolom database).
      name: 'checklist',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '/components/admin/EditorChecklist#EditorChecklist' },
      },
    },
    slugField(),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'post-categories',
      label: 'Kategori',
      admin: { position: 'sidebar' },
    },
    {
      name: 'authorName',
      type: 'text',
      label: 'Nama penulis',
      admin: { position: 'sidebar', description: 'Tampil di artikel. Kosong = tidak ditampilkan.' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Tanggal terbit',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Terisi otomatis saat pertama dipublikasikan. Boleh diubah.',
      },
    },
    {
      // Tab tanpa nama: path field tidak berubah, jadi tidak perlu migrasi database.
      type: 'tabs',
      tabs: [
        {
          label: 'Isi artikel',
          description: 'Tulis ringkasan, pilih gambar sampul, lalu susun isi artikel dari blok.',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Ringkasan',
              required: true,
              maxLength: 300,
              admin: {
                description: 'Satu-dua kalimat untuk kartu daftar artikel. Juga jadi deskripsi SEO bila kolom SEO dikosongkan.',
              },
            },
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              label: 'Gambar sampul',
              admin: { description: 'Tampil di kartu dan di atas artikel. Kosong = artikel tampil tanpa gambar.' },
            },
            { name: 'blocks', type: 'blocks', label: 'Isi artikel', blocks: postBlocks },
          ],
        },
        {
          label: 'SEO & berbagi',
          description: 'Tampilan artikel di Google dan saat dibagikan. Semua opsional.',
          fields: [seoField()],
        },
      ],
    },
    {
      name: 'preview',
      type: 'ui',
      label: 'Preview',
      admin: { components: { Cell: '/components/admin/PreviewCell#PreviewCell' } },
    },
    {
      name: 'editorial',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '/components/admin/EditorialPanel#EditorialPanel' },
      },
    },
  ],
}
