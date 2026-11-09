import { bucketStarts, METRICS, type Metric, type StatsParams } from '@/lib/stats/period'
import type { VisitorReport } from '@/lib/stats/query'
import { fmt, shortDate } from './format'
import { statsHref } from './StatsFilters'

export const METRIC_LABEL: Record<Metric, string> = {
  visitors: 'Pengunjung',
  sessions: 'Sesi',
  views: 'Pageview',
  bookings: 'Booking',
  contacts: 'Pesan kontak',
}

const W = 760
const H = 280
const PAD = { top: 16, right: 16, bottom: 30, left: 44 }

/** Batas atas sumbu Y yang "bulat" (1, 2, 5 x 10^n) supaya garis bantu rapi. */
function niceMax(max: number): number {
  if (max <= 4) return 4
  const pow = 10 ** Math.floor(Math.log10(max))
  const step = [1, 2, 5, 10].find((m) => max <= m * pow)! * pow
  return step
}

type Props = { base: string; report: VisitorReport }

export function TrendChart({ base, report }: Props) {
  const { params, series } = report
  const { metric, by } = params
  const cur = series.current[metric]
  const prev = series.previous[metric]
  const starts = bucketStarts(params.current.from, params.current.days, by)
  const prevStarts = bucketStarts(params.previous.from, params.previous.days, by)
  const n = cur.length

  const yMax = niceMax(Math.max(...cur, ...prev, 0))
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
  const y = (v: number) => PAD.top + innerH - (v / yMax) * innerH
  const line = (values: number[]) => values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const area = `${line(cur)} L${x(n - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * yMax)
  const labelEvery = Math.max(1, Math.ceil(n / 7))
  const unit = by === 'week' ? 'minggu' : 'hari'
  const sum = cur.reduce((a, b) => a + b, 0)
  const disabled = (m: Metric) => Boolean(params.page) && (m === 'bookings' || m === 'contacts')

  return (
    <section className="apex-stats__card" aria-labelledby="trend-title">
      <header className="apex-stats__card-head">
        <h2 id="trend-title">Tren per {unit}</h2>
        <div className="apex-stats__toolbar">
          <div className="apex-stats__segmented" role="group" aria-label="Metrik">
            {METRICS.map((m) =>
              disabled(m) ? (
                <span key={m} className="apex-stats__seg apex-stats__seg--disabled" title="Tidak tersedia saat difilter per halaman">
                  {METRIC_LABEL[m]}
                </span>
              ) : (
                <a key={m} href={statsHref(base, params, { metric: m })} className="apex-stats__seg" aria-current={m === metric ? 'true' : undefined}>
                  {METRIC_LABEL[m]}
                </a>
              ),
            )}
          </div>
          <div className="apex-stats__segmented" role="group" aria-label="Rentang bucket">
            {(['day', 'week'] as const).map((g) => (
              <a key={g} href={statsHref(base, params, { by: g })} className="apex-stats__seg" aria-current={g === by ? 'true' : undefined}>
                {g === 'day' ? 'Harian' : 'Mingguan'}
              </a>
            ))}
          </div>
        </div>
      </header>

      <svg
        className="apex-stats__chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Grafik ${METRIC_LABEL[metric]} per ${unit}, total ${fmt(sum)} pada periode ini`}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line className="apex-stats__grid" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
            <text className="apex-stats__axis" x={PAD.left - 8} y={y(t) + 4} textAnchor="end">
              {fmt(t)}
            </text>
          </g>
        ))}

        <path className="apex-stats__area" d={area} />
        <path className="apex-stats__line apex-stats__line--prev" d={line(prev)} />
        <path className="apex-stats__line" d={line(cur)} />

        {cur.map((v, i) => (
          <g key={i}>
            {n <= 31 ? <circle className="apex-stats__dot" cx={x(i)} cy={y(v)} r={3} /> : null}
            {/* Area sentuh tak terlihat: tooltip native dari <title>. */}
            <rect x={x(i) - innerW / n / 2} y={PAD.top} width={innerW / n} height={innerH} fill="transparent">
              <title>
                {`${by === 'week' ? 'Minggu mulai ' : ''}${shortDate(starts[i])}: ${fmt(v)} ${METRIC_LABEL[metric].toLowerCase()}\nPeriode sebelumnya (${shortDate(prevStarts[i])}): ${fmt(prev[i] ?? 0)}`}
              </title>
            </rect>
            {i % labelEvery === 0 ? (
              <text className="apex-stats__axis" x={x(i)} y={H - 8} textAnchor="middle">
                {shortDate(starts[i])}
              </text>
            ) : null}
          </g>
        ))}
      </svg>

      <ul className="apex-stats__legend">
        <li>
          <span className="apex-stats__swatch" /> Periode ini
        </li>
        <li>
          <span className="apex-stats__swatch apex-stats__swatch--prev" /> Periode sebelumnya
        </li>
        {by === 'week' && params.current.days % 7 !== 0 ? <li className="apex-stats__muted">Minggu terakhir belum penuh</li> : null}
      </ul>
    </section>
  )
}
