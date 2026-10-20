import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { CancelButton } from '@/components/booking/CancelButton'
import { canClientCancel, findBookingByToken } from '@/lib/bookingAccess'
import { formatDateId } from '@/lib/dateFormat'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Status booking',
    robots: { index: false },
    referrer: 'no-referrer'
}

const STATUS: Record<string, { label: string; hint: string }> = {
    pending: {
        label: 'Menunggu konfirmasi',
        hint: 'Tim akan menghubungi kamu lewat Whatsapp atau Email'
    },
    confirmed: {
        label: 'Dikonfirmasi',
        hint: 'Sampai jumpa di tanggal tersebut'
    },
    rejected: {
        label: 'Tidak dapat diproses',
        hint: 'Silahkan buat booking baru dengan tanggal lain'
    },
    cancelled: {
        label: 'Dibatalkan',
        hint: ''
    },
    expired: {
        label: 'Kedaluwarsa',
        hint: 'Slot sudah dilepas, silahkan buat booking baru'
    },
    completed: {
        label: 'Selesai',
        hint: 'Terima kasih'
    },
}

export default async function BookingStatusPage({
    params,
    searchParams,
}: {
    params: Promise<{ kode: string }>
    searchParams: Promise<{ token?: string}>
}) {
    const [{ kode }, { token }] = await Promise.all([params, searchParams])

    const h = await headers()
    const ip = h.get('x-forwared-for')?.split(',')[0]?.trim() || h.get('x-real-ip') ||  'unknown'
    if (!rateLimit(`status:${ip}`, 30, 60_000)) notFound()

    const payload = await getPayloadClient()
    const b = await findBookingByToken(payload, kode, typeof token === 'string' ? token : '')
    if (!b) notFound()

    const s = STATUS[b.status] ?? { label: b.status, hint: '' }
    const note = ['confirmed', 'rejected', 'cancelled'].includes(b.status) ? (b.statusNote ?? '').trim() : ''

    return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-28 pb-24 md:px-10 md:pt-36">
      <p className="text-xs text-mute">Kode booking</p>
      <h1 className="text-3xl tracking-widest">{b.code}</h1>

      <p data-testid="booking-status" className="mt-8 text-lg">{s.label}</p>
      {s.hint ? <p className="mt-2 text-sm text-mute">{s.hint}</p> : null}

      <dl className="mt-10 grid max-w-xl gap-3 text-sm sm:grid-cols-[8rem_1fr]">
        <dt className="text-mute">Paket</dt><dd>{b.packageTitle}</dd>
        <dt className="text-mute">Tanggal</dt><dd>{formatDateId(b.date)}</dd>
        <dt className="text-mute">Nama</dt><dd>{b.name}</dd>
        {note ? (<><dt className="text-mute">Pesan tim</dt><dd className="whitespace-pre-wrap">{note}</dd></>) : null}
      </dl>

      {canClientCancel(b) ? <CancelButton code={b.code} token={token ?? ''} /> : null}
    </section>
  )
}