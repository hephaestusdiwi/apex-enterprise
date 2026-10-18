import type { GlobalConfig } from 'payload'
import { adminOnly, staffOnly } from '../access'

export const ContactSettings: GlobalConfig = {
    slug: 'contact-settings',
    label: 'Pengaturan Kontak',
    access: {
        read: staffOnly,
        update: adminOnly,
    },
    fields: [
        {
            name: 'spamProtection',
            type: 'checkbox',
            label: 'Perlindungan spam aktif',
            defaultValue: true,
        },
        {
            name: 'recipients',
            type: 'array',
            label: { singular: 'Email', plural: 'Email Penerima Notifikasi' },
            admin: { description: 'Setiap pesan kontak baru dikirim ke semua alamat di daftar ini' },
            fields: [{ name: 'email', type: 'email', required: true }],
        },
    ],
}
