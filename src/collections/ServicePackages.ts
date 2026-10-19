import type { CollectionConfig } from 'payload'
import { adminOnly, publishedOrStaff, staffOnly } from '@/access'
import { slugField } from 'payload'
import { seoField } from '@/fields/seo'
import { tr } from 'payload/i18n/tr'

export const ServicePackages: CollectionConfig = {
    slug: 'service-packages',
    labels: { singular: 'Paket layanan', plural: 'Paket layanan' },
    orderable: true,
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'priceType', 'price', 'bookable', '_status'],
    },
    versions: { drafts: true, maxPerDoc: 10 },
    access: {
        read: publishedOrStaff,
        create: staffOnly,
        update: staffOnly,
        delete: adminOnly,
    },
    fields: [
        { name: 'title', type: 'text', required: true },
        slugField(),
        { name: 'tagline', type: 'text', maxLength: 160 },
        { name: 'description', type: 'textarea' },
        {
            type: 'row',
            fields: [
                {
                    name: 'priceType',
                    type: 'select',
                    required: true,
                    defaultValue: 'fixed',
                    admin: { width: '50%' },
                    options: [
                        { label: 'Harga tetap', value: 'fixed' },
                        { label: 'Mulai dari', value: 'from' },
                        { label: 'Hubungi untuk harga', value: 'custom' },
                    ],
                },
                {
                    name: 'price',
                    type: 'number',
                    min: 0,
                    admin: {
                        width: '50%',
                        description: 'Rupiah, tanpa titik',
                        condition: (data) => data?.priceType !== 'custom',
                    },
                     validate: (value: number | null | undefined, { siblingData }: { siblingData?: { priceType?: string } }) =>
                    siblingData?.priceType !== 'custom' && (value === null || value === undefined)
                    ? 'Harga wajib diisi'
                    : true,
                },
            ],
        },
        {
             name: 'priceNote', type: 'text', admin: { description: 'Contoh: per hari, per project' } },
        {
            name: 'features',
            type: 'array',
            label: { singular: 'Fitur', plural: 'Fitur' },
            fields: [{ name: 'text', type: 'text', required: true }],
        },
        { name: 'highlighted', type: 'checkbox', defaultValue: false, label: 'Tandai sebagai rekomendasi' },
        {
            name: 'bookable',
            type: 'checkbox',
            defaultValue: true,
            label: 'Booking tersedia',
            admin: { description: 'Dipakai wizard booking nanti '},
        },
        seoField(),
    ],
}