import { createHmac } from 'crypto'

export type Device = 'desktop' | 'mobile' | 'tablet' | 'other'

const BOT =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|monitor|uptime|curl|wget|python-requests|httpclient|axios|node-fetch|go-http|facebookexternalhit/i

/** UA kosong dianggap bot. */
export const isBot = (ua: string): boolean => !ua || BOT.test(ua)

export function parseUserAgent(ua: string): { device: Device; browser: string; os: string } {
  const device: Device = /ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(ua)
    ? 'tablet'
    : /mobi|iphone|ipod|android/i.test(ua)
      ? 'mobile'
      : /windows|macintosh|linux|cros/i.test(ua)
        ? 'desktop'
        : 'other'

  const browser = /edg(e|a|ios)?\//i.test(ua)
    ? 'Edge'
    : /opr\/|opera/i.test(ua)
      ? 'Opera'
      : /firefox|fxios/i.test(ua)
        ? 'Firefox'
        : /chrome|crios|chromium/i.test(ua)
          ? 'Chrome'
          : /safari/i.test(ua)
            ? 'Safari'
            : 'Other'

  const os = /iphone|ipad|ipod/i.test(ua)
    ? 'iOS'
    : /android/i.test(ua)
      ? 'Android'
      : /windows/i.test(ua)
        ? 'Windows'
        : /macintosh|mac os x/i.test(ua)
          ? 'macOS'
          : /cros/i.test(ua)
            ? 'ChromeOS'
            : /linux/i.test(ua)
              ? 'Linux'
              : 'Other'

  return { device, browser, os }
}

/** Hanya path (tanpa query/hash). Admin, API, dan aset Next tidak dicatat. */
export function normalizePath(input: unknown): string | null {
  if (typeof input !== 'string') return null
  let path = input.split(/[?#]/)[0]
  if (!path.startsWith('/') || path.startsWith('//')) return null
  if (/^\/(admin|api|_next)(\/|$)/.test(path)) return null
  if (path.length > 1) path = path.replace(/\/+$/, '')
  // Halaman status booking membawa kode unik: gabungkan supaya statistik tidak penuh path unik.
  path = path.replace(/^\/booking\/[^/]+$/, '/booking/[kode]')
  return path.slice(0, 200)
}

/** Simpan hanya nama host sumber. Referrer dari website sendiri dianggap kunjungan langsung. */
export function referrerHost(referrer: unknown, ownHost: string): string | null {
  if (typeof referrer !== 'string' || !referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase()
    const own = ownHost.split(':')[0].replace(/^www\./, '').toLowerCase()
    return host && host !== own ? host.slice(0, 100) : null
  } catch {
    return null
  }
}

/** Kode negara dari header CDN (Cloudflare/Vercel) bila ada. */
export function countryFromHeaders(headers: Headers): string | null {
  const value = (headers.get('cf-ipcountry') ?? headers.get('x-vercel-ip-country') ?? '').toUpperCase()
  return /^[A-Z]{2}$/.test(value) && value !== 'XX' ? value : null
}

export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown'
}

/**
 * ID pengunjung anonim tanpa cookie: HMAC(secret, tanggal + IP + user agent).
 * Berganti setiap hari dan tidak bisa dibalik tanpa secret, jadi IP tidak pernah disimpan.
 */
export function visitorHash(secret: string, ip: string, ua: string, now = new Date()): string {
  const day = now.toISOString().slice(0, 10)
  return createHmac('sha256', secret).update(`${day}|${ip}|${ua}`).digest('hex').slice(0, 32)
}
