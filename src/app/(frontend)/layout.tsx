import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_URL } from '@/lib/seo'
import { PageViewTracker } from '@/components/analytics/PageViewTracker'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteFonts } from '@/components/site/SiteFonts'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getSiteSettings } from '@/content/site'
import './styles.css'
import { Poppins } from 'next/font/google'
import { Lightbox } from '@/components/media/Lightbox'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-poppins',
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { siteName, homeHero, seo } = await getSiteSettings()
  const description = seo.description || homeHero.tagline || undefined
  const image = seo.image ?? homeHero.image
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: siteName, template: `%s - ${siteName}` },
    description,
    openGraph: {
      type: 'website',
      siteName,
      locale: 'id-ID',
      description,
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { siteName, logo, navigation, instagramUrl, photoSwipe, fonts } = await getSiteSettings()

  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <SiteFonts fonts={fonts} />
      </head>
      <body className="relative flex min-h-screen flex-col">
        <MotionProvider />
        <PageViewTracker />
        <SiteHeader siteName={siteName} logo={logo} navigation={navigation} />
        <main className="flex-1">{children}</main>
        {photoSwipe ? <Lightbox /> : null}
        <SiteFooter navigation={navigation} instagramUrl={instagramUrl} />
      </body>
    </html>
  )
}
