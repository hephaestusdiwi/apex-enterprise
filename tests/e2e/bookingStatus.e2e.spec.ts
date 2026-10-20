import { test, expect } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { getMonthStatus } from '../../src/content/availability'
import { addDays, todayInJakarta } from '../../src/lib/availability'
import { createBooking } from '../../src/lib/booking'

const BASE = 'http://localhost:3000'
let pkgId: number

test.beforeAll(async () => {
  const payload = await getPayload({ config })
  const pkg = await payload.create({
    collection: 'service-packages',
    data: { title: '__E2E__ Status', slug: `e2e-status-${Date.now()}`, priceType: 'fixed', price: 1000, bookable: true, _status: 'published' },
  })
  pkgId = pkg.id
})

test.afterAll(async () => {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'bookings', where: { servicePackage: { equals: pkgId } } })
  await payload.delete({ collection: 'service-packages', id: pkgId })
})

test('halaman status: tampil, token salah tidak membocorkan apa pun, client bisa membatalkan', async ({ page }) => {
  const open = (await getMonthStatus(addDays(todayInJakarta(), 35).slice(0, 7))).find((d) => d.status === 'open' && d.used === 0)
  test.skip(!open, 'Tidak ada tanggal kosong untuk diuji')

  const r = await createBooking(
    { packageId: pkgId, date: open!.date, name: 'E2E Status', email: 'e2e-status@example.test', phone: '081234567890', notes: 'e2e' },
    { isSpam: false, spamScore: 0, spamReasons: '' },
  )
  if (!r.ok) throw new Error(`Seed booking gagal: ${r.reason}`)

  // token salah: tidak ada status, tidak ada kode
  await page.goto(`${BASE}/booking/${r.code}?token=salah`)
  await expect(page.getByTestId('booking-status')).toHaveCount(0)

  // token benar
  await page.goto(`${BASE}/booking/${r.code}?token=${r.token}`)
  await expect(page.getByTestId('booking-status')).toHaveText(/Menunggu konfirmasi|Dikonfirmasi/)

  // client membatalkan
  await page.getByRole('button', { name: 'Batalkan booking' }).click()
  await page.getByRole('button', { name: 'Ya, batalkan' }).click()
  await expect(page.getByTestId('booking-status')).toHaveText('Dibatalkan')
  await expect(page.getByRole('button', { name: 'Batalkan booking' })).toHaveCount(0)
})