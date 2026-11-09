import { delta, type StatsParams } from '@/lib/stats/period'
import type { PageRow } from '@/lib/stats/query'
import { pageLabel } from '@/lib/stats/sources'
import { fmt } from './format'
import { statsHref } from './StatsFilters'

type Props = { base: string; params: StatsParams; pages: PageRow[] }

export function PagesTable({ base, params, pages }: Props) {
    return (
    <section className="apex-stats__card" aria-labelledby="pages-title">
      <header className="apex-stats__card-head">
        <h2 id="pages-title">Halaman terpopuler</h2>
        <span className="apex-stats__muted">Klik halaman untuk memfilter</span>
      </header>

      {pages.length === 0 ? (
        <p className="apex-stats__empty">Belum ada pageview pada periode ini.</p>
      ) : (
        <div className="apex-stats__table-wrap">
          <table className="apex-stats__table">
            <caption className="apex-stats__sr">Halaman dengan pageview terbanyak</caption>
            <thead>
              <tr>
                <th scope="col">Halaman</th>
                <th scope="col" className="apex-stats__num">Pageview</th>
                <th scope="col" className="apex-stats__num">Pengunjung</th>
                <th scope="col" className="apex-stats__num" title="Sesi yang dimulai dari halaman ini">Halaman awal</th>
                <th scope="col" className="apex-stats__num">vs sebelumnya</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => {
                const d = delta(page.views, page.prevViews)
                const selected = params.page === page.path
                return (
                  <tr key={page.path} aria-selected={selected || undefined}>
                    <td>
                      <a href={statsHref(base, params, { page: selected ? '' : page.path })} className="apex-stats__page-link">
                        {pageLabel(page.path)}
                      </a>
                      {pageLabel(page.path) !== page.path ? <span className="apex-stats__muted"> {page.path}</span> : null}
                    </td>
                    <td className="apex-stats__num">{fmt(page.views)}</td>
                    <td className="apex-stats__num">{fmt(page.visitors)}</td>
                    <td className="apex-stats__num">{fmt(page.entries)}</td>
                    <td className="apex-stats__num">
                      <span className={`apex-stats__delta apex-stats__delta--${d.direction}`}>
                        {d.direction === 'new' ? 'Baru' : d.pct === null || d.direction === 'flat' ? 'Tetap' : `${d.pct > 0 ? '+' : '−'}${Math.abs(d.pct).toFixed(0)}%`}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}