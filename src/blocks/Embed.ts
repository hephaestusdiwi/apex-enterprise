import type { Block } from 'payload'
import { layoutField } from '../fields/layout'
import { EMBED_HOSTS, isAllowedEmbedUrl } from '../lib/embed'

export const EmbedBlock: Block = {
  slug: 'embed',
  interfaceName: 'EmbedBlock',
  labels: { singular: 'Embed', plural: 'Embed' },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: `URL iframe (https). Host yang diizinkan: ${EMBED_HOSTS.join(', ')}` },
      validate: (value?: string | null) => {
        if (!value) return 'URL embed wajib diisi.'
        return isAllowedEmbedUrl(value) || `Host tidak diizinkan. Boleh: ${EMBED_HOSTS.join(', ')}`
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Judul iframe untuk aksesibilitas.' },
    },
    {
      name: 'aspect',
      type: 'select',
      defaultValue: '16-9',
      options: [
        { label: '16:9', value: '16-9' },
        { label: '4:3', value: '4-3' },
        { label: '1:1', value: '1-1' },
        { label: '21:9', value: '21-9' },
      ],
    },
    layoutField(),
  ],
}