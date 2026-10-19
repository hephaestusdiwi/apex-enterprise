'use server'

import { headers } from 'next/headers'
import { getMonthStatus, loadBase } from '@/content/availability'
import { addDays } from '@/lib/availability'
import { rateLimit } from '@/lib/rateLimit'

export type PublicDay = { date: string; status: 'open' | 'full' | 'closed' }

export async function getMonthDays(month: string): Promise<PublicDay[] | null> {
  if (typeof month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return null

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  if (!rateLimit(`availability:${ip}`, 60, 60_000)) return null

  const base = await loadBase()
  const minMonth = base.today.slice(0, 7)
  const maxMonth = addDays(base.today, base.settings.maxAdvanceDays).slice(0, 7)
  if (month < minMonth || month > maxMonth) return null

  const days = await getMonthStatus(month)
  return days.map(({ date, status }) => ({ date, status }))
}