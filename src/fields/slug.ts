import type { Field } from 'payload'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const slugify = (input: string): string =>
    input
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

export const slugField = (source = 'title'): Field => ({
    name: 'slug',
    type: 'text',
    unique: true,
    index: true,
    admin: {
        position: 'sidebar',
        description: 'Otomatis dari judul kalau di kosongkan',
    },
    hooks: {
        beforeValidate: [
            ({ value, data }) => {
                if (typeof value === 'string' && value.trim()) return slugify(value)
                const src = data?.[source]
                return typeof src === 'string' ? slugify(src) : value
            },
        ],
    },
    validate: (value?: string | null) => {
        if (!value) return 'Slug wajib diisi (isi judul dulu supaya otomatis)'
        return SLUG_RE.test(value) || 'Slug hanya huruf kecil, angka, dan tanda hubung'
    },
})