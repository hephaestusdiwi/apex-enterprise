import { cache } from 'react'
import { isSafeHref } from '@/lib/href'
import { getPayloadClient } from '@/lib/payload'
import { toMedia, toSeo, toVideoAsset } from './mapper'
import type { MediaAsset, SeoData, VideoAsset } from './types'

export type HomeHeroData = {
  video: VideoAsset | null
  image: MediaAsset | null
  heading: string
  tagline: string
}

export type SiteSettings = {
  siteName: string
  logo: MediaAsset | null
  photoSwipe: boolean
  navigation: { label: string; href: string }[]
  instagramUrl: string | null
  homeHero: HomeHeroData
  seo: SeoData
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: false })
  const instagram = settings.instagramUrl?.trim()
  return {
    siteName: settings.siteName?.trim() || 'Portfolio',
    logo: toMedia(settings.logo),
    photoSwipe: settings.photoSwipe ?? true,
    navigation: (settings.navigation ?? [])
      .filter((item) => isSafeHref(item.href))
      .map(({ label, href }) => ({ label, href })),
    instagramUrl: instagram && /^https?:\/\//i.test(instagram) ? instagram : null,
    seo: toSeo(settings.seo),
    homeHero: {
      video: toVideoAsset(settings.homeHero?.video),
      image: toMedia(settings.homeHero?.image),
      heading: settings.homeHero?.heading?.trim() ?? '',
      tagline: settings.homeHero?.tagline?.trim() ?? '',
    },
  }
})
