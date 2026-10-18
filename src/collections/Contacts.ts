import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { adminOnly, staffOnly } from '../access'

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Header email tidak boleh berisi baris baru. */
const oneLine = (value: string): string => value.replace(/[\r\n]+/g, ' ').trim()

/**
 * Kirim email ke semua penerima di global "contact-settings" setiap ada pesan baru.
 * Pesan sudah tersimpan di database; gagal kirim email tidak membatalkan penyimpanan.
 */
const notifyNewContact: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  // Pesan yang masuk karantina tidak memicu email; staff bisa menyelamatkannya dari Inbox.
  if (doc.status === 'spam') return doc

  const { payload } = req

  try {
    const settings = await payload.findGlobal({ slug: 'contact-settings', depth: 0, req })
    const to = (settings.recipients ?? []).map((item) => item.email).filter(Boolean)

    if (to.length === 0) {
      payload.logger.warn('Pesan kontak baru masuk, tapi belum ada email penerima di Pengaturan Kontak.')
      return doc
    }

    const subject = doc.subject?.trim() || `Pesan baru dari ${doc.name}`

    // Sengaja tidak di-await: form tidak perlu menunggu SMTP, dan transaksi DB tidak ikut tertahan.
    payload
      .sendEmail({
        to,
        replyTo: doc.email,
        subject: `[Kontak] ${oneLine(subject)}`,
        text: `Nama: ${doc.name}\nEmail: ${doc.email}\n\n${doc.message}`,
        html: `
          <p><strong>Nama:</strong> ${escapeHtml(doc.name)}<br />
          <strong>Email:</strong> ${escapeHtml(doc.email)}</p>
          <p style="white-space:pre-wrap">${escapeHtml(doc.message)}</p>
        `,
      })
      .catch((err: unknown) => {
        payload.logger.error({ err, msg: 'Gagal mengirim email notifikasi kontak' })
      })
  } catch (err) {
    payload.logger.error({ err, msg: 'Gagal menyiapkan email notifikasi kontak' })
  }

  return doc
}

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  labels: { singular: 'Pesan Kontak', plural: 'Pesan Kontak' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'subject', 'message'],
    components: {
      beforeListTable: ['/components/admin/ContactsToolbar#ContactsToolbar'],
    },
  },
  defaultSort: '-createdAt',
  access: {
    // Tidak ada create lewat REST/GraphQL/admin: pesan hanya masuk lewat form (Local API di server action).
    create: () => false,
    read: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [notifyNewContact],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nama', required: true, maxLength: 120, admin: { readOnly: true } },
    { name: 'email', type: 'email', required: true, admin: { readOnly: true } },
    { name: 'subject', type: 'text', label: 'Subjek', maxLength: 200, admin: { readOnly: true } },
    { name: 'message', type: 'textarea', label: 'Pesan', required: true, maxLength: 5000, admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'Baru', value: 'new' },
        { label: 'Sudah dibaca', value: 'read' },
        { label: 'Diarsipkan', value: 'archived' },
        { label: 'Spam (karantina)', value: 'spam' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'spamScore',
      type: 'number',
      label: 'Skor spam',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Skor 3 ke atas masuk karantina. Salah deteksi? Ubah status ke "Baru".',
        condition: (data) => Number(data?.spamScore) > 0,
      },
    },
    {
      name: 'spamReasons',
      type: 'textarea',
      label: 'Alasan deteksi',
      admin: { position: 'sidebar', readOnly: true, condition: (data) => Number(data?.spamScore) > 0 },
    },
    // Hash IP berkunci (bukan IP mentah), dipakai untuk batas kirim yang tahan restart.
    { name: 'ipHash', type: 'text', index: true, admin: { hidden: true, readOnly: true } },
  ],
}