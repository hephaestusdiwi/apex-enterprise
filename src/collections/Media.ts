import type { CollectionConfig } from 'payload'
import { tr } from 'payload/i18n/tr'
import { adminOnly, staffOnly } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'filename',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'medium', width: 960 },
      { name: 'large', width: 1920 },
      { name: 'og', width: 1200, height: 630, fit: 'cover' },
    ],
  },
}