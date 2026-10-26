import type { CollectionBeforeChangeHook, Field } from 'payload'
import { FOLLOW_UP_OPTIONS, resolveFollowUp } from '@/lib/followUp'

export const followUpField = (): Field => ({
    name: 'followUp',
    type: 'group',
    label: 'follow-up prospek',
    admin: { position: 'sidebar' },
    fields: [
        {
            name: 'status',
            type: 'select',
            label: 'Status follow up',
            options: FOLLOW_UP_OPTIONS,
            admin: {
                description: 'Data masuk baru otomatis "Baru", Kosong berarti data lama yang belum diatur',
                components: { Cell: '/components/admin/StatusCell#StatusCell' },
            },
        },
        {
            name: 'notes',
            type: 'textarea',
            label: 'Catatan follow-up',
            maxLength: 2000,
            admin: { description: 'Misal : sudah dihubungi lewat whatsapp, menunggu jawaban' },
        },
        {
            name: 'updatedAt',
            type: 'date',
            label: 'Terakhir diperbarui',
            admin: {
                readOnly: true,
                date: { pickerAppearance: 'dayAndTime' },
                condition: (_data, siblingData) => Boolean(siblingData?.updatedAt),
            },
        },
    ],
})

export const stampFollowUp: CollectionBeforeChangeHook = ({ data, originalDoc, operation }) => {
    if (operation !== 'create' && operation !== 'update') return data
    const next = resolveFollowUp(data?.followUp, originalDoc?.followUp, operation)
    return next === undefined ? data : { ...data, followUp: next }
}