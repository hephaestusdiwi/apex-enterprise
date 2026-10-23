'use client'

import { useAllFormFields, useDocumentInfo } from '@payloadcms/ui'
import { StatusChip } from './StatusCell'

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

const formatWhen = (iso: string): string => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

/** Kartu ringkasan di sidebar detail Pesan Kontak: siapa pengirim, kapan masuk, dan tombol balas. */
export function ContactSummary() {
  const [fields] = useAllFormFields()
  const { initialData } = useDocumentInfo()

  const name = text(fields.name?.value)
  const email = text(fields.email?.value)
  const subject = text(fields.subject?.value)
  const status = text(fields.status?.value)
  const received = formatWhen(text((initialData as { createdAt?: unknown } | undefined)?.createdAt))

  if (!name && !email) return null

  const mailto = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject || 'Pesan Anda'}`)}`

  return (
    <section className="apex-summary" aria-label="Ringkasan pesan">
      <div className="apex-summary__who">
        <span className="apex-avatar" aria-hidden="true">
          {(name || email).charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="apex-summary__name">{name || email}</p>
          {name && email ? <span className="apex-summary__sub">{email}</span> : null}
        </div>
      </div>

      <StatusChip value={status} />

      <dl className="apex-summary__stats">
        <div className="apex-summary__wide">
          <dt>Subjek</dt>
          <dd>{subject || 'Tanpa subjek'}</dd>
        </div>
        {received ? (
          <div className="apex-summary__wide">
            <dt>Diterima</dt>
            <dd>{received}</dd>
          </div>
        ) : null}
      </dl>

      {email ? (
        <div className="apex-summary__actions">
          <a className="apex-cta" href={mailto}>
            Balas lewat email
          </a>
        </div>
      ) : null}
    </section>
  )
}
