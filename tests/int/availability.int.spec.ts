import { describe, expect, it } from 'vitest'
import { addDays, getDayStatus, getMonthAvailability, isYmd, todayInJakarta, type AvailabilityContext } from '@/lib/availability'

const today = '2026-11-02' // Senin
const base: AvailabilityContext = {
  settings: { capacityPerDay: 2, workingDays: [1, 2, 3, 4, 5, 6], minLeadDays: 3, maxAdvanceDays: 90 },
  blackouts: [],
  usage: {},
  today,
}
const at = (date: string, over: Partial<AvailabilityContext> = {}) => getDayStatus(date, { ...base, ...over })

describe('availability', () => {
  it('menutup tanggal lampau dan di bawah lead time', () => {
    expect(at('2026-11-01')).toMatchObject({ status: 'closed', reason: 'past' })
    expect(at('2026-11-04')).toMatchObject({ status: 'closed', reason: 'lead' })
    expect(at('2026-11-05')).toMatchObject({ status: 'open' })
  })

  it('menutup tanggal terlalu jauh dan hari non-kerja', () => {
    expect(at(addDays(today, 91))).toMatchObject({ status: 'closed', reason: 'beyond' })
    expect(at('2026-11-08')).toMatchObject({ status: 'closed', reason: 'off' }) // Minggu
  })

  it('blackout rentang menutup, di luar rentang tetap buka', () => {
    const blackouts = [{ startDate: '2026-11-10', endDate: '2026-11-12' }]
    expect(at('2026-11-11', { blackouts })).toMatchObject({ status: 'closed', reason: 'blackout' })
    expect(at('2026-11-13', { blackouts })).toMatchObject({ status: 'open' })
  })

  it('kapasitas khusus mengganti kapasitas default', () => {
    const blackouts = [{ startDate: '2026-11-16', capacity: 1 }]
    expect(at('2026-11-16', { blackouts, usage: { '2026-11-16': 1 } })).toMatchObject({ status: 'full', capacity: 1 })
  })

  it('full kalau kapasitas habis, open kalau masih sisa', () => {
    expect(at('2026-11-20', { usage: { '2026-11-20': 2 } })).toMatchObject({ status: 'full', remaining: 0 })
    expect(at('2026-11-20', { usage: { '2026-11-20': 1 } })).toMatchObject({ status: 'open', remaining: 1 })
  })

  it('hari ini dihitung menurut WIB, bukan UTC', () => {
    expect(todayInJakarta(new Date('2026-11-01T17:30:00Z'))).toBe('2026-11-02')
  })

  it('validasi tanggal dan panjang bulan', () => {
    expect(isYmd('2026-02-30')).toBe(false)
    expect(isYmd('2026-12-25')).toBe(true)
    expect(getMonthAvailability('2026-11', base)).toHaveLength(30)
  })
})