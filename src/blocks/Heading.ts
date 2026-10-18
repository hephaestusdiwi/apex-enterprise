import type { Block } from 'payload'
import { layoutField } from '../fields/layout'

export const HeadingBlock: Block = {
    slug: 'heading',
    interfaceName: 'HeadingBlock',
    labels: { singular: 'Heading', plural: 'Heading' },
    fields: [
        { name: 'text', type: 'text', required: true },
        {
            name: 'level',
            type: 'select',
            defaultValue: 'h2',
            options: [
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
            ],
        },
        layoutField(),
    ],
}