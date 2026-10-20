import type { Payload, Where } from 'payload'
import { addDays, todayInJakarta } from './availability'
import { sendClientMail } from './bookingMail'

export const REMINDER_FROM_HOUR_WIB = 8

const wibHour = (now: Date) =>
    Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Jakarta' }).format(now))

export async function sendDueReminders(payload: Payload, now: Date = new Date(), extra?: Where): Promise<number> {
    if (wibHour(now) < REMINDER_FROM_HOUR_WIB) return 0
    const tomorrow = addDays(todayInJakarta(now), 1)

    const { docs } = await payload.find({
        collection: 'bookings',
        where: {
            and: [
                { status: { equals: 'confirmed' } },
                { date: { equals: tomorrow } },
                { reminderSentAt: { exists: false } },
                ...(extra ? [extra] : []),
            ],
        },
        limit: 200,
        depth: 0,
    })

    let sent = 0
    for (const b of docs) {
        try {
            const updated = await payload.update({
                collection: 'bookings',
                id: b.id,
                data: { reminderSentAt: now.toISOString() },
            })
            sendClientMail(payload, updated, 'reminder')
            sent += 1
        } catch (err) {
            payload.logger.error({ err, msg: `Gagal mengirim reminder ${b.code}` })
        }
    }
    return sent
}
