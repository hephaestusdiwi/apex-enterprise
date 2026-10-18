import type { Block } from 'payload'
import { layoutField } from '../fields/layout'
import { parseVideoUrl } from '../lib/video'

export const VideoBlock: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: { singular: 'Video', plural: 'Video' },
  fields: [
    {
      name: 'provider',
      type: 'select',
      required: true,
      defaultValue: 'vimeo',
      options: [
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'File (upload)', value: 'file' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Tempel URL halaman videonya (vimeo.com/... atau youtube.com/...).',
        condition: (_, siblingData) => siblingData?.provider !== 'file',
      },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: unknown }) => {
        if ((siblingData as { provider?: string } | undefined)?.provider === 'file') return true
        if (!value) return 'URL video wajib diisi.'
        return parseVideoUrl(value) ? true : 'URL Vimeo/YouTube tidak dikenali.'
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'videos',
      admin: {
        condition: (_, siblingData) => siblingData?.provider === 'file',
      },
      validate: (value: unknown, { siblingData }: { siblingData: unknown }) => {
        if ((siblingData as { provider?: string } | undefined)?.provider !== 'file') return true
        return value ? true : 'Pilih file video.'
      },
    },
    { name: 'caption', type: 'text' },
    layoutField(),
  ],
}