export type AvailabilitySettings = {
  capacityPerDay: number
  workingDays: number[] 
  minLeadDays: number
  maxAdvanceDays: number
}
export type Blackout = { startDate: string; endDate?: string | null; capacity?: number | null }
export type DayReason = 'past' | 'lead' | 'beyond' | 'off' | 'blackout' | 'full'
export type DayStatus = {
  date: string
  status: 'open' | 'full' | 'closed'
  reason?: DayReason
  capacity: number
  used: number
  remaining: number
}
export type AvailabilityContext = {
  settings: AvailabilitySettings
  blackouts: Blackout[]
  usage: Record<string, number> // 'YYYY-MM-DD' -> jumlah booking yang menahan kapasitas
  today: string // 'YYYY-MM-DD' (WIB)
}

export const DEFAULT_SETTINGS: AvailabilitySettings = {
  capacityPerDay: 2,
  workingDays: [1, 2, 3, 4, 5, 6],
  minLeadDays: 3,
  maxAdvanceDays: 90,
}

const atUtc = (ymd: string) => new Date(`${ymd}T00:00:00Z`)

export const toYmd = (d: Date) => d.toISOString().slice(0, 10)

export const isYmd = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && toYmdSafe(s) === s
const toYmdSafe = (s: string) => {
  const d = atUtc(s)
  return Number.isNaN(d.getTime()) ? '' : toYmd(d)
}

export const addDays = (ymd: string, n: number) => {
  const d = atUtc(ymd)
  d.setUTCDate(d.getUTCDate() + n)
  return toYmd(d)
}

const diffDays = (a: string, b: string) => Math.round((atUtc(a).getTime() - atUtc(b).getTime()) / 86_400_000)

export const todayInJakarta = (now: Date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)

export function getDayStatus(date: string, ctx: AvailabilityContext): DayStatus {
  const { settings, blackouts, usage, today } = ctx
  const used = usage[date] ?? 0
  const closed = (reason: DayReason): DayStatus => ({ date, status: 'closed', reason, capacity: 0, used, remaining: 0 })

  const ahead = diffDays(date, today)
  if (ahead < 0) return closed('past')
  if (ahead < settings.minLeadDays) return closed('lead')
  if (ahead > settings.maxAdvanceDays) return closed('beyond')
  if (!settings.workingDays.includes(atUtc(date).getUTCDay())) return closed('off')

  const hits = blackouts.filter((b) => b.startDate <= date && date <= (b.endDate || b.startDate))
  let capacity = settings.capacityPerDay
  if (hits.length) {
    if (hits.some((b) => b.capacity == null)) return closed('blackout')
    capacity = Math.min(...hits.map((b) => b.capacity as number))
  }

  const remaining = Math.max(0, capacity - used)
  if (remaining === 0) return { date, status: 'full', reason: 'full', capacity, used, remaining }
  return { date, status: 'open', capacity, used, remaining }
}

export function getMonthAvailability(month: string, ctx: AvailabilityContext): DayStatus[] {
  const [y, m] = month.split('-').map(Number)
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return Array.from({ length: days }, (_, i) => getDayStatus(`${month}-${String(i + 1).padStart(2, '0')}`, ctx))
}