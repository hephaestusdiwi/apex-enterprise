import { delta, rate } from '@/lib/stats/period'
import type { FunnelCounts } from '@/lib/stats/query'
import { fmt, fmtPct } from './format'

type Props = { current: FunnelCounts; previous: FunnelCounts }

export function FunnelChart({ current, previous }: Props) {
    const steps = [
        { key: 'pricing', label: 'Melihat halaman Pricing', value: current.pricing, prev: previous.pricing },
        { key: 'booking', label: 'Membuka Booking setelahnya', value: current.booking, prev: previous.booking },
        { key: 'success', label: 'Booking berhasil', value: current.success, prev: previous.success },
    ]
    const top = Math.max(steps[0].value, 1)

    return (
    <section className="apex-stats__card" aria-labelledby="funnel-title">
      <header className="apex-stats__card-head">
        <h2 id="funnel-title">Alur konversi</h2>
      </header>

      {current.pricing === 0 ? (
        <p className="apex-stats__empty">Belum ada sesi yang melihat halaman Pricing pada periode ini.</p>
      ) : (
        <ol className="apex-stats__funnel">
          {steps.map((step, i) => {
            const fromPrev = i === 0 ? null : rate(step.value, steps[i - 1].value)
            const d = delta(step.value, step.prev)
            return (
              <li key={step.key}>
                <div className="apex-stats__funnel-row">
                  <span>{step.label}</span>
                  <strong>{fmt(step.value)}</strong>
                </div>
                <div className="apex-stats__bar" role="presentation">
                  <span style={{ width: `${Math.max((step.value / top) * 100, step.value > 0 ? 2 : 0)}%` }} />
                </div>
                <div className="apex-stats__funnel-foot apex-stats__muted">
                  {fromPrev === null ? 'Sesi awal funnel' : `${fmtPct(fromPrev)} dari langkah sebelumnya`}
                  {' · '}
                  {fmtPct(rate(step.value, top))} dari awal
                  {' · '}
                  <span className={`apex-stats__delta apex-stats__delta--${d.direction}`}>
                    {d.direction === 'new' ? 'baru' : d.pct === null || d.direction === 'flat' ? 'tetap' : `${d.pct > 0 ? '+' : '−'}${Math.abs(d.pct).toFixed(0)}%`} vs sebelumnya
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <p className="apex-stats__note">
        Dihitung per sesi dan berurutan. &quot;Membuka Booking&quot; = membuka halaman /booking setelah Pricing, bukan klik tombol. Sesi yang
        memblokir pelacakan tidak terhitung, jadi angka bisa lebih kecil daripada kartu Booking berhasil.
      </p>
    </section>
  )
}