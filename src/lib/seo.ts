import type { Metadata } from 'next'
import type { MediaAsset, SeoData } from '@/content/types'
import type { SiteSettings } from '@/content/site'

export const SITE_URL = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const absoluteUrl = (path: string) =>
  /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`


type Input = {
  title: string
  seo: SeoData
  site: SiteSettings
  image?: MediaAsset | null
}

export function resolveSeo({ title, seo, site, image }: Input) {
  const media = seo.image ?? image ?? site.seo.image ?? site.homeHero.image
  const crop = media ? (media.og ?? media) : null
  return {
    title: seo.title ?? title,
    description: seo.description || site.seo.description || site.homeHero.tagline || undefined,
    share: media && crop ? { src: crop.src, width: crop.width, height: crop.height, alt: media.alt } : null,
  }
}

export function buildMetadata(input: Input & { path: string; absolute?: boolean }): Metadata {
  const { path, absolute, seo, site } = input
  const { title, description, share } = resolveSeo(input)
  const images = share ? [{ url: share.src, width: share.width, height: share.height, alt: share.alt }] : undefined

  return {
    title: seo.title || absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: { type: 'website', siteName: site.siteName, locale: 'id_ID', title, description, url: path, images },
    twitter: { card: 'summary_large_image', title, description, images: share ? [share.src] : undefined },
  }
}