import type { Block } from 'payload'
import { layoutField } from '@/fields/layout'
import { isSafeHref } from '@/lib/href'
import { SOCIAL_OPTIONS } from '@/lib/socials'
import { sign } from 'crypto'

export const TeamBlock: Block = {
    slug: 'team',
    interfaceName: 'TeamBlock',
    labels: { singular: 'Team', plural: 'Team' },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Judul (opsional)',
            admin: { placeholder: 'Misalnya Tim Kami' },
        },
        {
            name: 'subtitle',
            type: 'textarea',
            label: 'Subjudul (opsional)',
        },
        {
            name: 'members',
            type: 'array',
            label: 'Anggota tim',
            labels: { singular: 'Anggota', plural: 'Anggota' },
            admin: {
                description: 'Tambahkan anggota satu persatu, kalau daftar kosong block ini tidak tersedia tampil di halaman',
                initCollapsed: true,
            },
            fields: [
                { name: 'photo', type: 'upload', relationTo: 'media', required: true, label: 'Foto' },
                {
                    type: 'row',
                    fields: [
                        { name: 'name', type: 'text', required: true, label: 'Nama', admin: { width: '50%' } },
                        { name: 'role', type: 'text', required: true, label: 'Posisi', admin: { width: '50%' } },
                    ],
                },
                {
                    name: 'bio',
                    type: 'textarea',
                    required: true,
                    label: 'Bio singkat',
                    maxLength: 280,
                    admin: { description: 'Maksimal 280 karakter'}
                },
                {
                    name: 'socials',
                    type: 'array',
                    label: { singular: 'Tautan', plural: 'Tautan' },
                    maxRows: 5,
                    admin: { initCollapsed: true },
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'platform',
                                    type: 'select',
                                    required: true,
                                    label: 'Platform',
                                    defaultValue: 'linkedin',
                                    options: SOCIAL_OPTIONS,
                                    admin: { width: '30%' },
                                },
                                {
                                    name: 'url',
                                    type: 'text',
                                    required: true,
                                    label: 'URL',
                                    admin: { width: '70%', placeholder: 'https://…' },
                                     validate: (value?: string | null) => {
                                        if (!value) return 'URL wajib diisi.'
                                        return isSafeHref(value) || 'Gunakan https://, mailto:, tel:, atau path yang diawali "/".'
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        layoutField(),
    ]
}