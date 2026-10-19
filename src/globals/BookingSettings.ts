import type { GlobalConfig } from 'payload'
import { adminOnly, staffOnly } from '../access'

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export const BookingSettings: GlobalConfig = {
  slug: 'booking-settings',
  label: 'Pengaturan Booking',
  access: { read: staffOnly, update: adminOnly },
  fields: [
    {
      name: 'capacityPerDay',
      type: 'number',
      required: true,
      defaultValue: 2,
      min: 1,
      label: 'Kapasitas per hari',
      admin: { description: 'Berapa booking yang bisa ditangani tim di hari yang sama' },
    },
    {
      name: 'workingDays',
      type: 'select',
      hasMany: true,
      defaultValue: ['1', '2', '3', '4', '5', '6'],
      label: 'Hari kerja',
      options: DAYS.map((label, i) => ({ label, value: String(i) })),
    },
    {
      type: 'row',
      fields: [
        { name: 'minLeadDays', type: 'number', min: 0, defaultValue: 3, label: 'Minimal H+ (hari)', admin: { width: '50%' } },
        { name: 'maxAdvanceDays', type: 'number', min: 1, defaultValue: 90, label: 'Maksimal booking ke depan (hari)', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'holdHours', type: 'number', min: 1, defaultValue: 48, label: 'Durasi hold booking pending (jam)', admin: { width: '50%', description: 'Dipakai Fase 3 dan 5' } },
        { name: 'autoConfirm', type: 'checkbox', defaultValue: false, label: 'Konfirmasi otomatis', admin: { width: '50%', description: 'Dipakai Fase 5. Mati = tim approve manual' } },
      ],
    },
    {
      name: 'recipients',
      type: 'array',
      label: 'Penerima notifikasi booking',
      admin: { description: 'Kosong = pakai penerima di Pengaturan Kontak' },
      fields: [{ name: 'email', type: 'email', required: true }],
    },
  ],
}