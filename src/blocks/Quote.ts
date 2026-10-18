import type { Block } from 'payload'
import { layoutField } from '../fields/layout'

export const QuoteBlock: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: { singular: 'Quote', plural: 'Quote' },
  fields: [
    { name: 'text', type: 'textarea', required: true },
    { name: 'attribution', type: 'text' },
    layoutField(),
  ],
}