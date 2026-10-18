import type { Block } from 'payload'
import { layoutField } from '../fields/layout'

export const ImageBlock: Block = {
    slug: 'image',
    interfaceName: 'ImageBlock',
    labels: { singular: 'Image', plural: 'Image' },
    fields: [
        { name: 'media', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
        layoutField(),
    ],
}