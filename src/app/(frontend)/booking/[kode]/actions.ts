'use server'

import { headers } from 'next/headers'
import { canClientCancel, findBookingByToken } from '@/lib/bookingAccess'
import { notifyCancelledByClient } from '@/lib/bookingMail'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rateLimit'

export type CancelState = { ok: boolean; message?: string }

export async function cancelBooking(code: string, token: string): Promise<CancelState> {
    const h = await headers()
    const ip = h.get('x-forwared-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
    if (!rateLimit(`cancel:${ip}`, 10, 15 * 60 * 1000)) return { ok: false, message: 'Terlalu banyak percobaan. Coba lagi nanti.' }

    try {
        const payload = await getPayloadClient()
        const b = await findBookingByToken(payload, String(code), String(token))
        if (!b) return { ok: false, message: 'Booking tidak ditemukan' }
        if (!canClientCancel(b)) {
            return { ok: false, message: 'Booking ini tidak bisa dibatalkan lewat halaman ini, silahkan hubungi tim developer' }
        }
        const updated = await payload.update({ collection: 'bookings', id: b.id, data: { status: 'cancelled' } })
        void notifyCancelledByClient(payload, updated)
        return { ok: true }
    } catch (err) {
        console.error('Gagal membatalkan booking', err)
        return { ok: false, message: 'Gagal membatalkan, silahkan coba lagi' }
    }
}