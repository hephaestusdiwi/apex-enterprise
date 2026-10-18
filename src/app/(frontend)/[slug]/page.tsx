import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageView } from '@/components/page/PageView'
import { getPageBySlug } from '@/content/pages'
import { getSiteSettings } from '@/content/site'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [page, site] = await Promise.all([getPageBySlug(slug), getSiteSettings()])
  if (!page) return { title: 'Not found' }
  return buildMetadata({ title: page.title, path: `/${page.slug}`, seo: page.seo, site })
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()
  return <PageView page={page} />
}
