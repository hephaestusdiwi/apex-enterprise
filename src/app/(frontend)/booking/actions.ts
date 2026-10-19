'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rateLimit'
import { hashIp, readFormToken, scoreSubmission } from '@/lib/spam'
import { isYmd } from '@/lib/availability'
import { createBooking } from '@/lib/booking'

export type BookingField = 'packageId' | 'date' | 'name' | 'email' | 'phone' | 'notes'
export type BookingRaw = {
  packageId: number; date: string; name: string; email: string; phone: string; notes: string
  form_token: string; website: string // website = honeypot
}
export type BookingState = {
  ok: boolean
  message?: string
  errors?: Partial<Record<BookingField, string>>
  code?: string
  token?: string
  status?: 'pending' | 'confirmed'
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[0-9\s-]{8,20}$/
const IP_LIMIT = { max: 5, windowMs: 15 * 60 * 1000 }
const EMAIL_LIMIT = { max: 3, windowMs: 60 * 60 * 1000 }
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const since = (ms: number) => new Date(Date.now() - ms).toISOString()

export async function submitBooking(raw: BookingRaw): Promise<BookingState> {
  const v = {
    packageId: Number(raw?.packageId),
    date: str(raw?.date),
    name: str(raw?.name),
    email: str(raw?.email),
    phone: str(raw?.phone),
    notes: str(raw?.notes),
  }

  const errors: BookingState['errors'] = {}
  if (!Number.isInteger(v.packageId) || v.packageId <= 0) errors.packageId = 'Pilih paket.'
  if (!isYmd(v.date)) errors.date = 'Pilih tanggal.'
  if (!v.name) errors.name = 'Nama wajib diisi.'
  else if (v.name.length > 120) errors.name = 'Maksimal 120 karakter.'
  if (!v.email) errors.email = 'Email wajib diisi.'
  else if (v.email.length > 254 || !EMAIL.test(v.email)) errors.email = 'Format email tidak valid.'
  if (!PHONE.test(v.phone)) errors.phone = 'Nomor WhatsApp tidak valid.'
  if (v.notes.length > 2000) errors.notes = 'Maksimal 2000 karakter.'
  if (Object.keys(errors).length > 0) return { ok: false, errors }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'

  if (!rateLimit(`booking:${ip}`, IP_LIMIT.max, IP_LIMIT.windowMs)) {
    return { ok: false, message: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' }
  }

  try {
    const payload = await getPayloadClient()
    const ipHash = ip === 'unknown' ? undefined : hashIp(ip)

    if (ipHash) {
      const fromIp = await payload.count({
        collection: 'bookings',
        where: { and: [{ ipHash: { equals: ipHash } }, { createdAt: { greater_than_equal: since(IP_LIMIT.windowMs) } }] },
      })
      if (fromIp.totalDocs >= IP_LIMIT.max) {
        return { ok: false, message: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' }
      }
    }

    const fromEmail = await payload.count({
      collection: 'bookings',
      where: { and: [{ email: { equals: v.email } }, { createdAt: { greater_than_equal: since(EMAIL_LIMIT.windowMs) } }] },
    })
    if (fromEmail.totalDocs >= EMAIL_LIMIT.max) {
      return { ok: false, message: 'Terlalu banyak booking dari email ini. Coba lagi nanti.' }
    }

    const duplicate = await payload.count({
      collection: 'bookings',
      where: {
        and: [
          { email: { equals: v.email } },
          { date: { equals: v.date } },
          { servicePackage: { equals: v.packageId } },
          { status: { in: ['pending', 'confirmed'] } },
        ],
      },
    })
    if (duplicate.totalDocs > 0) {
      return { ok: false, message: 'Booking dengan email, paket, dan tanggal yang sama sudah ada.' }
    }

    const token = str(raw?.form_token)
    const verdict = scoreSubmission(
      { name: v.name, email: v.email, subject: '', message: v.notes },
      { honeypot: str(raw?.website), token: token ? readFormToken(token) : null },
    )

    const result = await createBooking(v, {
      ipHash,
      isSpam: verdict.isSpam,
      spamScore: verdict.score,
      spamReasons: verdict.reasons.join('; '),
    })

    if (result.ok) {
      return {
        ok: true,
        code: result.code,
        token: result.token,
        status: result.status === 'confirmed' ? 'confirmed' : 'pending',
      }
    }
    if (result.reason === 'date_unavailable') {
      return { ok: false, errors: { date: 'Tanggal ini sudah tidak tersedia. Pilih tanggal lain.' } }
    }
    if (result.reason === 'package') return { ok: false, errors: { packageId: 'Paket tidak tersedia.' } }
    return { ok: false, message: 'Data booking tidak valid.' }
  } catch (err) {
    console.error('Gagal menyimpan booking', err)
    return { ok: false, message: 'Booking gagal dikirim. Silakan coba lagi.' }
  }
}
