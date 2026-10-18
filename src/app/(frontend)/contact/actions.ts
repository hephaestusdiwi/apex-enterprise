'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rateLimit'
import { hashIp, readFormToken, scoreSubmission } from '@/lib/spam'

export type ContactField = 'name' | 'email' | 'subject' | 'message'

export type ContactState = {
  ok: boolean
  message?: string
  errors?: Partial<Record<ContactField, string>>
  values?: Record<ContactField, string>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const IP_LIMIT = { max: 5, windowMs: 15 * 60 * 1000 }
const EMAIL_LIMIT = { max: 3, windowMs: 60 * 60 * 1000 }
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000

const text = (formData: FormData, key: string): string => {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

const since = (windowMs: number): string => new Date(Date.now() - windowMs).toISOString()

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: text(formData, 'name'),
    email: text(formData, 'email'),
    subject: text(formData, 'subject'),
    message: text(formData, 'message'),
  }

  const errors: ContactState['errors'] = {}
  if (!values.name) errors.name = 'Nama wajib diisi.'
  else if (values.name.length > 120) errors.name = 'Maksimal 120 karakter.'

  if (!values.email) errors.email = 'Email wajib diisi.'
  else if (values.email.length > 254 || !EMAIL.test(values.email)) errors.email = 'Format email tidak valid.'

  if (values.subject.length > 200) errors.subject = 'Maksimal 200 karakter.'

  if (!values.message) errors.message = 'Pesan wajib diisi.'
  else if (values.message.length > 5000) errors.message = 'Maksimal 5000 karakter.'

  if (Object.keys(errors).length > 0) return { ok: false, errors, values }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'

  // Lapis 1: penahan banjir di memori (murah, tidak menyentuh database).
  if (!rateLimit(`contact:${ip}`, IP_LIMIT.max, IP_LIMIT.windowMs)) {
    return { ok: false, message: 'Terlalu banyak pesan. Coba lagi beberapa menit lagi.', values }
  }

  try {
    const payload = await getPayloadClient()

    // Toggle di Pengaturan Kontak. Belum pernah disimpan = anggap aktif.
    const settings = await payload.findGlobal({ slug: 'contact-settings', depth: 0 })
    const protectionOn = settings.spamProtection !== false

    if (!protectionOn) {
      await payload.create({ collection: 'contacts', data: { ...values, status: 'new' } })
      return { ok: true }
    }

    // Lapis 2: batas yang tahan restart, dihitung dari tabel contacts (termasuk yang berstatus spam).
    // IP "unknown" tidak dihitung supaya semua pengunjung tanpa header tidak saling memblokir.
    const ipHash = ip === 'unknown' ? undefined : hashIp(ip)

    if (ipHash) {
      const fromIp = await payload.count({
        collection: 'contacts',
        where: { and: [{ ipHash: { equals: ipHash } }, { createdAt: { greater_than_equal: since(IP_LIMIT.windowMs) } }] },
      })
      if (fromIp.totalDocs >= IP_LIMIT.max) {
        return { ok: false, message: 'Terlalu banyak pesan. Coba lagi beberapa menit lagi.', values }
      }
    }

    const duplicate = await payload.count({
      collection: 'contacts',
      where: {
        and: [
          { email: { equals: values.email } },
          { message: { equals: values.message } },
          { createdAt: { greater_than_equal: since(DUPLICATE_WINDOW_MS) } },
        ],
      },
    })
    // Kirim ganda (klik dua kali, refresh) dianggap sukses tanpa menyimpan lagi.
    if (duplicate.totalDocs > 0) return { ok: true }

    const fromEmail = await payload.count({
      collection: 'contacts',
      where: { and: [{ email: { equals: values.email } }, { createdAt: { greater_than_equal: since(EMAIL_LIMIT.windowMs) } }] },
    })
    if (fromEmail.totalDocs >= EMAIL_LIMIT.max) {
      return { ok: false, message: 'Terlalu banyak pesan dari email ini. Coba lagi nanti.', values }
    }

    // Lapis 3: skor. Pesan mencurigakan tetap disimpan (status "spam"), hanya tanpa email notifikasi.
    const token = text(formData, 'form_token')
    const verdict = scoreSubmission(values, {
      honeypot: text(formData, 'contact_check'),
      token: token ? readFormToken(token) : null,
    })

    await payload.create({
      collection: 'contacts',
      data: {
        ...values,
        status: verdict.isSpam ? 'spam' : 'new',
        spamScore: verdict.score,
        spamReasons: verdict.reasons.join('; '),
        ipHash,
      },
    })

    // Pengirim selalu melihat "terkirim": bot tidak belajar apa yang memicu deteksi.
    return { ok: true }
  } catch (err) {
    console.error('Gagal menyimpan pesan kontak', err)
    return { ok: false, message: 'Pesan gagal dikirim. Silakan coba lagi.', values }
  }
}