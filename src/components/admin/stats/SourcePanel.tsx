import { delta, rate } from '@/lib/stats/period'
import type { SourceRow, SourceTypeRow } from '@/lib/stats/query'
import { SOURCE_LABEL, SOURCE_TYPES } from '@/lib/stats/sources'
import { fmt, fmtPct } from './format'

type Props = { types: SourceTypeRow[]; hosts: SourceRow[] }

export function SourcePanel({ types, hosts }: Props) {
  const total = types.reduce((sum, t) => sum + t.sessions, 0)
  const byType = new Map(types.map((t) => [t.type, t]))
  const rows = hosts.filter((h) => h.sessions > 0).slice(0, 8)

  return (
    <section className="apex-stats__card" aria-labelledby="source-title">
      <header className="apex-stats__card-head">
        <h2 id="source-title">Sumber trafik</h2>
        <span className="apex-stats__muted">Sesi menurut asal kunjungan</span>
      </header>

      {total === 0 ? (
        <p className="apex-stats__empty">Belum ada sesi pada periode ini.</p>
      ) : (
        <>
          <div className="apex-stats__stack" role="img" aria-label="Komposisi sumber trafik">
            {SOURCE_TYPES.map((type) => {
              const sessions = byType.get(type)?.sessions ?? 0
              return sessions > 0 ? (
                <span key={type} className={`apex-stats__stack-seg apex-stats__src--${type}`} style={{ width: `${rate(sessions, total)}%` }} title={`${SOURCE_LABEL[type]}: ${fmt(sessions)} sesi`} />
              ) : null
            })}
          </div>

          <ul className="apex-stats__sources">
            {SOURCE_TYPES.map((type) => {
              const row = byType.get(type) ?? { type, sessions: 0, prevSessions: 0 }
              const d = delta(row.sessions, row.prevSessions)
              return (
                <li key={type}>
                  <span className={`apex-stats__swatch apex-stats__src--${type}`} />
                  <span className="apex-stats__src-name">{SOURCE_LABEL[type]}</span>
                  <strong>{fmt(row.sessions)}</strong>
                  <span className="apex-stats__muted">{fmtPct(rate(row.sessions, total))}</span>
                  <span className={`apex-stats__delta apex-stats__delta--${d.direction}`}>
                    {d.direction === 'new' ? 'Baru' : d.pct === null || d.direction === 'flat' ? 'Tetap' : `${d.pct > 0 ? '+' : '−'}${Math.abs(d.pct).toFixed(0)}%`}
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="apex-stats__table-wrap">
            <table className="apex-stats__table">
              <caption className="apex-stats__sr">Detail sumber trafik</caption>
              <thead>
                <tr>
                  <th scope="col">Sumber</th>
                  <th scope="col">Jenis</th>
                  <th scope="col" className="apex-stats__num">Sesi</th>
                  <th scope="col" className="apex-stats__num">Porsi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.host || '(langsung)'}>
                    <td>{row.host || '(langsung)'}</td>
                    <td>{SOURCE_LABEL[row.type]}</td>
                    <td className="apex-stats__num">{fmt(row.sessions)}</td>
                    <td className="apex-stats__num">{fmtPct(rate(row.sessions, total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
