import type { Block } from 'payload'
import { richTextEditor } from '../fields/richText'
import { layoutField } from '../fields/layout'

export const TextBlock: Block = {
    slug: 'text',
    interfaceName: 'TextBlock',
    labels: { singular: 'Text', plural: 'Text' },
    fields: [
        {
            name: 'body',
            type: 'richText',
            required: true,
            editor: richTextEditor(),
        },
        layoutField(),
    ],
}