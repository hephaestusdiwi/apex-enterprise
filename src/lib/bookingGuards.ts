import { APIError, type CollectionBeforeChangeHook, type PayloadRequest } from 'payload'
import type { Booking } from '@/payload-types'
import { getDayStatus } from '@/lib/availability'
import { holdingWhere, loadBase, type BaseContext } from '@/content/availability'

export type BookingStatus = Booking['status']

export const ALLOWED: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'rejected', 'cancelled', 'expired'],
  confirmed: ['completed', 'cancelled'],
  expired: ['pending', 'confirmed'],
  rejected: ['pending'],
  spam: ['pending'],
  cancelled: [],
  completed: [],
}

export const isHolding = (b: Pick<Booking, 'status' | 'holdUntil'>, now: Date) =>
  b.status === 'confirmed' || (b.status === 'pending' && !!b.holdUntil && new Date(b.holdUntil) > now)

type PgAdapter = {
  sessions: Record<string, { db: unknown }>
  execute: (args: { db?: unknown; raw?: string }) => Promise<unknown>
}

/** Kunci per tanggal, otomatis lepas saat commit/rollback. `date` wajib sudah lolos isYmd. */
export async function lockDate(req: PayloadRequest, date: string) {
  const pg = req.payload.db as unknown as PgAdapter
  const session = pg.sessions[String(await req.transactionID)]
  if (!session) throw new Error('Transaksi tidak aktif')
  await pg.execute({ db: session.db, raw: `SELECT pg_advisory_xact_lock(hashtext('booking:${date}'))` })
}

/** Untuk aksi staff: hanya kapasitas dan blackout yang dicek (lead time dan hari kerja boleh dilanggar staff). */
async function assertCapacity(req: PayloadRequest, date: string, selfId: number, base: BaseContext, now: Date) {
  await lockDate(req, date)
  const held = await req.payload.count({
    collection: 'bookings',
    where: { and: [{ date: { equals: date } }, { id: { not_equals: selfId } }, holdingWhere(now)] },
    req,
  })
  const day = getDayStatus(date, {
    settings: { ...base.settings, minLeadDays: 0, maxAdvanceDays: 36_500, workingDays: [0, 1, 2, 3, 4, 5, 6] },
    blackouts: base.blackouts,
    usage: { [date]: held.totalDocs },
    today: date,
  })
  if (day.status !== 'open') {
    throw new APIError(`Tanggal ${date} sudah penuh atau ditutup. Status booking ini tidak bisa diaktifkan lagi.`, 409, undefined, true)
  }
}

export const guardStatusChange: CollectionBeforeChangeHook<Booking> = async ({ data, originalDoc, operation, req }) => {
  if (operation !== 'update' || !originalDoc) return data

  const prev = originalDoc.status
  const next = (data.status ?? prev) as BookingStatus
  if (next === prev) return data

  if (!ALLOWED[prev].includes(next)) {
    throw new APIError(`Status tidak bisa diubah dari "${prev}" ke "${next}".`, 400, undefined, true)
  }

  const now = new Date()
  const base = await loadBase(now, req.payload)

  // Masuk ke status yang menahan kapasitas padahal sebelumnya tidak menahan (hold lewat, expired, spam, rejected).
  if ((next === 'pending' || next === 'confirmed') && !isHolding(originalDoc, now)) {
    await assertCapacity(req, originalDoc.date, originalDoc.id, base, now)
  }

  if (next === 'pending') data.holdUntil = new Date(now.getTime() + base.holdHours * 3_600_000).toISOString()
  else if (next === 'confirmed') data.holdUntil = null

  return data
}