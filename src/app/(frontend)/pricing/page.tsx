import type { Metadata } from 'next'
import Link from 'next/link'
import { getPackageList } from '@/content/packages'
import { getSiteSettings } from '@/content/site'
import { buildMetadata } from '@/lib/seo'
import { priceLabel } from '@/lib/price'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    const site = await getSiteSettings()
    return buildMetadata({ title: 'Pricing', path: '/pricing', seo: { image: null, noIndex: false }, site })
}

export default async function PricingPage() {
    const packages = await getPackageList()

    return(
    <section className="mx-auto w-full max-w-7xl px-5 pt-28 md:px-10 md:pt-36">
      <h1 className="text-[clamp(2rem,3.4vw,3.75rem)] font-medium leading-[1.1]">Pricing</h1>

      <div className="mt-12 md:mt-16">
        {packages.length === 0 ? (
          <p className="text-mute">Daftar harga segera hadir.</p>
        ) : (
          packages.map((p) => (
            <article key={p.id} className="grid gap-6 border-t border-mute/30 py-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="text-xl font-medium">{p.title}</h2>
                {p.tagline ? <p className="mt-2 text-sm text-mute">{p.tagline}</p> : null}
              </div>
              <div className="md:col-span-3">
                <p className="text-xl">{priceLabel(p)}</p>
                {p.priceNote ? <p className="mt-1 text-xs text-mute">{p.priceNote}</p> : null}
                {p.bookable ? (
                  <Link href={`/booking?paket=${p.slug}`} className="mt-4 inline-block text-sm underline underline-offset-[6px] transition-colors can-hover:hover:text-accent">
                    Booking paket ini
                  </Link>
                ) : null}
              </div>
              <ul className="space-y-2 text-sm md:col-span-5">
                {p.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </article>
          ))
        )}
      </div>
    </section>
    )
}
