import type { Block } from 'payload'
import { layoutField } from '../fields/layout'

export const ListBlock: Block = {
  slug: 'list',
  interfaceName: 'ListBlock',
  labels: { singular: 'List', plural: 'List' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'unordered',
      options: [
        { label: 'Bullet', value: 'unordered' },
        { label: 'Numbered', value: 'ordered' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Item', plural: 'Items' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    layoutField(),
  ],
}