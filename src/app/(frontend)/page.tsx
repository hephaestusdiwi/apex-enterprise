import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { HomeGrid } from '@/components/site/HomeGrid'
import { HomeHero } from '@/components/site/HomeHero'
import { getProjectList } from '@/content/projects'
import { getSiteSettings } from '@/content/site'
import { JsonLd } from '@/components/seo/JsonLd'
import { siteJsonLd } from '@/lib/jsonLd'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings()
  return buildMetadata({ title: site.siteName, path: '/', seo: site.seo, site, absolute: true })
}

export default async function HomePage() {
  const [site, projects] = await Promise.all([getSiteSettings(), getProjectList()])
  return (
    <>
      <JsonLd data={siteJsonLd(site)} />
      <HomeHero siteName={site.siteName} hero={site.homeHero} />
      <HomeGrid projects={projects} />
    </>
  )
}
