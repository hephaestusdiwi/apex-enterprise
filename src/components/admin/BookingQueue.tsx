import type { ServerProps } from 'payload'
import { isStaff } from '@/access'
import { addDays, todayInJakarta } from '@/lib/availability'
import { formatDateShort } from '@/lib/dateFormat'
import type { Booking } from '@/payload-types'

const box = {
    background: 'var(--theme-elevation-50)',
    border: '1px solid var(--theme-elevation-100)',
    borderRadius: 4,
    padding: 16,
} as const

const label = {
    color: 'var(--theme-elevation-600)',
    fontSize: 12,
    margin: 0
} as const

function List({ title, items, admin }: { title: string; items: Booking[]; admin: string }) {
  if (items.length === 0) return null
  return (
    <div style={box}>
      <p style={{ ...label, marginBottom: 8 }}>{title}</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6, fontSize: 13 }}>
        {items.map((b) => (
          <li key={b.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <a href={`${admin}/collections/bookings/${b.id}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {b.code} · {b.name} · {b.packageTitle}
            </a>
            <span style={{ ...label, whiteSpace: 'nowrap' }}>{formatDateShort(b.date)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Dashboard admin: booking yang perlu ditindak dan yang datang 7 hari ke depan. */
export async function BookingQueue({ payload, user }: ServerProps) {
  if (!isStaff(user as { role?: string | null } | null | undefined) || !user) return null

  try {
    const today = todayInJakarta()
    const admin = payload.config.routes.admin
    const common = { collection: 'bookings', sort: 'date', limit: 8, depth: 0, user, overrideAccess: false } as const

    const [pending, upcoming] = await Promise.all([
      payload.find({ ...common, where: { status: { equals: 'pending' } } }),
      payload.find({
        ...common,
        where: {
          and: [
            { status: { equals: 'confirmed' } },
            { date: { greater_than_equal: today } },
            { date: { less_than_equal: addDays(today, 7) } },
          ],
        },
      }),
    ])
    if (pending.docs.length === 0 && upcoming.docs.length === 0) return null

    return (
      <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
        <List title="Booking menunggu konfirmasi" items={pending.docs} admin={admin} />
        <List title="Booking dikonfirmasi, 7 hari ke depan" items={upcoming.docs} admin={admin} />
      </div>
    )
  } catch {
    return null
  }
}