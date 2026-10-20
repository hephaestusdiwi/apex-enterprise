import Link from 'next/link'
import type { ServerProps } from 'payload'
import { isStaff } from '@/access'

export async function BookingNavLinks({ payload, user }: ServerProps) {
  if (!isStaff(user as { role?: string | null } | null | undefined) || !user) return null

  const { totalDocs } = await payload.count({ collection: 'bookings', where: { status: { equals: 'pending' } } })
  const admin = payload.config.routes.admin
  const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } as const

  return (
    <>
      <Link href={`${admin}/collections/bookings?where[status][equals]=pending`} className="nav__link" style={row}>
        <span className="nav__link-label">Booking pending</span>
        {totalDocs > 0 ? (
          <span style={{ background: 'var(--theme-elevation-800)', color: 'var(--theme-elevation-0)', borderRadius: 10, fontSize: 11, padding: '0 6px' }}>
            {totalDocs}
          </span>
        ) : null}
      </Link>
      <Link href={`${admin}/booking-calendar`} className="nav__link">
        <span className="nav__link-label">Kalender booking</span>
      </Link>
    </>
  )
}