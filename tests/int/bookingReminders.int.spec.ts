// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { addDays, todayInJakarta } from '@/lib/availability'
import { sendDueReminders } from '@/lib/bookingReminders'
import type { Booking } from '@/payload-types'

let payload: Payload
let pkgId: number
let seq = 0
const today = todayInJakarta()
const tomorrow = addDays(today, 1)
const atWib = (h: number) => new Date(`${today}T${String(h).padStart(2, '0')}:00:00+07:00`)
const scope = () => ({ servicePackage: { equals: pkgId } })

const mk = (status: Booking['status'], date = tomorrow) =>
  payload.create({
    collection: 'bookings',
    data: {
      code: `T-${Date.now()}-${seq++}`, servicePackage: pkgId, packageTitle: '__TEST__', date,
      name: 'Fixture', email: `rm${seq}@example.test`, phone: '081234567890', status,
    },
  })
const reload = (id: number) => payload.findByID({ collection: 'bookings', id })

beforeAll(async () => {
  payload = await getPayload({ config: await config })
  const pkg = await payload.create({
    collection: 'service-packages',
    data: { title: '__TEST__ Reminder', slug: `test-rem-${Date.now()}`, priceType: 'fixed', price: 1000, bookable: true, _status: 'published' },
  })
  pkgId = pkg.id
}, 60_000)

afterAll(async () => {
  await payload.delete({ collection: 'bookings', where: scope() })
  await payload.delete({ collection: 'service-packages', id: pkgId })
}, 60_000)

describe('reminder H-1', () => {
  it('tidak mengirim sebelum 08.00 WIB', async () => {
    const b = await mk('confirmed')
    expect(await sendDueReminders(payload, atWib(5), scope())).toBe(0)
    expect((await reload(b.id)).reminderSentAt).toBeFalsy()
  }, 30_000)

  it('mengirim sekali setelah 08.00 WIB, hanya untuk yang dikonfirmasi dan jatuh besok', async () => {
    const ok = await mk('confirmed')
    const pending = await mk('pending')
    const lusa = await mk('confirmed', addDays(today, 2))

    expect(await sendDueReminders(payload, atWib(10), scope())).toBeGreaterThanOrEqual(1)
    expect((await reload(ok.id)).reminderSentAt).toBeTruthy()
    expect((await reload(pending.id)).reminderSentAt).toBeFalsy()
    expect((await reload(lusa.id)).reminderSentAt).toBeFalsy()

    expect(await sendDueReminders(payload, atWib(11), scope())).toBe(0) // tidak dua kali
  }, 30_000)
})