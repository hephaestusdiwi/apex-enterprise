/**
 * Logika murni (tanpa database) untuk halaman statistik pengunjung:
 * membaca parameter URL, menentukan periode + periode pembanding, dan menghitung perubahan.
 * Semua tanggal berupa string YYYY-MM-DD menurut zona waktu statistik (STATS_TZ).
 */

export const RANGE_PRESETS = [7, 14, 30, 90] as const
export const MAX_RANGE_DAYS = 90
export const DEFAULT_RANGE = 7

export const METRICS = ['visitors', 'sessions', 'views', 'bookings', 'contacts'] as const
export type Metric = (typeof METRICS)[number]

export const GRANULARITIES = ['day', 'week'] as const
export type Granularity = (typeof GRANULARITIES)[number]

export type Period = { from: string; to: string; days: number }

export type StatsParams = {
  /** Preset hari ('7' | '14' | '30' | '90') atau 'custom'. */
  range: string
  current: Period
  previous: Period
  /** Kosong = seluruh situs. */
  page: string
  metric: Metric
  by: Granularity
}

const YMD = /^\d{4}-\d{2}-\d{2}$/
const DAY_MS = 86_400_000

const toUtc = (ymd: string) => Date.UTC(+ymd.slice(0, 4), +ymd.slice(5, 7) - 1, +ymd.slice(8, 10))

export function isYmd(value: unknown): value is string {
  if (typeof value !== 'string' || !YMD.test(value)) return false
  const t = toUtc(value)
  return new Date(t).toISOString().slice(0, 10) === value
}

export const addDays = (ymd: string, n: number): string => new Date(toUtc(ymd) + n * DAY_MS).toISOString().slice(0, 10)

/** Jumlah hari inklusif dari `from` sampai `to`. */
export const daysBetween = (from: string, to: string): number => Math.round((toUtc(to) - toUtc(from)) / DAY_MS) + 1

/** Tanggal hari ini menurut zona waktu tertentu (bukan zona server). */
export function todayInTz(tz: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

export const periodOf = (from: string, to: string): Period => ({ from, to, days: daysBetween(from, to) })

/** Periode pembanding: jumlah hari sama, berakhir sehari sebelum periode ini mulai. */
export function previousPeriod(current: Period): Period {
  const to = addDays(current.from, -1)
  return periodOf(addDays(to, -(current.days - 1)), to)
}

type Raw = Record<string, string | string[] | undefined> | undefined

const first = (value: string | string[] | undefined): string => (Array.isArray(value) ? (value[0] ?? '') : (value ?? ''))

export function sanitizePage(value: string): string {
  const path = value.trim()
  if (!path.startsWith('/') || path.startsWith('//') || path.length > 200) return ''
  return path
}

/**
 * Membaca searchParams. Nilai yang tidak valid jatuh ke bawaan, bukan error:
 * rentang kustom dijepit ke [hari ini - 90 hari, hari ini] dan tidak boleh terbalik.
 */
export function parseStatsParams(raw: Raw, today: string): StatsParams {
  const rangeRaw = first(raw?.range)
  const from = first(raw?.from)
  const to = first(raw?.to)

  let range = String(DEFAULT_RANGE)
  let current: Period = periodOf(addDays(today, -(DEFAULT_RANGE - 1)), today)

  const preset = RANGE_PRESETS.find((n) => String(n) === rangeRaw)

  // Tanggal kustom yang valid diprioritaskan: form filter selalu menyertakan preset aktif sebagai cadangan
  // untuk kasus kolom tanggal dikosongkan.
  if (isYmd(from) && isYmd(to)) {
    let end = to > today ? today : to
    let start = from
    if (start > end) [start, end] = [end, start]
    const floor = addDays(end, -(MAX_RANGE_DAYS - 1))
    if (start < floor) start = floor
    range = 'custom'
    current = periodOf(start, end)
  } else if (preset) {
    range = String(preset)
    current = periodOf(addDays(today, -(preset - 1)), today)
  }

  const metric = METRICS.find((m) => m === first(raw?.metric)) ?? 'visitors'
  const by = GRANULARITIES.find((g) => g === first(raw?.by)) ?? 'day'

  return { range, current, previous: previousPeriod(current), page: sanitizePage(first(raw?.page)), metric, by }
}

export const bucketCount = (days: number, by: Granularity): number => (by === 'week' ? Math.ceil(days / 7) : days)

/** Indeks bucket sebuah hari relatif terhadap awal periodenya. */
export const bucketIndex = (day: string, periodFrom: string, by: Granularity): number => {
  const offset = daysBetween(periodFrom, day) - 1
  return by === 'week' ? Math.floor(offset / 7) : offset
}

/** Tanggal awal tiap bucket (untuk label sumbu X). */
export const bucketStarts = (from: string, days: number, by: Granularity): string[] =>
  Array.from({ length: bucketCount(days, by) }, (_, i) => addDays(from, by === 'week' ? i * 7 : i))

export type Delta = { pct: number | null; direction: 'up' | 'down' | 'flat' | 'new' }

/**
 * Perubahan persen terhadap periode sebelumnya.
 * Sebelumnya 0 dan sekarang > 0 = 'new' (persen tidak terdefinisi); keduanya 0 = 'flat'.
 */
export function delta(current: number, previous: number): Delta {
  if (previous === 0) return current === 0 ? { pct: 0, direction: 'flat' } : { pct: null, direction: 'new' }
  const pct = ((current - previous) / previous) * 100
  if (Math.abs(pct) < 0.05) return { pct: 0, direction: 'flat' }
  return { pct, direction: pct > 0 ? 'up' : 'down' }
}

/** Selisih poin persentase, untuk metrik yang sudah berupa persen (rasio konversi). */
export function deltaPoints(current: number, previous: number): Delta {
  const diff = current - previous
  if (Math.abs(diff) < 0.05) return { pct: 0, direction: 'flat' }
  return { pct: diff, direction: diff > 0 ? 'up' : 'down' }
}

/** Rasio dalam persen; sesi 0 menghasilkan 0 (bukan NaN/Infinity). */
export const rate = (part: number, whole: number): number => (whole > 0 ? (part / whole) * 100 : 0)
