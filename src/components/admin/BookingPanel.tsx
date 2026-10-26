import Link from 'next/link'
import { bookingDayLabel, fullDate, timeAgo, UPCOMING_BOOKING_DAYS, type DashboardBooking, type DashboardBookings } from '@/lib/dashboard'

type Props = {
  data: DashboardBookings | null
  admin: string
  now: Date
}

const ArrowIcon = () => (
  <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

function BookingRow({ booking, admin, today, showAge, now }: { booking: DashboardBooking; admin: string; today: string; showAge: boolean; now: Date }) {
  return (
    <li>
      <Link href={`${admin}/collections/bookings/${booking.id}`} className="apex-row">
        <span className="apex-row__title">{booking.name}</span>
        <span className="apex-row__text">{booking.packageTitle ?? booking.code}</span>
        <span className="apex-row__meta">
          <span>{bookingDayLabel(booking.date, today)}</span>
          {showAge ? (
            <time dateTime={booking.createdAt} title={fullDate(booking.createdAt)}>
              Masuk {timeAgo(booking.createdAt, now)}
            </time>
          ) : (
            <span>{booking.code}</span>
          )}
        </span>
      </Link>
    </li>
  )
}

function Group({
  title,
  empty,
  items,
  total,
  today,
  admin,
  now,
  moreHref,
  showAge,
}: {
  title: string
  empty: string
  items: DashboardBooking[]
  total: number
  today: string
  admin: string
  now: Date
  moreHref: string
  showAge: boolean
}) {
  return (
    <div className="apex-subgroup">
      <h3 className="apex-subgroup__title">{title}</h3>
      {items.length === 0 ? (
        <p className="apex-empty">{empty}</p>
      ) : (
        <ul className="apex-list">
          {items.map((booking) => (
            <BookingRow key={booking.id} booking={booking} admin={admin} today={today} showAge={showAge} now={now} />
          ))}
        </ul>
      )}
      {total > items.length ? (
        <Link href={moreHref} className="apex-link apex-subgroup__more">
          +{total - items.length} lainnya
          <ArrowIcon />
        </Link>
      ) : null}
    </div>
  )
}

/** Ringkasan booking untuk dashboard: booking baru, pending dan mendatang */
export function BookingPanel({ data, admin, now }: Props) {
  const list = `${admin}/collections/bookings`
  const calendar = `${admin}/booking-calendar`

  return (
    <section className="apex-panel" aria-labelledby="apex-bookings-title">
      <div className="apex-section__head">
        <h2 id="apex-bookings-title">
          Booking
          {data && data.pending.total > 0 ? (
            <span className="apex-count" aria-label={`${data.pending.total} menunggu konfirmasi`}>
              {data.pending.total > 99 ? '99+' : data.pending.total}
            </span>
          ) : null}
        </h2>
        <Link href={calendar} className="apex-link">
          Kalender
          <ArrowIcon />
        </Link>
      </div>

      {data === null ? (
        <p className="apex-empty" role="status">
          Data booking belum bisa dimuat. Coba muat ulang halaman; detail kesalahan ada di log server.
        </p>
      ) : (
        <>
          <ul className="apex-stats">
            <li>
              <Link
                href={`${list}?where[createdAt][greater_than_equal]=${encodeURIComponent(data.fresh.since)}`}
                className="apex-stat"
              >
                <span className="apex-stat__num">{data.fresh.total}</span>
                <span className="apex-stat__label">Baru (24 jam)</span>
              </Link>
            </li>
            <li>
              <Link href={`${list}?where[status][equals]=pending`} className="apex-stat">
                <span className="apex-stat__num">{data.pending.total}</span>
                <span className="apex-stat__label">Menunggu konfirmasi</span>
              </Link>
            </li>
            <li>
              <Link href={calendar} className="apex-stat">
                <span className="apex-stat__num">{data.upcoming.total}</span>
                <span className="apex-stat__label">{UPCOMING_BOOKING_DAYS} hari ke depan</span>
              </Link>
            </li>
          </ul>

          <Group
            title="Menunggu konfirmasi"
            empty="Tidak ada booking yang menunggu."
            items={data.pending.items}
            total={data.pending.total}
            today={data.today}
            admin={admin}
            now={now}
            moreHref={`${list}?where[status][equals]=pending`}
            showAge
          />
          <Group
            title="Jadwal mendatang"
            empty={`Belum ada jadwal dikonfirmasi dalam ${UPCOMING_BOOKING_DAYS} hari ke depan.`}
            items={data.upcoming.items}
            total={data.upcoming.total}
            today={data.today}
            admin={admin}
            now={now}
            moreHref={calendar}
            showAge={false}
          />
        </>
      )}
    </section>
  )
}
