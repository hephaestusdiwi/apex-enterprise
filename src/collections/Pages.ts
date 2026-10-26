import type { CollectionConfig } from 'payload'
import { adminOnly, publishedOrStaff, staffOnly } from '../access'
import { pageBlocks } from '../blocks'
import { validateSlots } from '../blocks/Slots'
import { slugField } from '../fields/slug'
import { previewLinkEndpoint } from '../preview/endpoint'
import { afterDeleteCleanup, afterPublish, publishGate } from '../editorial/hooks'
import { seoField } from '../fields/seo'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt', 'preview'],
    // Wajib ada agar slot tombol Preview tampil. URL asli dibuat endpoint /preview-link (bertoken), bukan fungsi ini.
    preview: () => null,
    components: {
      edit: { PreviewButton: '/components/admin/PreviewButton#PreviewButton' },
    },
  },
  endpoints: [previewLinkEndpoint('pages')],
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
    // Workflow editorial: gerbang persetujuan, jejak publikasi, dan pembersihan catatan saat dokumen dihapus.
    beforeChange: [publishGate('pages')],
    afterChange: [afterPublish('pages')],
    afterDelete: [afterDeleteCleanup('pages')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul',
      required: true,
      admin: { placeholder: 'Tulis judul halaman di sini' },
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
      // Tab tanpa nama: path field tidak berubah, jadi tidak perlu migrasi database.
      type: 'tabs',
      tabs: [
        {
          label: 'Isi halaman',
          description: 'Susun isi halaman dari blok. Klik "Add" lalu pilih jenis blok yang dibutuhkan.',
          fields: [
            { name: 'blocks', type: 'blocks', label: 'Isi halaman', blocks: pageBlocks, validate: validateSlots },
          ],
        },
        {
          label: 'SEO & berbagi',
          description: 'Tampilan halaman di Google dan saat dibagikan. Semua opsional.',
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
