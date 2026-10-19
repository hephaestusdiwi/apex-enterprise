// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { addDays, todayInJakarta } from '@/lib/availability'
import { getMonthStatus } from '@/content/availability'
import type { Booking } from '@/payload-types'

let payload: Payload
let pkgId: number
let dates: { date: string; remaining: number }[] = []
let seq = 0

const past = () => new Date(Date.now() - 3_600_000).toISOString()
const future = () => new Date(Date.now() + 3_600_000).toISOString()

const mk = (date: string, status: Booking['status'], holdUntil: string | null = null) =>
  payload.create({
    collection: 'bookings',
    data: {
      code: `T-${Date.now()}-${seq++}`, servicePackage: pkgId, packageTitle: '__TEST__', date,
      name: 'Fixture', email: `fx${seq}@example.test`, phone: '081234567890', status, holdUntil,
    },
  })
const setStatus = (id: number, status: Booking['status']) =>
  payload.update({ collection: 'bookings', id, data: { status } })

beforeAll(async () => {
  payload = await getPayload({ config: await config })
  const pkg = await payload.create({
    collection: 'service-packages',
    data: { title: '__TEST__ Flow', slug: `test-flow-${Date.now()}`, priceType: 'fixed', price: 1000, bookable: true, _status: 'published' },
  })
  pkgId = pkg.id

  const month = addDays(todayInJakarta(), 35).slice(0, 7)
  dates = (await getMonthStatus(month))
    .filter((d) => d.status === 'open' && d.used === 0)
    .slice(0, 3)
    .map((d) => ({ date: d.date, remaining: d.remaining }))
  if (dates.length < 3) throw new Error(`Butuh 3 tanggal kosong di ${month}. Cek Pengaturan Booking.`)
}, 60_000)

afterAll(async () => {
  await payload.delete({ collection: 'bookings', where: { servicePackage: { equals: pkgId } } })
  await payload.delete({ collection: 'service-packages', id: pkgId })
}, 60_000)

describe('alur status booking', () => {
  it('hanya mengizinkan transisi yang sah dan merapikan holdUntil', async () => {
    const b = await mk(dates[0].date, 'pending', future())
    await expect(setStatus(b.id, 'completed')).rejects.toThrow(/tidak bisa diubah/)

    const ok = await setStatus(b.id, 'confirmed')
    expect(ok.status).toBe('confirmed')
    expect(ok.holdUntil).toBeNull()

    await expect(setStatus(b.id, 'pending')).rejects.toThrow(/tidak bisa diubah/)
  }, 30_000)

  it('konfirmasi ulang setelah hold lewat tetap menghormati kapasitas', async () => {
    const { date, remaining } = dates[1]
    const lapsed = await mk(date, 'pending', past()) // hold lewat = tidak menahan slot
    const fillers: Booking[] = []
    for (let i = 0; i < remaining; i++) fillers.push(await mk(date, 'confirmed')) // hari jadi penuh

    await expect(setStatus(lapsed.id, 'confirmed')).rejects.toThrow(/penuh|ditutup/)

    await setStatus(fillers[0].id, 'cancelled') // slot kembali
    expect((await setStatus(lapsed.id, 'confirmed')).status).toBe('confirmed')
  }, 30_000)

  it('job mengedaluwarsakan pending yang hold-nya lewat', async () => {
    const b = await mk(dates[2].date, 'pending', past())
    await payload.jobs.queue({ task: 'expireBookings', input: {} })
    await payload.jobs.run({ queue: 'default' })
    expect((await payload.findByID({ collection: 'bookings', id: b.id })).status).toBe('expired')
  }, 30_000)
})