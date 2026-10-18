import type { Block } from 'payload'
import { layoutField } from '../fields/layout'
import { isSafeHref } from '../lib/href'

export const LinkBlock: Block = {
  slug: 'link',
  interfaceName: 'LinkBlock',
  labels: { singular: 'Link', plural: 'Link' },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'url',
      type: 'text',
      required: true,
      validate: (value?: string | null) => {
        if (!value) return 'URL wajib diisi.'
        return isSafeHref(value) || 'Gunakan https://, mailto:, tel:, atau path yang diawali "/".'
      },
    },
    { name: 'newTab', type: 'checkbox', defaultValue: false, label: 'Buka di tab baru' },
    layoutField(),
  ],
}