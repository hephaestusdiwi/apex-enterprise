import type { GlobalConfig } from "payload";
import { adminOnly } from '../access'
import { seoField } from '../fields/seo'

export const SiteSettings: GlobalConfig = {
    slug: 'site-settings',
    label: 'Site Settings',
    access: {
        read: () => true,
        update: adminOnly,
    },
    fields: [
        {
            name: 'siteName',
            type: 'text',
            required: true,
        },
        {
            name: 'logo',
            type: 'upload',
            relationTo: 'media',
            label: 'Logo',
            admin: {
                description: 'Opsional, kalau diisi header menampilkan logo dan menggantikan teks nama website',
            },
        },
        {
            name: 'photoSwipe',
            type: 'checkbox',
            label: 'Aktifkan PhotoSwipe',
            defaultValue: true,
            admin: {
                description: 'Kalau aktif, gambar di halaman project dan halaman biasa bisa di klik untuk dibuka',
            },
        },
        {
            name: 'navigation',
            type: 'array',
            label: { singular: 'Item', plural: 'Navigasi' },
            fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
            ],
        },
        {
            name: 'homeHero',
            type: 'group',
            label: 'Hero Home',
            fields: [
                {
                    name: 'video',
                    type: 'upload',
                    relationTo: 'videos',
                    admin: { description: 'Opsional. Kalau diisi, dipakai sebagai latar hero (diputar tanpa suara, berulang).' },
                },
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    admin: { description: 'Gambar hero. Kalau ada video, gambar ini jadi poster (tampil sebelum video main dan saat reduced motion).'},
                },
                { name: 'heading', type: 'text' },
                { name: 'tagline', type: 'textarea' },
            ],
        },
        {
            name: 'instagramUrl',
            type: 'text',
            label: 'URL Instagram',
            validate: (value?: string | null) =>
                !value || /^https?:\/\//i.test(value) || 'Harus diawali https://',
        },
        seoField(),
    ],
}
