import { sql } from '@payloadcms/db-postgres/drizzle'
import type { Payload } from 'payload'

export const STATS_DAYS = 30
export const STATS_TZ = process.env.ANALYTICS_TZ || 'Asia/Jakarta'

type Row = Record<string, unknown>
type Db = { drizzle: { execute: (query: unknown) => Promise<{ rows: Row[] }> } }

export type DayStat = { day: string; views: number; visitors: number }
export type NamedCount = { name: string; views: number; visitors?: number }

export type TrafficStats = {
  days: DayStat[]
  topPages: NamedCount[]
  referrers: NamedCount[]
  devices: NamedCount[]
  browsers: NamedCount[]
  countries: NamedCount[]
}

const toNamed = (rows: Row[]): NamedCount[] =>
  rows.map((row) => ({
    name: String(row.name),
    views: Number(row.views),
    ...(row.visitors === undefined ? {} : { visitors: Number(row.visitors) }),
  }))

/** Agregasi langsung di Postgres, dikelompokkan per hari menurut zona waktu STATS_TZ. */
export async function getTrafficStats(payload: Payload): Promise<TrafficStats> {
  const { drizzle } = payload.db as unknown as Db
  const run = async (query: unknown) => (await drizzle.execute(query)).rows

  const tz = STATS_TZ
  const today = sql`(now() at time zone ${tz})::date`
  const since = sql`((${today} - ${STATS_DAYS - 1}::int)::timestamp at time zone ${tz})`

  const [days, topPages, referrers, devices, browsers, countries] = await Promise.all([
    run(sql`
      select to_char(d.day, 'YYYY-MM-DD') as day,
             coalesce(v.views, 0)::int as views,
             coalesce(v.visitors, 0)::int as visitors
      from generate_series(${today} - ${STATS_DAYS - 1}::int, ${today}, interval '1 day') as d(day)
      left join (
        select (created_at at time zone ${tz})::date as day,
               count(*) as views,
               count(distinct visitor) as visitors
        from visits
        where created_at >= ${since}
        group by 1
      ) v on v.day = d.day::date
      order by d.day
    `),
    run(sql`
      select path as name, count(*)::int as views, count(distinct visitor)::int as visitors
      from visits where created_at >= ${since}
      group by path order by views desc, path limit 8
    `),
    run(sql`
      select coalesce(nullif(referrer, ''), '(langsung)') as name, count(*)::int as views
      from visits where created_at >= ${since}
      group by 1 order by views desc, name limit 6
    `),
    run(sql`
      select coalesce(device, 'other') as name, count(*)::int as views
      from visits where created_at >= ${since}
      group by 1 order by views desc, name
    `),
    run(sql`
      select coalesce(browser, 'Other') as name, count(*)::int as views
      from visits where created_at >= ${since}
      group by 1 order by views desc, name limit 5
    `),
    run(sql`
      select country as name, count(*)::int as views
      from visits where created_at >= ${since} and country is not null
      group by 1 order by views desc, name limit 5
    `),
  ])

  return {
    days: days.map((row) => ({
      day: String(row.day),
      views: Number(row.views),
      visitors: Number(row.visitors),
    })),
    topPages: toNamed(topPages),
    referrers: toNamed(referrers),
    devices: toNamed(devices),
    browsers: toNamed(browsers),
    countries: toNamed(countries),
  }
}
