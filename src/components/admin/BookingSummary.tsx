'use client'

import { useAllFormFields } from '@payloadcms/ui'
import { formatDateId } from '@/lib/dateFormat'
import { formatIdr } from '@/lib/price'
import { StatusChip } from './StatusCell'

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')
const YMD = /^\d{4}-\d{2}-\d{2}$/

const whatsappNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits
}

export function BookingSummary() {
  const [fields] = useAllFormFields()

  const code = text(fields.code?.value)
  const name = text(fields.name?.value)
  const email = text(fields.email?.value)
  const phone = text(fields.phone?.value)
  const status = text(fields.status?.value)
  const pkg = text(fields.packageTitle?.value)
  const date = text(fields.date?.value)
  const price = fields.packagePrice?.value

  if (!code && !name) return null

  const wa = whatsappNumber(phone)

  return (
    <section className="apex-summary" aria-label="Ringkasan booking">
      <div className="apex-summary__who">
        <span className="apex-avatar" aria-hidden="true">
          {(name || code).charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="apex-summary__name">{name || code}</p>
          {code ? <span className="apex-summary__sub">{code}</span> : null}
        </div>
      </div>

      <StatusChip value={status} />

      <dl className="apex-summary__stats">
        {pkg ? (
          <div className="apex-summary__wide">
            <dt>Paket</dt>
            <dd>{pkg}</dd>
          </div>
        ) : null}
        {YMD.test(date) ? (
          <div className="apex-summary__wide">
            <dt>Tanggal</dt>
            <dd>{formatDateId(date)}</dd>
          </div>
        ) : null}
        {typeof price === 'number' ? (
          <div>
            <dt>Harga</dt>
            <dd>{formatIdr(price)}</dd>
          </div>
        ) : null}
        {phone ? (
          <div>
            <dt>WhatsApp</dt>
            <dd>{phone}</dd>
          </div>
        ) : null}
      </dl>

      {wa || email ? (
        <div className="apex-summary__actions">
          {wa ? (
            <a className="apex-cta" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
              Hubungi via WhatsApp
            </a>
          ) : null}
          {email ? (
            <a
              className={wa ? 'apex-cta apex-cta--ghost' : 'apex-cta'}
              href={`mailto:${email}?subject=${encodeURIComponent(`Booking ${code}`.trim())}`}
            >
              Kirim email
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
