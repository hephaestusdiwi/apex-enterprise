import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import type { Booking } from '@/payload-types'
import { adminOnly, staffOnly } from '@/access'
import { isYmd } from '@/lib/availability'
import { guardStatusChange, type BookingStatus } from '@/lib/bookingGuards'
import { sendClientMail, type ClientMailKind } from '@/lib/bookingMail'

const ro = { readOnly: true }

const MAIL_KIND: Partial<Record<BookingStatus, ClientMailKind>> = {
  pending: 'received',
  confirmed: 'confirmed',
  rejected: 'rejected',
  cancelled: 'cancelled',
  expired: 'expired',
}

const notifyStatusChange: CollectionAfterChangeHook<Booking> = ({ doc, previousDoc, operation, req }) => {
  if (operation === 'update' && previousDoc && doc.status !== previousDoc.status) {
    const kind = MAIL_KIND[doc.status]
    if (kind) sendClientMail(req.payload, doc, kind)
  }
  return doc
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: { singular: 'Booking', plural: 'Booking' },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'packageTitle', 'date', 'name', 'status', 'createdAt'],
    listSearchableFields: ['code', 'name', 'email', 'phone', 'packageTitle'],
  },
  access: {
    // Booking hanya masuk lewat server action (Local API). Tidak ada create via REST/admin.
    create: () => false,
    read: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  hooks: { beforeChange: [guardStatusChange], afterChange: [notifyStatusChange] },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, index: true, label: 'Kode', admin: ro },
    { name: 'servicePackage', type: 'relationship', relationTo: 'service-packages', required: true, label: 'Paket', admin: ro },
    {
      type: 'row',
      fields: [
        { name: 'packageTitle', type: 'text', label: 'Nama paket (snapshot)', admin: { ...ro, width: '50%' } },
        { name: 'packagePrice', type: 'number', label: 'Harga saat booking', admin: { ...ro, width: '50%' } },
      ],
    },
    {
      name: 'date',
      type: 'text',
      required: true,
      index: true,
      label: 'Tanggal',
      admin: { ...ro, description: 'YYYY-MM-DD (WIB)' },
      validate: (v: string | null | undefined) => (typeof v === 'string' && isYmd(v)) || 'Format tanggal tidak valid',
    },
    { name: 'name', type: 'text', required: true, maxLength: 120, label: 'Nama', admin: ro },
    { name: 'email', type: 'email', required: true, admin: ro },
    { name: 'phone', type: 'text', required: true, maxLength: 20, label: 'WhatsApp / Telepon', admin: ro },
    { name: 'notes', type: 'textarea', maxLength: 2000, label: 'Catatan client', admin: ro },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Dikonfirmasi', value: 'confirmed' },
        { label: 'Ditolak', value: 'rejected' },
        { label: 'Dibatalkan', value: 'cancelled' },
        { label: 'Selesai', value: 'completed' },
        { label: 'Kedaluwarsa', value: 'expired' },
        { label: 'Spam (karantina)', value: 'spam' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'holdUntil',
      type: 'date',
      label: 'Hold sampai',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'reminderSentAt',
      type: 'date',
      label: 'Reminder H-1 terkirim',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'adminNote', type: 'textarea', label: 'Catatan internal', admin: { position: 'sidebar' } },
    {
      name: 'statusNote',
      type: 'textarea',
      maxLength: 500,
      label: 'Pesan untuk client (opsional)',
      admin: {
        position: 'sidebar',
        description: 'Ikut terkirim di email saat status jadi Dikonfirmasi / Ditolak / Dibatalkan. Isi sebelum menyimpan perubahan status',
      },
    },
    {
      name: 'spamScore',
      type: 'number',
      defaultValue: 0,
      label: 'Skor spam',
      admin: { position: 'sidebar', readOnly: true, condition: (d) => Number(d?.spamScore) > 0 },
    },
    {
      name: 'spamReasons',
      type: 'textarea',
      label: 'Alasan deteksi',
      admin: { position: 'sidebar', readOnly: true, condition: (d) => Number(d?.spamScore) > 0 },
    },
    { name: 'ipHash', type: 'text', index: true, admin: { hidden: true, readOnly: true } },
    { name: 'accessToken', type: 'text', admin: { hidden: true, readOnly: true } }, // dipakai halaman status (Fase 5)
  ],
}
