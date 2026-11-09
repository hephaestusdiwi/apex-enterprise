import { Gutter } from '@payloadcms/ui'
import type { AdminViewServerProps } from 'payload'
import { isAdmin } from '@/access'
import { parseStatsParams, todayInTz } from '@/lib/stats/period'
import { getVisitorReport } from '@/lib/stats/query'
import { STATS_TZ } from '@/lib/trafficStats'
import { rangeLabel } from './format'
import { FunnelChart } from './FunnelChart'
import { KpiCards } from './KpiCards'
import { PagesTable } from './PagesTable'
import { SourcePanel } from './SourcePanel'
import { StatsFilters } from './StatsFilters'
import { TrendChart } from './TrendChart'

/** Halaman Statistik Pengunjung (/admin/statistik). Khusus admin, sama seperti koleksi Kunjungan. */
export async function VisitorStatsView({ initPageResult, searchParams }: AdminViewServerProps) {
  const { payload, user } = initPageResult.req

  if (!isAdmin(user as { role?: string | null } | null | undefined)) {
    return (
      <Gutter>
        <p>Tidak punya akses.</p>
      </Gutter>
    )
  }

  const base = `${payload.config.routes.admin}/statistik`
  const today = todayInTz(STATS_TZ)
  const params = parseStatsParams(searchParams, today)

  let report
  try {
    report = await getVisitorReport(payload, params)
  } catch (err) {
    payload.logger.error({ err, msg: 'Gagal memuat statistik pengunjung' })
    return (
      <Gutter>
        <div className="apex-stats">
          <h1 className="apex-stats__title">Statistik Pengunjung</h1>
          <p className="apex-stats__empty">Statistik tidak bisa dimuat saat ini. Coba muat ulang halaman; detail error ada di log server.</p>
        </div>
      </Gutter>
    )
  }

  const pageFiltered = Boolean(params.page)

  return (
    <Gutter>
      <div className="apex-stats">
        <header className="apex-stats__header">
          <div>
            <h1 className="apex-stats__title">Statistik Pengunjung</h1>
            <p className="apex-stats__muted">
              {rangeLabel(params.current.from, params.current.to)} dibanding {rangeLabel(params.previous.from, params.previous.to)} · zona
              waktu {STATS_TZ}
              {pageFiltered ? ` · halaman ${params.page}` : ''}
            </p>
          </div>
        </header>

        <StatsFilters base={base} params={params} pageOptions={report.pageOptions} today={today} />

        {!report.hasData ? (
          <p className="apex-stats__empty apex-stats__empty--page">
            Belum ada kunjungan tercatat{pageFiltered ? ' untuk halaman ini' : ''} pada rentang ini. Coba perluas periode atau reset filter.
          </p>
        ) : null}

        <KpiCards current={report.totals.current} previous={report.totals.previous} pageFiltered={pageFiltered} />
        <TrendChart base={base} report={report} />

        <div className="apex-stats__grid-2">
          <SourcePanel types={report.sourceTypes} hosts={report.sources} />
          <FunnelChart current={report.funnel.current} previous={report.funnel.previous} />
        </div>

        <PagesTable base={base} params={params} pages={report.pages} />

        <p className="apex-stats__note">
          Data dari pelacakan kunjungan anonim (tanpa cookie; Do Not Track dihormati). Pengunjung unik dihitung per hari. Filter halaman
          membatasi pengunjung, sesi, pageview, dan sumber ke sesi yang membuka halaman itu; booking, pesan, rasio konversi, dan alur
          konversi selalu seluruh situs.
        </p>
      </div>
    </Gutter>
  )
}
