import type { ServerProps } from 'payload'
import { isAdmin } from '@/access'
import { RETENTION_DAYS } from '@/collections/Visits'
import { getTrafficStats, STATS_DAYS, STATS_TZ, type DayStat, type NamedCount } from '@/lib/trafficStats'

const fmt = (n: number) => n.toLocaleString('id-ID')

const box = {
  background: 'var(--theme-elevation-50)',
  border: '1px solid var(--theme-elevation-100)',
  borderRadius: 4,
  padding: 16,
} as const

const label = { color: 'var(--theme-elevation-600)', fontSize: 12, margin: 0 } as const

const sum = (days: DayStat[], key: 'views' | 'visitors') => days.reduce((total, d) => total + d[key], 0)

function Card({ title, days }: { title: string; days: DayStat[] }) {
  return (
    <div style={box}>
      <p style={label}>{title}</p>
      <p style={{ fontSize: 28, fontWeight: 600, margin: '4px 0 0' }}>{fmt(sum(days, 'views'))}</p>
      <p style={{ ...label, marginTop: 2 }}>{fmt(sum(days, 'visitors'))} pengunjung</p>
    </div>
  )
}

function Chart({ days }: { days: DayStat[] }) {
  const max = Math.max(1, ...days.map((d) => d.views))
  const w = 10
  return (
    <svg
      viewBox={`0 0 ${days.length * w} 60`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Kunjungan per hari, ${days.length} hari terakhir`}
      style={{ width: '100%', height: 120, display: 'block' }}
    >
      {days.map((d, i) => {
        const h = d.views === 0 ? 0.5 : Math.max(1, (d.views / max) * 58)
        return (
          <rect key={d.day} x={i * w + 1} y={60 - h} width={w - 2} height={h} fill="var(--theme-text)" opacity={d.views === 0 ? 0.2 : 0.75}>
            <title>{`${d.day}: ${fmt(d.views)} kunjungan, ${fmt(d.visitors)} pengunjung`}</title>
          </rect>
        )
      })}
    </svg>
  )
}

function List({ title, rows, empty = 'Belum ada data' }: { title: string; rows: NamedCount[]; empty?: string }) {
  return (
    <div style={box}>
      <p style={{ ...label, marginBottom: 8 }}>{title}</p>
      {rows.length === 0 ? (
        <p style={{ ...label, margin: 0 }}>{empty}</p>
      ) : (
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6, fontSize: 13 }}>
          {rows.map((row) => (
            <li key={row.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
              <strong>{fmt(row.views)}</strong>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/** Ringkasan traffic di dashboard admin (hanya admin). Dipasang lewat admin.components.beforeDashboard. */
export async function TrafficStats({ payload, user }: ServerProps) {
  if (!isAdmin(user as { role?: string | null } | null | undefined)) return null

  let stats
  try {
    stats = await getTrafficStats(payload)
  } catch (err) {
    payload.logger.error({ err, msg: 'Gagal memuat statistik traffic' })
    return (
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 8 }}>Traffic</h2>
        <p style={label}>Statistik belum bisa dimuat. Pastikan tabel visits sudah ada (jalankan migrasi database).</p>
      </section>
    )
  }

  const { days } = stats
  const gridCols = 'repeat(auto-fit, minmax(220px, 1fr))'

  return (
    <section style={{ marginBottom: 32, display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Traffic</h2>

      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 12 }}>
        <Card title="Hari ini" days={days.slice(-1)} />
        <Card title="7 hari terakhir" days={days.slice(-7)} />
        <Card title={`${STATS_DAYS} hari terakhir`} days={days} />
      </div>

      <div style={box}>
        <p style={{ ...label, marginBottom: 8 }}>Kunjungan per hari ({STATS_DAYS} hari)</p>
        <Chart days={days} />
        <div style={{ ...label, display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span>{days[0]?.day}</span>
          <span>{days[days.length - 1]?.day}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 12 }}>
        <List title="Halaman teratas" rows={stats.topPages} />
        <List title="Sumber kunjungan" rows={stats.referrers} />
        <List title="Perangkat" rows={stats.devices} />
        <List title="Browser" rows={stats.browsers} />
        <List title="Negara" rows={stats.countries} empty="Perlu CDN yang mengirim header negara" />
      </div>

      <p style={{ ...label, fontSize: 11 }}>
        Zona waktu {STATS_TZ}. Pengunjung dihitung anonim per hari (tanpa cookie, IP tidak disimpan), jadi total
        pengunjung periode adalah jumlah pengunjung harian. Kunjungan bot dan staff yang sedang login tidak dihitung.
        Data disimpan {RETENTION_DAYS} hari.
      </p>
    </section>
  )
}
