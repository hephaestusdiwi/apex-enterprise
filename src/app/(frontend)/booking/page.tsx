import type { Metadata } from 'next'
import { BookingWizard } from '@/components/booking/BookingWizard'
import { getPackageList } from '@/content/packages'
import { getMonthStatus, loadBase } from '@/content/availability'
import { addDays } from '@/lib/availability'
import { issueFormToken } from '@/lib/spam'

export const metadata: Metadata = { title: 'Booking', alternates: { canonical: '/booking' } }

export const dynamic = 'force-dynamic'

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ paket?: string }> }) {
    const { paket } = await searchParams
    const packages = (await getPackageList()).filter((p) => p.bookable)
    const base = await loadBase()
    const month = base.today.slice(0, 7)
    const days = (await getMonthStatus(month)).map(({ date, status }) => ({ date, status }))

return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-28 pb-24 md:px-10 md:pt-36">
      <h1 className="text-[clamp(2rem,3.4vw,3.75rem)] font-medium leading-[1.1]">Booking</h1>
      <div className="mt-12 md:mt-16">
        {packages.length === 0 ? (
          <p className="text-mute">Booking belum dibuka.</p>
        ) : (
          <BookingWizard
            packages={packages}
            token={issueFormToken()}
            preselectId={packages.find((p) => p.slug === paket)?.id ?? null}
            initialMonth={month}
            initialDays={days}
            minMonth={month}
            maxMonth={addDays(base.today, base.settings.maxAdvanceDays).slice(0, 7)}
          />
        )}
      </div>
    </section>
  )
}