
import type { CollectionConfig } from 'payload'
import { adminOnly, publishedOrStaff, staffOnly } from '@/access'
import { projectBlocks } from '../blocks'
import { validateSlots } from '@/blocks/Slots'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { previewLinkEndpoint } from '../preview/endpoint'
import { afterDeleteCleanup, afterPublish, publishGate } from '../editorial/hooks'
import { use } from 'react'
import { sign } from 'crypto'

export const Projects: CollectionConfig = {
  slug: 'projects',
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt', 'preview'],
    // URL preview yang sebenarnya dibuat oleh endpoint /preview-link.
    preview: () => null,
    components: {
      edit: { PreviewButton: '/components/admin/PreviewButton#PreviewButton' },
    },
  },
  endpoints: [previewLinkEndpoint('projects')],
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
    beforeChange: [publishGate('projects')],
    afterChange: [afterPublish('projects')],
    afterDelete: [afterDeleteCleanup('projects')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'hero', type: 'upload', relationTo: 'media' },
    {
      name: 'home',
      type: 'group',
      label: 'Tampilan di Home',
      fields: [
        {
          name: 'cover',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Gambar di index home. Kosong = pakai hero.',
          },
        },
        {
          name: 'coverVideo',
          type: 'upload',
          relationTo: 'videos',
          admin: {
            description:
            'Opsional. Kalau diisi, tile di home memutar video ini (tanpa suara, berulang, hanya saat terlihat). Cover dipakai sebagai poster.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'size',
              type: 'select',
              defaultValue: 'medium',
              admin: { width: '50%' },
              options: [
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
                { label: 'Full', value: 'full' },
              ],
            },
            {
              name: 'align',
              type: 'select',
              label: 'Posisi crop',
              defaultValue: 'center',
              admin: {
                width: '50%',
                description:
                  'Bagian gambar yang dipertahankan saat di-crop. Center = ikuti focal point.',
              },
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'meta',
      type: 'array',
      label: { singular: 'Meta', plural: 'Meta' },
      admin: {
        description: 'Label bebas: Company, Role, Client, Location, dst',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: projectBlocks,
      validate: validateSlots,
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
    seoField(),
  ],
}
