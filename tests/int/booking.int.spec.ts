// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { addDays, todayInJakarta } from '@/lib/availability'
import { getMonthStatus } from '@/content/availability'
import { createBooking, type BookingInput } from '@/lib/booking'

let payload: Payload
let pkgId: number
let month: string
let date: string
let remaining: number

const meta = { isSpam: false, spamScore: 0, spamReasons: '' }
const input = (n: number): BookingInput => ({
  packageId: pkgId,
  date,
  name: `Tester ${n}`,
  email: `tester${n}@example.test`,
  phone: '081234567890',
  notes: 'integration test',
})
const dayNow = async () => (await getMonthStatus(month)).find((d) => d.date === date)!

beforeAll(async () => {
  payload = await getPayload({ config: await config })
  const pkg = await payload.create({
    collection: 'service-packages',
    data: { title: '__TEST__ Paket', slug: `test-paket-${Date.now()}`, priceType: 'fixed', price: 1000, bookable: true, _status: 'published' },
  })
  pkgId = pkg.id

  month = addDays(todayInJakarta(), 35).slice(0, 7)
  const open = (await getMonthStatus(month)).find((d) => d.status === 'open' && d.used === 0)
  if (!open) throw new Error(`Tidak ada tanggal kosong di ${month}. Cek Pengaturan Booking.`)
  if (open.remaining > 5) throw new Error('Test ini butuh kapasitas per hari <= 5 (batas pool koneksi).')
  date = open.date
  remaining = open.remaining
}, 60_000)

afterAll(async () => {
  if (process.env.BOOKING_TEST_KEEP) return
  await payload.delete({ collection: 'bookings', where: { servicePackage: { equals: pkgId } } })
  await payload.delete({ collection: 'service-packages', id: pkgId })
}, 60_000)

describe('booking', () => {
  it('spam tidak menahan kapasitas', async () => {
    const r = await createBooking(input(99), { isSpam: true, spamScore: 10, spamReasons: 'test' })
    expect(r).toMatchObject({ ok: true, status: 'spam' })
    expect((await dayNow()).remaining).toBe(remaining)
  }, 30_000)

  it('request bersamaan tidak pernah melebihi kapasitas', async () => {
    const n = remaining + 3
    const results = await Promise.all(Array.from({ length: n }, (_, i) => createBooking(input(i), meta)))

    expect(results.filter((r) => r.ok)).toHaveLength(remaining)
    expect(results.filter((r) => !r.ok && r.reason === 'date_unavailable')).toHaveLength(3)

    const after = await dayNow()
    expect(after.status).toBe('full')
    expect(after.used).toBe(remaining)
  }, 30_000)

  it('menolak tanggal lampau dan paket yang tidak ada', async () => {
    const past = await createBooking({ ...input(1), date: addDays(todayInJakarta(), -1) }, meta)
    expect(past).toEqual({ ok: false, reason: 'date_unavailable' })

    const noPkg = await createBooking({ ...input(1), packageId: 999_999_999 }, meta)
    expect(noPkg).toEqual({ ok: false, reason: 'package' })
  }, 30_000)
})