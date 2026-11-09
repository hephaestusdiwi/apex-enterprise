import { delta, deltaPoints, type Delta } from '@/lib/stats/period'
import type { Totals } from '@/lib/stats/query'
import { deltaText, fmt, fmtPct } from './format'

type Props = { current : Totals; previous: Totals; pageFiltered: boolean }

function Change({ d, points }: { d: Delta; points?: boolean }) {
  return (
    <span className={`apex-stats__delta apex-stats__delta--${d.direction}`}>
      <span aria-hidden="true">{d.direction === 'up' ? '▲' : d.direction === 'down' ? '▼' : d.direction === 'new' ? '●' : '–'}</span>{' '}
      {deltaText(d, points)}
    </span>
  )
}

export function KpiCards({ current, previous, pageFiltered }: Props) {
    const cards: { key: string; label: string; hint: string; value: string; prev: string; change: Delta; points?: boolean; na?: boolean}[] = [
        {
            key: 'visitors',
            label: 'Pengunjung unik',
            hint: 'Pengunjung anonim per hari ini: yang kembali di hari berbeda dihitung lagi',
            value: fmt(current.visitors),
            prev: fmt(previous.visitors),
            change: delta(current.visitors, previous.visitors),
        },
        {
            key: 'sessions',
            label: 'Sesi kunjungan',
            hint: 'Rangakaian pageview satu pengunjung, jeda lebih dari 30 menit dihitung sesi baru',
            value: fmt(current.sessions),
            prev: fmt(previous.sessions),
            change: delta(current.sessions, previous.sessions),
        },
        {
            key: 'views',
            label: 'Pageview',
            hint: 'Jumlah halaman yang dibuka.',
            value: fmt(current.views),
            prev: fmt(previous.views),
            change: delta(current.views, previous.views),
        },
        {
            key: 'bookings',
            label: 'Booking berhasil',
            hint: 'Booking masuk di periode ini, tidak termasuk yang terdeteksi spam. Seluruh situs.',
            value: fmt(current.bookings),
            prev: fmt(previous.bookings),
            change: delta(current.bookings, previous.bookings),
        },
        {
            key: 'contacts',
            label: 'Pesan kontak masuk',
            hint: 'Pesan dari formulir kontak, tidak termasuk spam',
            value: fmt(current.contacts),
            prev: fmt(previous.contacts),
            change: delta(current.contacts, previous.contacts),
        },
        {
            key: 'conversion',
            label: 'Rasio konversi',
            hint: '(Booking + pesan kontak) dibagi sesi kunjungan.',
            value: pageFiltered ? '—' : fmtPct(current.conversion),
            prev: pageFiltered ? '—' : fmtPct(previous.conversion),
            change: deltaPoints(current.conversion, previous.conversion),
            points: true,
            na: pageFiltered,
        },
    ]

  return (
    <section className="apex-stats__kpis" aria-label="Ringkasan">
      {cards.map((card) => (
        <article key={card.key} className="apex-stats__kpi" title={card.hint}>
          <h3 className="apex-stats__kpi-label">{card.label}</h3>
          <p className="apex-stats__kpi-value">{card.value}</p>
          <p className="apex-stats__kpi-foot">
            {card.na ? (
              <span className="apex-stats__muted">Tidak bisa dikaitkan ke satu halaman</span>
            ) : (
              <>
                <Change d={card.change} points={card.points} />
                <span className="apex-stats__muted">sebelumnya {card.prev}</span>
              </>
            )}
          </p>
        </article>
      ))}
    </section>
  )
}