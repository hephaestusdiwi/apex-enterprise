export const SOURCE_TYPES = ['direct', 'search', 'social', 'referral'] as const
export type SourceType = (typeof SOURCE_TYPES)[number]

export const SOURCE_LABEL: Record<SourceType, string> = {
    direct: 'Langsung',
    search: 'Mesin pencari',
    social: 'Media sosial',
    referral: 'Referral',
}

const SEARCH =
  /(^|\.)(google|bing|duckduckgo|yahoo|yandex|baidu|ecosia|qwant|startpage|naver|seznam|sogou|ask)\.[a-z.]{2,}$/

const SEARCH_EXACT = new Set(['search.brave.com', 'com.google.android.googlequicksearchbox'])

const SOCIAL_DOMAINS = [
  'facebook.com',
  'fb.com',
  'fb.me',
  'instagram.com',
  'twitter.com',
  'x.com',
  't.co',
  'linkedin.com',
  'lnkd.in',
  'tiktok.com',
  'youtube.com',
  'youtu.be',
  'pinterest.com',
  'reddit.com',
  'threads.net',
  'threads.com',
  'whatsapp.com',
  'wa.me',
  'telegram.org',
  't.me',
  'line.me',
  'discord.com',
]

const isDomain = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`)

/**
 * Mengelompokkan host referrer (sudah tanpa "www." dan huruf kecil, lihat referrerHost di analytics.ts)
 * ke empat jenis sumber. Host kosong berarti kunjungan langsung (atau dari website sendiri).
 */
export function classifySource(host: string | null | undefined): SourceType {
  const h = (host ?? '').trim().toLowerCase().replace(/^www\./, '')
  if (!h) return 'direct'
  if (SEARCH_EXACT.has(h) || SEARCH.test(h)) return 'search'
  if (SOCIAL_DOMAINS.some((d) => isDomain(h, d))) return 'social'
  return 'referral'
}

const PAGE_LABEL: Record<string, string> = {
  '/': 'Beranda',
  '/pricing': 'Pricing',
  '/booking': 'Booking (formulir)',
  '/booking/berhasil': 'Booking berhasil',
  '/booking/[kode]': 'Status booking',
  '/contact': 'Kontak',
  '/blog': 'Blog',
}

export const pageLabel = (path: string): string => PAGE_LABEL[path] ?? path