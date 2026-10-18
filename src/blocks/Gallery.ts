import type { Block } from 'payload'
import { layoutField } from '../fields/layout'

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Gallery', plural: 'Gallery' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'grid-2',
      options: [
        { label: 'Grid 2 kolom', value: 'grid-2' },
        { label: 'Grid 3 kolom', value: 'grid-3' },
        { label: 'Staggered', value: 'staggered' },
        { label: 'Strip', value: 'strip' },
        { label: 'Apollon SmartFill', value: 'mosaic' },
      ],
    },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, required: true },
    layoutField(),
  ],
}