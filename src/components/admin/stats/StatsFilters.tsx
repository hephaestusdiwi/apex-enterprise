import { RANGE_PRESETS, type StatsParams } from '@/lib/stats/period'
import { pageLabel } from '@/lib/stats/sources'

export function statsHref(base: string, params: StatsParams, override: Record<string, string | undefined> = {}): string {
    const custom = params.range === 'custom'
    const merged:  Record<string, string> = {
        range: custom ? '' : params.range,
        from: custom ? params.current.from : '',
        to: custom ? params.current.to : '',
        page: params.page,
        metric: params.metric,
        by: params.by,
    }
    for (const [key, value] of Object.entries(override)) merged[key] = value ?? ''

    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(merged)) if (value) query.set(key, value)
        const qs = query.toString()
    return qs ? `${base}?${qs}` : base
}

type Props = { base: string; params: StatsParams; pageOptions: string[]; today: string }

export function StatsFilters({ base, params, pageOptions, today }: Props) {
    const options = params.page && !pageOptions.includes(params.page) ? [params.page, ...pageOptions] : pageOptions
    const custom = params.range === 'custom'

    return (
    <div className="apex-stats__filters">
      <nav className="apex-stats__presets" aria-label="Periode">
        {RANGE_PRESETS.map((n) => (
          <a
            key={n}
            href={statsHref(base, params, { range: String(n), from: '', to: '' })}
            className="apex-stats__pill"
            aria-current={params.range === String(n) ? 'true' : undefined}
          >
            {n} hari
          </a>
        ))}
      </nav>

      {/* Form GET biasa: tanpa JavaScript, URL bisa disalin/dibagikan. */}
      <form method="get" action={base} className="apex-stats__form">
        <input type="hidden" name="metric" value={params.metric} />
        <input type="hidden" name="by" value={params.by} />
        {custom ? null : <input type="hidden" name="range" value={params.range} />}

        <label className="apex-stats__field">
          <span>Dari</span>
          <input type="date" name="from" defaultValue={custom ? params.current.from : ''} max={today} />
        </label>
        <label className="apex-stats__field">
          <span>Sampai</span>
          <input type="date" name="to" defaultValue={custom ? params.current.to : ''} max={today} />
        </label>
        <label className="apex-stats__field apex-stats__field--page">
          <span>Halaman</span>
          <select name="page" defaultValue={params.page}>
            <option value="">Semua halaman</option>
            {options.map((path) => (
              <option key={path} value={path}>
                {pageLabel(path) === path ? path : `${pageLabel(path)} (${path})`}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="apex-stats__apply">
          Terapkan
        </button>
        {custom || params.page ? (
          <a href={base} className="apex-stats__reset">
            Reset
          </a>
        ) : null}
      </form>
    </div>
  )
}