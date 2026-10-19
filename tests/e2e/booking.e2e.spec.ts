import { test, expect } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { getMonthStatus } from '../../src/content/availability'
import { addDays, todayInJakarta } from '../../src/lib/availability'
import { createBooking } from '../../src/lib/booking'

test.describe.configure({ mode: 'serial' })

let pkgId: number
let slug: string
const BASE = 'http://localhost:3000'

test.beforeAll(async () => {
  const payload = await getPayload({ config })
  slug = `e2e-paket-${Date.now()}`
  const pkg = await payload.create({
    collection: 'service-packages',
    data: { title: '__E2E__ Paket', slug, priceType: 'fixed', price: 1500000, bookable: true, _status: 'published' },
  })
  pkgId = pkg.id
})

test.afterAll(async () => {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'bookings', where: { servicePackage: { equals: pkgId } } })
  await payload.delete({ collection: 'service-packages', id: pkgId })
})

test('client bisa booking sampai kode muncul', async ({ page }) => {
  await page.goto(`${BASE}/booking?paket=${slug}`) // paket terpilih -> langsung ke langkah Tanggal

  const open = page.locator('button[data-status="open"]')
  if ((await open.count()) === 0) await page.getByRole('button', { name: 'Bulan berikutnya' }).click()
  await open.first().click()
  await page.getByRole('button', { name: 'Lanjut' }).click()

  await page.getByLabel('Nama').fill('E2E Tester')
  await page.getByLabel('Email').fill('e2e@example.test')
  await page.getByLabel('WhatsApp').fill('081234567890')
  await page.getByRole('button', { name: 'Lanjut' }).click()

  await expect(page.getByRole('heading', { name: 'Ringkasan' })).toBeAttached()
  await page.waitForTimeout(3500) // form terkirim < 3 detik dianggap bot (karantina spam)
  await page.getByRole('button', { name: 'Kirim booking' }).click()

  const code = page.getByTestId('booking-code')
  await expect(code).toHaveText(/^BK-[A-Z2-9]{8}$/)

  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'bookings', where: { code: { equals: await code.textContent() } } })
  expect(['pending', 'confirmed']).toContain(docs[0]?.status)
  expect(docs[0]?.packageTitle).toBe('__E2E__ Paket')
})

test('tanggal yang penuh tidak bisa dipilih', async ({ page }) => {
  const today = todayInJakarta()
  let target: { date: string; remaining: number } | undefined
  for (const m of [today.slice(0, 7), addDays(today, 31).slice(0, 7)]) {
    const d = (await getMonthStatus(m)).find((x) => x.status === 'open' && x.used === 0)
    if (d) { target = d; break }
  }
  test.skip(!target, 'Tidak ada tanggal kosong untuk diuji')
  const { date, remaining } = target!

  const meta = { isSpam: false, spamScore: 0, spamReasons: '' }
  for (let i = 0; i < remaining; i++) {
    await createBooking(
      { packageId: pkgId, date, name: `Pengisi ${i}`, email: `e2e-full-${i}@example.test`, phone: '081234567890', notes: 'e2e' },
      meta,
    )
  }

  await page.goto(`${BASE}/booking?paket=${slug}`)
  if (!date.startsWith(today.slice(0, 7))) await page.getByRole('button', { name: 'Bulan berikutnya' }).click()

  const cell = page.locator(`button[data-date="${date}"]`)
  await expect(cell).toHaveAttribute('data-status', 'full')
  await expect(cell).toBeDisabled()
})