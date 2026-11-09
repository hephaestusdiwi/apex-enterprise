import type { Delta } from '@/lib/stats/period'

export const fmt = (n: number): string => Math.round(n).toLocaleString('id-ID')

export const fmtPct = (n: number, digits = 1): string =>
    `${n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: digits })}%`

const SHORT = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const LONG = new Intl.DateTimeFormat('id-ID',  {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

const asUtc = (ymd: string) => new Date(`${ymd}T00:00:00Z`)
export const shortDate = (ymd: string): string => SHORT.format(asUtc(ymd))
export const longDate = (ymd: string): string => LONG.format(asUtc(ymd))

export const rangeLabel = (from: string, to: string): string =>
  from === to ? longDate(from) : `${shortDate(from)} – ${longDate(to)}`

/** Teks perubahan untuk chip: "+12,5%", "-3%", "Baru", "Tetap". `points` = selisih poin persentase. */
export function deltaText(d: Delta, points = false): string {
  if (d.direction === 'new') return 'Baru'
  if (d.direction === 'flat' || d.pct === null) return 'Tetap'
  const sign = d.pct > 0 ? '+' : '−'
  const value = Math.abs(d.pct).toLocaleString('id-ID', { maximumFractionDigits: 1 })
  return points ? `${sign}${value} poin` : `${sign}${value}%`
}
