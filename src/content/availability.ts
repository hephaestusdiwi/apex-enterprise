import type { Payload, Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import {
  DEFAULT_SETTINGS,
  getMonthAvailability,
  todayInJakarta,
  type AvailabilityContext,
  type AvailabilitySettings,
  type DayStatus,
} from '@/lib/availability'

export type BaseContext = Omit<AvailabilityContext, 'usage'> & { holdHours: number; autoConfirm: boolean }

/** Booking yang menahan kapasitas: confirmed, atau pending yang hold-nya belum habis. */
export const holdingWhere = (now: Date): Where => ({
  or: [
    { status: { equals: 'confirmed' } },
    { and: [{ status: { equals: 'pending' } }, { holdUntil: { greater_than: now.toISOString() } }] },
  ],
})

export async function loadBase(now: Date = new Date(), payloadArg?: Payload): Promise<BaseContext> {
  const payload = payloadArg ?? (await getPayloadClient())
  const [s, b] = await Promise.all([
    payload.findGlobal({ slug: 'booking-settings', depth: 0 }),
    payload.find({ collection: 'booking-blackouts', pagination: false, depth: 0 }),
  ])

  const settings: AvailabilitySettings = {
    capacityPerDay: s.capacityPerDay ?? DEFAULT_SETTINGS.capacityPerDay,
    workingDays: s.workingDays ? s.workingDays.map(Number) : DEFAULT_SETTINGS.workingDays,
    minLeadDays: s.minLeadDays ?? DEFAULT_SETTINGS.minLeadDays,
    maxAdvanceDays: s.maxAdvanceDays ?? DEFAULT_SETTINGS.maxAdvanceDays,
  }

  return {
    settings,
    blackouts: b.docs.map((d) => ({ startDate: d.startDate, endDate: d.endDate, capacity: d.capacity })),
    today: todayInJakarta(now),
    holdHours: s.holdHours ?? 48,
    autoConfirm: s.autoConfirm === true,
  }
}

export async function getMonthUsage(month: string, now: Date = new Date()): Promise<Record<string, number>> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { date: { greater_than_equal: `${month}-01` } },
        { date: { less_than_equal: `${month}-31` } },
        holdingWhere(now),
      ],
    },
    pagination: false,
    depth: 0,
    select: { date: true },
  })
  const usage: Record<string, number> = {}
  for (const d of docs) usage[d.date] = (usage[d.date] ?? 0) + 1
  return usage
}

export async function getMonthStatus(month: string, now: Date = new Date()): Promise<DayStatus[]> {
  const [base, usage] = await Promise.all([loadBase(now), getMonthUsage(month, now)])
  return getMonthAvailability(month, { settings: base.settings, blackouts: base.blackouts, usage, today: base.today })
}