import { timingSafeEqual } from 'crypto'
import type { Payload } from 'payload'
import type { Booking } from '@/payload-types'
import { addDays, todayInJakarta } from './availability'
import { B } from 'node_modules/vitest/dist/chunks/config.d.Cy95HiCx'

export const CLIENT_CANCEL_MIN_DAYS = 1

const safeEqual = (a: string, b: string) => {
    const A = Buffer.from(a)
    const B = Buffer.from(b)
    return A.length === B.length && timingSafeEqual(A, B)
}

export async function findBookingByToken(payload: Payload, code: string, token: string): Promise<Booking | null> {
    if (!/^BK-[A-Z2-9]{8}$/.test(code) || !token) return null
    const { docs } = await payload.find({ collection: 'bookings', where: { code: { equals: code } }, limit: 1, depth: 0 })
    const b = docs[0]
    if (!b || !b.accessToken || b.status === 'spam' || !safeEqual(b.accessToken, token)) return null
    return b
}

export const canClientCancel = (b: Pick<Booking, 'status' | 'date'>, today = todayInJakarta()) =>
  (b.status === 'pending' || b.status === 'confirmed') && b.date >= addDays(today, CLIENT_CANCEL_MIN_DAYS)