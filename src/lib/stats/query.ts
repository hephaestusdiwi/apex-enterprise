import { sql } from '@payloadcms/db-postgres/drizzle'
import type { Payload } from 'payload'
import { STATS_TZ } from '../trafficStats'
import { bucketCount, rate, type Metric, type StatsParams } from './period'
import { classifySource, SOURCE_TYPES, type SourceType } from './sources'

export const SESSION_GAP_MINUTES = 30

export const FUNNEL_PATHS = { pricing: '/pricing', booking: '/booking', success: '/booking/berhasil' } as const

type Sql = ReturnType<typeof sql>
type Row = Record<string, unknown>
type Db = { drizzle: { execute: (query: unknown) => Promise<{ rows: Row[] }> } }

export type Totals = {
    visitors: number
    sessions: number
    views: number
    bookings: number
    contacts: number
    conversion: number
}

export type PageRow = { path: string; views: number; visitors: number; entries: number; prevViews: number }
export type SourceRow = { host: string; type: SourceType; sessions: number; prevSessions: number }
export type SourceTypeRow = { type: SourceType; sessions: number; prevSessions: number }
export type FunnelCounts = { pricing: number; booking: number; success: number }

export type VisitorReport = {
    params: StatsParams
    totals: { current: Totals; previous: Totals }
    series: { current: Record<Metric, number[]>; previous: Record<Metric, number[]> }
    pages: PageRow[]
    pageOptions: string[]
    sources: SourceRow[]
    sourceTypes: SourceTypeRow[]
    funnel: { current: FunnelCounts; previous: FunnelCounts }
    hasData: boolean
}

const num = (value: unknown): number => Number(value ?? 0)

/**
 * CTE `s`: tiap pageview diberi nomor sesi per pengunjung (jeda > SESSION_GAP_MINUTES = sesi baru),
 * penanda baris pertama sesi (`is_start`, dipakai untuk halaman awal dan sumber), dan periode (cur/prev).
 * Pageview tanpa ID pengunjung dianggap pengunjung tersendiri supaya tidak menyatu jadi satu sesi raksasa.
 */
function sessionCte(params: StatsParams): Sql {
  const tz = STATS_TZ
  const { current, previous } = params
  const startTs = sql`((${previous.from}::date)::timestamp at time zone ${tz})`
  const endTs = sql`(((${current.to}::date) + 1)::timestamp at time zone ${tz})`
  const gap = sql.raw(`interval '${SESSION_GAP_MINUTES} minutes'`)

  return sql`
    v as (
      select id, created_at, path, referrer,
             coalesce(visitor, 'anon-' || id::text) as vid,
             (created_at at time zone ${tz})::date as day,
             lag(created_at) over (partition by coalesce(visitor, 'anon-' || id::text) order by created_at, id) as prev_at
      from visits
      where created_at >= ${startTs} and created_at < ${endTs}
    ),
    s as (
      select v.*,
             case when day >= ${current.from}::date then 'cur' else 'prev' end as period,
             (prev_at is null or created_at - prev_at > ${gap}) as is_start,
             sum(case when prev_at is null or created_at - prev_at > ${gap} then 1 else 0 end)
               over (partition by vid order by created_at, id) as sess_no
      from v
    )`
}

const bucketExpr = (params: StatsParams): Sql => {
  const step = params.by === 'week' ? 7 : 1
  return sql`((day - case when period = 'cur' then ${params.current.from}::date else ${params.previous.from}::date end) / ${step}::int)`
}

/** Jumlah baris per (periode, bucket) plus total per periode (bucket null), untuk tabel bookings/contacts. */
async function countByBucket(run: (q: unknown) => Promise<Row[]>, params: StatsParams, table: 'bookings' | 'contacts') {
  const tz = STATS_TZ
  const startTs = sql`((${params.previous.from}::date)::timestamp at time zone ${tz})`
  const endTs = sql`(((${params.current.to}::date) + 1)::timestamp at time zone ${tz})`

  return run(sql`
    select period, bucket, count(*)::int as n
    from (
      select period, ${bucketExpr(params)} as bucket
      from (
        select (created_at at time zone ${tz})::date as day,
               case when (created_at at time zone ${tz})::date >= ${params.current.from}::date then 'cur' else 'prev' end as period
        from ${sql.raw(table)}
        where status <> 'spam' and created_at >= ${startTs} and created_at < ${endTs}
      ) d
    ) t
    group by grouping sets ((period, bucket), (period))
  `)
}

const emptySeries = (n: number): Record<Metric, number[]> => ({
    visitors: Array<number>(n).fill(0),
    sessions: Array<number>(n).fill(0),
    views: Array<number>(n).fill(0),
    bookings: Array<number>(n).fill(0),
    contacts: Array<number>(n).fill(0),
})

const emptyTotals = (): Omit<Totals, 'conversion'> => ({ visitors: 0, sessions: 0, views: 0, bookings: 0, contacts: 0 })

/** Agregasi langsung di Postgres, dikelompokkan menurut zona waktu STATS_TZ. */
export async function getVisitorReport(payload: Payload, params: StatsParams): Promise<VisitorReport> {
  const { drizzle } = payload.db as unknown as Db
  const run = async (query: unknown) => (await drizzle.execute(query)).rows

  const { current, previous, page } = params
  const tz = STATS_TZ
  const n = bucketCount(current.days, params.by)
  const cte = sessionCte(params)
  const pageFilter = page ? sql`path = ${page}` : sql`true`
  const startTs = sql`((${previous.from}::date)::timestamp at time zone ${tz})`
  const endTs = sql`(((${current.to}::date) + 1)::timestamp at time zone ${tz})`

  const [traffic, bookings, contacts, pages, sources, funnel, options] = await Promise.all([
    run(sql`
      with ${cte}
      select period, bucket,
             count(*)::int as views,
             count(distinct vid)::int as visitors,
             count(distinct vid || '#' || sess_no::text)::int as sessions
      from (select s.*, ${bucketExpr(params)} as bucket from s where ${pageFilter}) t
      group by grouping sets ((period, bucket), (period))
    `),
    countByBucket(run, params, 'bookings'),
    countByBucket(run, params, 'contacts'),
    run(sql`
      with ${cte}
      select path,
             (count(*) filter (where period = 'cur'))::int as views,
             (count(distinct vid) filter (where period = 'cur'))::int as visitors,
             (count(*) filter (where period = 'cur' and is_start))::int as entries,
             (count(*) filter (where period = 'prev'))::int as prev_views
      from s
      group by path
      having count(*) filter (where period = 'cur') > 0
      order by views desc, path
      limit 25
    `),
    run(sql`
      with ${cte}
      select coalesce(nullif(referrer, ''), '') as host,
             (count(*) filter (where period = 'cur'))::int as sessions,
             (count(*) filter (where period = 'prev'))::int as prev_sessions
      from s
      where is_start
        ${page ? sql`and (vid, sess_no) in (select vid, sess_no from s where path = ${page})` : sql``}
      group by 1
      order by sessions desc, host
      limit 500
    `),
    run(sql`
      with ${cte},
      f1 as (
        select vid, sess_no, min(created_at) as t1 from s where path = ${FUNNEL_PATHS.pricing} group by vid, sess_no
      ),
      f2 as (
        select f1.vid, f1.sess_no, min(s.created_at) as t2
        from f1 join s on s.vid = f1.vid and s.sess_no = f1.sess_no and s.path = ${FUNNEL_PATHS.booking} and s.created_at > f1.t1
        group by f1.vid, f1.sess_no
      ),
      f3 as (
        select f2.vid, f2.sess_no
        from f2 join s on s.vid = f2.vid and s.sess_no = f2.sess_no and s.path = ${FUNNEL_PATHS.success} and s.created_at > f2.t2
        group by f2.vid, f2.sess_no
      )
      select period,
             count(*)::int as pricing,
             (count(*) filter (where has2))::int as booking,
             (count(*) filter (where has3))::int as success
      from (
        select case when (f1.t1 at time zone ${tz})::date >= ${current.from}::date then 'cur' else 'prev' end as period,
               (f2.vid is not null) as has2,
               (f3.vid is not null) as has3
        from f1
        left join f2 on f2.vid = f1.vid and f2.sess_no = f1.sess_no
        left join f3 on f3.vid = f1.vid and f3.sess_no = f1.sess_no
      ) x
      group by period
    `),
    run(sql`
      select path, count(*)::int as n
      from visits
      where created_at >= ${startTs} and created_at < ${endTs}
      group by path
      order by n desc, path
      limit 40
    `),
  ])

  const series = { current: emptySeries(n), previous: emptySeries(n) }
  const sums = { current: emptyTotals(), previous: emptyTotals() }

  const fill = (rows: Row[], fields: Partial<Record<Metric, string>>) => {
    for (const row of rows) {
      const side = row.period === 'cur' ? 'current' : 'previous'
      for (const [metric, column] of Object.entries(fields) as [Metric, string][]) {
        if (row.bucket === null || row.bucket === undefined) sums[side][metric] = num(row[column])
        else {
          const i = num(row.bucket)
          if (i >= 0 && i < n) series[side][metric][i] = num(row[column])
        }
      }
    }
  }

  fill(traffic, { views: 'views', visitors: 'visitors', sessions: 'sessions' })
  fill(bookings, { bookings: 'n' })
  fill(contacts, { contacts: 'n' })

  const withConversion = (t: Omit<Totals, 'conversion'>): Totals => ({
    ...t,
    conversion: page ? 0 : rate(t.bookings + t.contacts, t.sessions),
  })

  const bySourceType = new Map<SourceType, SourceTypeRow>(SOURCE_TYPES.map((type) => [type, { type, sessions: 0, prevSessions: 0 }]))
  const sourceRows: SourceRow[] = sources.map((row) => {
    const host = String(row.host ?? '')
    const type = classifySource(host)
    const agg = bySourceType.get(type)!
    agg.sessions += num(row.sessions)
    agg.prevSessions += num(row.prev_sessions)
    return { host, type, sessions: num(row.sessions), prevSessions: num(row.prev_sessions) }
  })

  const funnelOf = (period: 'cur' | 'prev'): FunnelCounts => {
    const row = funnel.find((r) => r.period === period)
    return { pricing: num(row?.pricing), booking: num(row?.booking), success: num(row?.success) }
  }

  const totals = { current: withConversion(sums.current), previous: withConversion(sums.previous) }

  return {
    params,
    totals,
    series,
    pages: pages.map((r) => ({
      path: String(r.path),
      views: num(r.views),
      visitors: num(r.visitors),
      entries: num(r.entries),
      prevViews: num(r.prev_views),
    })),
    pageOptions: options.map((r) => String(r.path)),
    sources: sourceRows,
    sourceTypes: [...bySourceType.values()],
    funnel: { current: funnelOf('cur'), previous: funnelOf('prev') },
    hasData: totals.current.views + totals.previous.views > 0,
  }
}