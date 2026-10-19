import { randomBytes, randomInt } from 'node:crypto'
import { commitTransaction, createLocalReq, initTransaction, killTransaction } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { getDayStatus, isYmd } from '@/lib/availability'
import { holdingWhere, loadBase } from '@/content/availability'
import { lockDate } from '@/lib/bookingGuards'
import { notifyBookingCreated } from '@/lib/bookingMail'

export type BookingInput = { packageId: number; date: string; name: string; email: string; phone: string; notes: string }
export type BookingMeta = { ipHash?: string; isSpam: boolean; spamScore: number; spamReasons: string }
export type CreateBookingResult =
  | { ok: true; code: string; token: string; status: 'pending' | 'confirmed' | 'spam' }
  | { ok: false; reason: 'package' | 'date_unavailable' | 'invalid' }

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // tanpa I, L, O, 0, 1
const makeCode = () => 'BK-' + Array.from({ length: 8 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
const makeToken = () => randomBytes(24).toString('base64url')

export async function createBooking(
  input: BookingInput,
  meta: BookingMeta,
  now: Date = new Date(),
): Promise<CreateBookingResult> {
  if (!isYmd(input.date)) return { ok: false, reason: 'invalid' }
  const payload = await getPayloadClient()

  // PENTING: semua baca di LUAR transaksi. Di dalam transaksi hanya operasi yang membawa `req`.
  // Kalau tidak, request yang menunggu lock memegang koneksi pool dan bisa saling mengunci.
  const found = await payload.find({
    collection: 'service-packages',
    where: { and: [{ id: { equals: input.packageId } }, { _status: { equals: 'published' } }, { bookable: { equals: true } }] },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  })
  const pkg = found.docs[0]
  if (!pkg) return { ok: false, reason: 'package' }

  const base = await loadBase(now)

  const data = {
    code: makeCode(),
    accessToken: makeToken(),
    servicePackage: pkg.id,
    packageTitle: pkg.title,
    packagePrice: pkg.price ?? null,
    date: input.date,
    name: input.name,
    email: input.email,
    phone: input.phone,
    notes: input.notes,
    ipHash: meta.ipHash,
    spamScore: meta.spamScore,
    spamReasons: meta.spamReasons,
  }

  // Spam disimpan untuk ditinjau, tapi tidak menahan kapasitas dan tidak perlu lock.
  if (meta.isSpam) {
    await payload.create({ collection: 'bookings', data: { ...data, status: 'spam' } })
    return { ok: true, code: data.code, token: data.accessToken, status: 'spam' }
  }

  const status = base.autoConfirm ? 'confirmed' : 'pending'
  const holdUntil = status === 'pending' ? new Date(now.getTime() + base.holdHours * 3_600_000).toISOString() : null

  const req = await createLocalReq({}, payload)
  await initTransaction(req)
  try {
    await lockDate(req, input.date)

    const held = await payload.count({
      collection: 'bookings',
      where: { and: [{ date: { equals: input.date } }, holdingWhere(now)] },
      req,
    })
    const day = getDayStatus(input.date, {
      settings: base.settings,
      blackouts: base.blackouts,
      usage: { [input.date]: held.totalDocs },
      today: base.today,
    })
    if (day.status !== 'open') {
      await killTransaction(req)
      return { ok: false, reason: 'date_unavailable' }
    }

    const doc = await payload.create({ collection: 'bookings', data: { ...data, status, holdUntil }, req })
    await commitTransaction(req)
    void notifyBookingCreated(payload, doc)
    return { ok: true, code: data.code, token: data.accessToken, status }
  } catch (err) {
    await killTransaction(req)
    throw err
  }
}
