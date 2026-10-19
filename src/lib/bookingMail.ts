import type { Payload } from 'payload'
import type { Booking } from '@/payload-types'
import { SITE_URL } from '@/lib/seo'
import { formatDateId } from '@/lib/dateFormat'
import { escapeHtml, oneLine } from '@/lib/mail'

export type ClientMailKind = 'received' | 'confirmed' | 'rejected' | 'cancelled' | 'expired'

const COPY: Record<ClientMailKind, { subject: string; lead: string }> = {
  received: { subject: 'Booking diterima', lead: 'Permintaan booking kamu sudah kami terima dan menunggu konfirmasi tim.' },
  confirmed: { subject: 'Booking dikonfirmasi', lead: 'Booking kamu sudah dikonfirmasi. Sampai jumpa di tanggal tersebut.' },
  rejected: { subject: 'Booking tidak dapat diproses', lead: 'Mohon maaf, kami belum bisa memproses booking ini.' },
  cancelled: { subject: 'Booking dibatalkan', lead: 'Booking kamu sudah dibatalkan.' },
  expired: {
    subject: 'Booking kedaluwarsa',
    lead: 'Booking kamu belum sempat dikonfirmasi dan slot tanggalnya sudah kami lepas. Kamu bisa membuat booking baru kapan saja.',
  },
}

const statusUrl = (b: Booking) => `${SITE_URL}/booking/${b.code}?token=${b.accessToken ?? ''}`

export function sendClientMail(payload: Payload, b: Booking, kind: ClientMailKind) {
  const { subject, lead } = COPY[kind]
  const note = kind === 'confirmed' || kind === 'rejected' || kind === 'cancelled' ? (b.statusNote ?? '').trim() : ''
  const date = formatDateId(b.date)

  const text = [
    `Halo ${b.name},`, '', lead, '',
    `Kode booking: ${b.code}`, `Paket: ${b.packageTitle ?? ''}`, `Tanggal: ${date}`,
    ...(note ? ['', `Pesan dari tim: ${note}`] : []),
    '', `Status booking: ${statusUrl(b)}`,
  ].join('\n')

  const html = `
    <p>Halo ${escapeHtml(b.name)},</p>
    <p>${escapeHtml(lead)}</p>
    <p>Kode booking: <strong>${escapeHtml(b.code)}</strong><br />
    Paket: ${escapeHtml(b.packageTitle ?? '')}<br />
    Tanggal: ${escapeHtml(date)}</p>
    ${note ? `<p>Pesan dari tim:<br />${escapeHtml(note).replace(/\n/g, '<br />')}</p>` : ''}
    <p><a href="${escapeHtml(statusUrl(b))}">Lihat status booking</a></p>
  `

  // Sengaja tidak di-await: email tidak boleh menahan simpan/commit.
  payload
    .sendEmail({ to: b.email, subject: oneLine(`[${b.code}] ${subject}`), text, html })
    .catch((err: unknown) => payload.logger.error({ err, msg: `Gagal mengirim email booking ${b.code}` }))
}

async function staffRecipients(payload: Payload): Promise<string[]> {
  const s = await payload.findGlobal({ slug: 'booking-settings', depth: 0 })
  let to = (s.recipients ?? []).map((r) => r.email).filter(Boolean)
  if (to.length === 0) {
    const c = await payload.findGlobal({ slug: 'contact-settings', depth: 0 })
    to = (c.recipients ?? []).map((r) => r.email).filter(Boolean)
  }
  return to
}

/** Dipanggil SETELAH booking ter-commit: email ke client + ke tim. */
export async function notifyBookingCreated(payload: Payload, b: Booking) {
  try {
    sendClientMail(payload, b, b.status === 'confirmed' ? 'confirmed' : 'received')

    const to = await staffRecipients(payload)
    if (to.length === 0) {
      payload.logger.warn('Booking baru masuk, tapi belum ada email penerima di Pengaturan Booking/Kontak.')
      return
    }
    const date = formatDateId(b.date)
    const adminUrl = `${SITE_URL}/admin/collections/bookings/${b.id}`

    payload
      .sendEmail({
        to,
        replyTo: b.email,
        subject: oneLine(`[Booking] ${b.code} · ${b.packageTitle ?? ''} · ${b.date}`),
        text: [
          `Booking baru (${b.status === 'confirmed' ? 'otomatis dikonfirmasi' : 'menunggu konfirmasi'})`, '',
          `Kode: ${b.code}`, `Paket: ${b.packageTitle ?? ''}`, `Tanggal: ${date}`,
          `Nama: ${b.name}`, `Email: ${b.email}`, `WhatsApp: ${b.phone}`,
          ...(b.notes ? ['', `Catatan: ${b.notes}`] : []),
          '', `Buka di admin: ${adminUrl}`,
        ].join('\n'),
        html: `
          <p><strong>Booking baru</strong> (${b.status === 'confirmed' ? 'otomatis dikonfirmasi' : 'menunggu konfirmasi'})</p>
          <p>Kode: <strong>${escapeHtml(b.code)}</strong><br />
          Paket: ${escapeHtml(b.packageTitle ?? '')}<br />
          Tanggal: ${escapeHtml(date)}<br />
          Nama: ${escapeHtml(b.name)}<br />
          Email: ${escapeHtml(b.email)}<br />
          WhatsApp: ${escapeHtml(b.phone)}</p>
          ${b.notes ? `<p style="white-space:pre-wrap">${escapeHtml(b.notes)}</p>` : ''}
          <p><a href="${escapeHtml(adminUrl)}">Buka di admin</a></p>
        `,
      })
      .catch((err: unknown) => payload.logger.error({ err, msg: `Gagal mengirim email staff untuk ${b.code}` }))
  } catch (err) {
    payload.logger.error({ err, msg: 'Gagal menyiapkan email booking' })
  }
}