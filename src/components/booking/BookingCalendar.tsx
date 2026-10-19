'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { getMonthDays, type PublicDay } from '@/app/(frontend)/booking/availability'

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

const monthLabel = (m: string) =>
  new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${m}-01T00:00:00Z`))

const shiftMonth = (m: string, delta: number) => {
    const [y, mo] = m.split('-').map(Number)
    return new Date(Date.UTC(y, mo - 1 + delta, 1)).toISOString().slice(0, 7)
}

type Props = {
    value: string | null
    onChange: (date: string) => void
    initialMonth: string
    initialDays: PublicDay[]
    minMonth: string
    maxMonth: string
}

export function BookingCalendar({ value, onChange, initialMonth, initialDays, minMonth, maxMonth }: Props) {
    const startMonth = useRef(value?.slice(0, 7) ?? initialMonth).current
    const [month, setMonth] = useState(startMonth)
    const [cache, setCache] = useState<Record<string, PublicDay[]>>({ [initialMonth]: initialDays })
    const [failed, setFailed] = useState(false)
    const [, startTransition] = useTransition()

    useEffect(() => {
        let alive = true
        getMonthDays(startMonth).then((d) => {
            if (alive && d) setCache((c) => ({ ...c, [startMonth]: d }))
        })
    return () => {
        alive = false
    }
    }, [startMonth])

    const go = (target: string) => {
        if (target < minMonth || target > maxMonth) return
        setMonth(target)
        setFailed(false)
        if (cache[target]) return
        startTransition(async () => {
            const d = await getMonthDays(target)
            if (d) setCache((c) => ({ ...c, [target]: d}))
                else setFailed(true)
        })
    }

    const days = cache[month]
    const offset = (new Date(`${month}-01T00:00:00Z`).getUTCDay() + 6) % 7 // Senin = kolom pertama

    const nav = 'px-2 py-1 text-sm transition-colors disabled:opacity-30 can-hover:hover:text-accent'

 return (
    <div className="max-w-md">
      <div className="mb-6 flex items-center justify-between">
        <button type="button" aria-label="Bulan sebelumnya" disabled={month <= minMonth} onClick={() => go(shiftMonth(month, -1))} className={nav}>
          ←
        </button>
        <p className="text-sm capitalize" aria-live="polite">{monthLabel(month)}</p>
        <button type="button" aria-label="Bulan berikutnya" disabled={month >= maxMonth} onClick={() => go(shiftMonth(month, 1))} className={nav}>
          →
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-mute">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-2">{d}</span>
        ))}
      </div>

      {days ? (
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: offset }, (_, i) => (
            <span key={`b${i}`} />
          ))}
          {days.map((d) => {
            const open = d.status === 'open'
            const selected = d.date === value
            return (
              <button
                key={d.date}
                type="button"
                disabled={!open}
                aria-pressed={selected}
                data-date={d.date}
                data-status={d.status}
                title={d.status === 'full' ? 'Penuh' : undefined}
                onClick={() => onChange(d.date)}
                className={[
                  'aspect-square text-sm transition-colors',
                  selected ? 'bg-ink text-paper' : open ? 'can-hover:hover:text-accent' : 'text-mute/40',
                  d.status === 'full' ? 'line-through' : '',
                ].join(' ')}
              >
                {Number(d.date.slice(8))}
              </button>
            )
          })}
        </div>
      ) : (
        <p className="mt-6 text-sm text-mute">{failed ? 'Gagal memuat. Coba bulan lain.' : 'Memuat…'}</p>
      )}

      <p className="mt-6 text-xs text-mute">Tanggal yang redup sudah penuh atau tidak tersedia.</p>
    </div>
  )
}