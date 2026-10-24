import type { Field, GlobalConfig, SelectFieldValidation, UploadFieldSingleValidation } from "payload";
import { adminOnly } from '../access'
import { seoField } from '../fields/seo'
import { FONT_MIME_TYPES, GOOGLE_FONT_OPTIONS, fontFormatOfMedia, isGoogleFontKey } from '../lib/fonts'

type FontSiblings = { source?: string | null }

const validateGoogleFamily: SelectFieldValidation = (value, { siblingData }) =>
    (siblingData as FontSiblings | undefined)?.source !== 'google' || isGoogleFontKey(value) || 'Pilih keluarga font dari daftar.'

/** Sumber upload: file harus ada di Media dan benar-benar font .woff2/.woff (bukan gambar atau file lain). */
const validateFontFile: UploadFieldSingleValidation = async (value, { siblingData, req }) => {
    if ((siblingData as FontSiblings | undefined)?.source !== 'upload') return true
    const id = value && typeof value === 'object' ? (value as { id?: unknown }).id : value
    if (typeof id !== 'number' && typeof id !== 'string') return 'Pilih file font yang sudah diunggah ke Media.'
    const media = await req.payload.findByID({ collection: 'media', id, depth: 0, req }).catch(() => null)
    if (!media) return 'File font tidak ditemukan di Media.'
    return fontFormatOfMedia(media) !== null || 'File harus berformat font .woff2 atau .woff.'
}

/** Satu peran font (body / heading): sumber, keluarga Google Fonts, atau file upload dari Media. */
const fontRoleField = (name: 'body' | 'heading', label: string, description: string): Field => ({
    name,
    type: 'group',
    label,
    admin: { description },
    fields: [
        {
            name: 'source',
            type: 'select',
            label: 'Font',
            defaultValue: 'default',
            options: [
                { label: 'Bawaan (Poppins)', value: 'default' },
                { label: 'Google Fonts', value: 'google' },
                { label: 'Upload sendiri', value: 'upload' },
            ],
        },
        {
            name: 'googleFamily',
            type: 'select',
            label: 'Keluarga font',
            options: GOOGLE_FONT_OPTIONS,
            admin: {
                condition: (_, siblingData) => siblingData?.source === 'google',
                description: 'Pilihan dibatasi pada daftar yang dikelola di kode.',
            },
            validate: validateGoogleFamily,
        },
        {
            name: 'file',
            type: 'upload',
            relationTo: 'media',
            label: 'File font',
            filterOptions: { mimeType: { in: FONT_MIME_TYPES } },
            admin: {
                condition: (_, siblingData) => siblingData?.source === 'upload',
                description: 'Unggah file .woff2 (disarankan) atau .woff ke Media, lalu pilih di sini.',
            },
            validate: validateFontFile,
        },
    ],
})

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
        {
            name: 'typography',
            type: 'group',
            label: 'Font Manager',
            admin: {
                description: 'Font untuk seluruh website (panel admin tidak terpengaruh). Kosong = tampilan bawan poppins. Heading yang tidak diatur mengikuti font Body.',
            },
            fields: [
                fontRoleField('body', 'Font Body', 'Teks isi, navigasi, form, dan elemen lain di luar heading.'),
                fontRoleField('heading', 'Font Heading', 'Judul (h1–h6).'),
            ],
        },
        seoField(),
    ],
}
