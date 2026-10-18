import type { Field } from 'payload'

export const seoField = (): Field => ({
    name: 'seo',
    type: 'group',
    label: 'SEO',
    admin: { description: 'Semua opsional. Kosong = otomatis dari konten. '},
    fields: [
        { name: 'title', type: 'text', maxLength: 70, admin: { description: 'Ideal ≤ 60 karakter. Kosong = judul halaman.' } },
        { name: 'description', type: 'textarea', maxLength: 200, admin: { description: 'Ideal 120–160 karakter.' } },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Gambar share (OG), ideal 1200×630. Kosong = hero/cover.' } },
        { name: 'noIndex', type: 'checkbox', label: 'Sembunyikan dari mesin pencari (noindex)', defaultValue: false },
    ],
})