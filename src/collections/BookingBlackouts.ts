import type { CollectionConfig } from 'payload'
import { adminOnly, staffOnly } from '@/access'
import { isYmd } from '@/lib/availability'

const ymdField = (v: string | null | undefined) =>
  !v || isYmd(v) || 'Format harus YYYY-MM-DD, contoh 2026-12-25'

export const BookingBlackouts: CollectionConfig = {
  slug: 'booking-blackouts',
  labels: { singular: 'Tanggal Tutup', plural: 'Tanggal Tutup' },
  admin: { useAsTitle: 'startDate', defaultColumns: ['startDate', 'endDate', 'capacity', 'reason'] },
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: adminOnly },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'startDate', type: 'text', required: true, label: 'Mulai', admin: { width: '50%', description: 'YYYY-MM-DD' },
          validate: (v: string | null | undefined) => (!v ? 'Wajib diisi' : ymdField(v)),
        },
        {
          name: 'endDate', type: 'text', label: 'Sampai (opsional)', admin: { width: '50%', description: 'Kosong = satu hari saja' },
          validate: (v: string | null | undefined, { siblingData }: { siblingData?: { startDate?: string } }) => {
            const base = ymdField(v)
            if (base !== true) return base
            if (v && siblingData?.startDate && v < siblingData.startDate) return 'Tidak boleh lebih awal dari tanggal mulai'
            return true
          },
        },
      ],
    },
    {
      name: 'capacity',
      type: 'number',
      min: 0,
      label: 'Kapasitas khusus',
      admin: { description: 'Kosong = tutup total. Isi angka = kapasitas hari itu diganti angka ini' },
    },
    { name: 'reason', type: 'text', label: 'Alasan (internal)' },
  ],
}