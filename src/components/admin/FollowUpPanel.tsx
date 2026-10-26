import Link from 'next/link'
import { FOLLOW_UP_SOURCE_STATUSES, type DashboardFollowUp } from '@/lib/dashboard'
import type { FollowUpStatus } from '@/lib/followUp'

type Props = {
    data: DashboardFollowUp | null
    admin: string
    canContacts: boolean
    canBookings: boolean
}

const listHref = (admin: string, collection: 'contacts' | 'bookings', status: FollowUpStatus): string => {
    const parents = FOLLOW_UP_SOURCE_STATUSES[collection].join(',')
    return (
    `${admin}/collections/${collection}` +
    `?where[and][0][followUp.status][equals]=${status}` +
    `&where[and][1][status][in]=${parents}`
  )
}

type Row = { key: string; label: string; count: number; href: string }

export function FollowUpPanel({ data, admin, canContacts, canBookings }: Props) {
    const rows: Row[] = []
    if (data && canContacts) {
        rows.push(
            { key: 'c-new', label: 'Pesan belum dihubungi', count: data.contacts.fresh, href: listHref(admin, 'contacts', 'new') },
            { key: 'c-contacted', label: 'Pesan sedang di-follow-up', count: data.contacts.contacted, href: listHref(admin, 'contacts', 'contacted') },
        )
    }
    if (data && canBookings) {
        rows.push(
            { key: 'b-new', label: 'Booking belum dihubungi', count: data.bookings.fresh, href: listHref(admin, 'bookings', 'new') },
            { key: 'b-contacted', label: 'Booking sedang di-follow-up', count: data.bookings.contacted, href: listHref(admin, 'bookings', 'contacted') },
        )
    }

    if (!canContacts && !canBookings) return null
    const open = rows.filter((row) => row.count > 0)
    const needAction = rows.filter((row) => row.key.endsWith('-new')).reduce((sum, row) => sum + row.count, 0)

    return (
    <section className="apex-panel" aria-labelledby="apex-followup-title">
      <div className="apex-section__head">
        <h2 id="apex-followup-title">
          Follow-up prospek
          {needAction > 0 ? (
            <span className="apex-count" aria-label={`${needAction} belum dihubungi`}>
              {needAction > 99 ? '99+' : needAction}
            </span>
          ) : null}
        </h2>
      </div>

      {data === null ? (
        <p className="apex-empty" role="status">
          Data follow-up belum bisa dimuat. Coba muat ulang halaman; detail kesalahan ada di log server.
        </p>
      ) : open.length === 0 ? (
        <p className="apex-empty">Semua prospek sudah ditangani.</p>
      ) : (
        <ul className="apex-list">
          {open.map((row) => (
            <li key={row.key}>
              <Link href={row.href} className="apex-row apex-row--count">
                <span className="apex-row__title">{row.label}</span>
                <span className="apex-row__num">{row.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}