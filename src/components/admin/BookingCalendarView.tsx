import { Gutter } from '@payloadcms/ui'
import type { AdminViewServerProps } from 'payload'
import { isStaff } from '@/access'
import { getMonthStatus } from '@/content/availability'
import { todayInJakarta, type DayStatus } from '@/lib/availability'
import type { Booking } from '@/payload-types'

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const MAX_CHIPS = 3

const REASON: Record<string, string> = {
  past: '', lead: 'Di bawah lead time', beyond: 'Di luar batas', off: 'Non-kerja', blackout: 'Ditutup', full: '',
}
const STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'var(--theme-warning-500)' },
  confirmed: { label: 'Dikonfirmasi', color: 'var(--theme-success-500)' },
  completed: { label: 'Selesai', color: 'var(--theme-elevation-400)' },
}

const LINE = 'var(--theme-elevation-100)'
const MUTED = 'var(--theme-elevation-600)'

const shift = (m: string, delta: number) => {
  const [y, mo] = m.split('-').map(Number)
  return new Date(Date.UTC(y, mo - 1 + delta, 1)).toISOString().slice(0, 7)
}
const monthLabel = (m: string) =>
  new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${m}-01T00:00:00Z`))

const navLink = {
  border: `1px solid ${LINE}`,
  borderRadius: 4,
  padding: '4px 12px',
  textDecoration: 'none',
  color: 'inherit',
  fontSize: 13,
} as const

function Chip({ b, admin }: { b: Booking; admin: string }) {
  const s = STATUS[b.status]
  return (
    <a
      href={`${admin}/collections/bookings/${b.id}`}
      title={`${b.code} · ${b.name} · ${b.packageTitle ?? ''} · ${s?.label ?? b.status}`}
      style={{
        display: 'block',
        borderLeft: `3px solid ${s?.color ?? MUTED}`,
        background: LINE,
        borderRadius: 3,
        padding: '2px 6px',
        fontSize: 12,
        lineHeight: 1.35,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {b.name}
    </a>
  )
}

function Cell({ d, list, today, admin }: { d: DayStatus; list: Booking[]; today: string; admin: string }) {
  const isToday = d.date === today
  const full = d.status === 'full'
  const closed = d.status === 'closed'

  const note = full
    ? `Penuh ${d.used}/${d.capacity}`
    : d.status === 'open'
      ? `${d.used}/${d.capacity}`
      : (REASON[d.reason ?? 'blackout'] ?? '')

  return (
    <div
      style={{
        minHeight: 112,
        padding: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        background: full ? 'var(--theme-error-50)' : closed ? 'var(--theme-elevation-50)' : 'var(--theme-elevation-0)',
        opacity: closed && list.length === 0 ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            padding: '0 6px',
            borderRadius: 999,
            background: isToday ? 'var(--theme-elevation-800)' : 'transparent',
            color: isToday ? 'var(--theme-elevation-0)' : 'inherit',
          }}
        >
          {Number(d.date.slice(8))}
        </span>
        <span style={{ fontSize: 11, color: MUTED, textAlign: 'right' }}>{note}</span>
      </div>

      {list.slice(0, MAX_CHIPS).map((b) => (
        <Chip key={b.id} b={b} admin={admin} />
      ))}
      {list.length > MAX_CHIPS ? (
        <a
          href={`${admin}/collections/bookings?where[date][equals]=${d.date}`}
          style={{ fontSize: 11, color: MUTED, textDecoration: 'none' }}
        >
          +{list.length - MAX_CHIPS} lagi
        </a>
      ) : null}
    </div>
  )
}

function Legend() {
  const swatch = (bg: string, border?: string) =>
    ({ width: 12, height: 12, borderRadius: 2, background: bg, border: border ?? `1px solid ${LINE}`, display: 'inline-block' }) as const
  const item = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: MUTED } as const

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, margin: '12px 0 16px' }}>
      <span style={item}><i style={swatch('var(--theme-elevation-0)')} />Buka (terpakai/kapasitas)</span>
      <span style={item}><i style={swatch('var(--theme-error-50)')} />Penuh</span>
      <span style={item}><i style={swatch('var(--theme-elevation-50)')} />Tutup / non-kerja</span>
      {Object.values(STATUS).map((s) => (
        <span key={s.label} style={item}>
          <i style={{ ...swatch(LINE, 'none'), borderLeft: `3px solid ${s.color}` }} />
          {s.label}
        </span>
      ))}
    </div>
  )
}

export async function BookingCalendarView({ initPageResult, searchParams }: AdminViewServerProps) {
  const { payload, user } = initPageResult.req
  if (!isStaff(user as { role?: string | null } | null | undefined)) {
    return <Gutter><p>Tidak punya akses.</p></Gutter>
  }

  const raw = searchParams?.bulan
  const q = Array.isArray(raw) ? raw[0] : raw
  const today = todayInJakarta()
  const month = typeof q === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(q) ? q : today.slice(0, 7)
  const admin = payload.config.routes.admin
  const base = `${admin}/booking-calendar`

  const [days, bookings] = await Promise.all([
    getMonthStatus(month),
    payload.find({
      collection: 'bookings',
      where: {
        and: [
          { date: { greater_than_equal: `${month}-01` } },
          { date: { less_than_equal: `${month}-31` } },
          { status: { in: ['pending', 'confirmed', 'completed'] } },
        ],
      },
      sort: 'date',
      pagination: false,
      depth: 0,
      user,
      overrideAccess: false,
    }),
  ])

  const byDate = new Map<string, Booking[]>()
  for (const b of bookings.docs) byDate.set(b.date, [...(byDate.get(b.date) ?? []), b])

  const count = (s: string) => bookings.docs.filter((b) => b.status === s).length
  const offset = (new Date(`${month}-01T00:00:00Z`).getUTCDay() + 6) % 7 // Senin = kolom pertama
  const cells: (DayStatus | null)[] = [...Array<null>(offset).fill(null), ...days]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <Gutter>
      <div style={{ paddingBottom: 48 }}>
        <h1 style={{ marginTop: 24, marginBottom: 12 }}>Kalender booking</h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <a href={`${base}?bulan=${shift(month, -1)}`} style={navLink}>← Sebelumnya</a>
          <strong style={{ minWidth: 140, textAlign: 'center', textTransform: 'capitalize' }}>{monthLabel(month)}</strong>
          <a href={`${base}?bulan=${shift(month, 1)}`} style={navLink}>Berikutnya →</a>
          <a href={base} style={navLink}>Bulan ini</a>
        </div>

        <p style={{ margin: '12px 0 0', fontSize: 13, color: MUTED }}>
          {bookings.docs.length} booking · {count('pending')} pending · {count('confirmed')} dikonfirmasi · {count('completed')} selesai
        </p>

        <Legend />

        <div style={{ overflowX: 'auto' }}>
          <div
            style={{
              minWidth: 840,
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: 1,
              background: LINE,
              border: `1px solid ${LINE}`,
            }}
          >
            {WEEKDAYS.map((w) => (
              <div key={w} style={{ background: 'var(--theme-elevation-50)', padding: 8, fontSize: 12, textAlign: 'center', color: MUTED }}>
                {w}
              </div>
            ))}
            {cells.map((d, i) =>
              d ? (
                <Cell key={d.date} d={d} list={byDate.get(d.date) ?? []} today={today} admin={admin} />
              ) : (
                <div key={`b${i}`} style={{ background: 'var(--theme-elevation-50)', minHeight: 112 }} />
              ),
            )}
          </div>
        </div>
      </div>
    </Gutter>
  )
}