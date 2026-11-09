import type { Field } from 'payload'

const spacing = [
  { label: 'Default', value: 'default' },
  { label: 'None', value: 'none' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' },
]

type LayoutOptions = {
  /** false = sembunyikan pilihan motion lama (reveal/parallax), untuk block yang punya pengaturan animasi sendiri. */
  motion?: boolean
}

export const layoutField = ({ motion = true }: LayoutOptions = {}): Field => ({
  name: 'layout',
  type: 'group',
  label: 'Layout (opsional)',
  admin: { description: 'Biarkan "default" kalau tidak perlu menimpa layout block ini.' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          type: 'select',
          defaultValue: 'default',
          admin: { width: motion ? '25%' : '33%' },
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Narrow', value: 'narrow' },
            { label: 'Content', value: 'content' },
            { label: 'Wide', value: 'wide' },
            { label: 'Full', value: 'full' },
          ],
        },
        {
          name: 'spaceBefore',
          type: 'select',
          defaultValue: 'default',
          admin: { width: motion ? '25%' : '33%' },
          options: spacing,
        },
        {
          name: 'spaceAfter',
          type: 'select',
          defaultValue: 'default',
          admin: { width: motion ? '25%' : '33%' },
          options: spacing,
        },
        ...(motion
          ? [
              {
                name: 'motion',
                type: 'select' as const,
                defaultValue: 'default',
                admin: { width: '25%' },
                options: [
                  { label: 'Default', value: 'default' },
                  { label: 'None', value: 'none' },
                  { label: 'Reveal', value: 'reveal' },
                  { label: 'Parallax', value: 'parallax' },
                ],
              },
            ]
          : []),
      ],
    },
  ],
})