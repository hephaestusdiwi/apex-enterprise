'use client'

import { useActionState } from 'react'
import { submitContact, type ContactField, type ContactState } from '@/app/(frontend)/contact/actions'

const initialState: ContactState = { ok: false }

const inputClass =
  'w-full border-b border-mute/50 bg-transparent py-3 text-base outline-none transition-colors placeholder:text-mute/60 focus:border-ink'

function Field({
  name,
  label,
  error,
  children,
}: {
  name: ContactField
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs text-mute">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-xs text-accent">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function ContactForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  if (state.ok) {
    return (
      <p role="status" className="text-lg">
        Terima kasih, pesanmu sudah terkirim.
      </p>
    )
  }

  const { errors, values } = state
  const invalid = (name: ContactField) => (errors?.[name] ? true : undefined)
  const describedBy = (name: ContactField) => (errors?.[name] ? `${name}-error` : undefined)

  return (
    <form action={formAction} className="flex flex-col gap-8" noValidate>
      <Field name="name" label="Nama" error={errors?.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          defaultValue={values?.name}
          aria-invalid={invalid('name')}
          aria-describedby={describedBy('name')}
          className={inputClass}
        />
      </Field>

      <Field name="email" label="Email" error={errors?.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          defaultValue={values?.email}
          aria-invalid={invalid('email')}
          aria-describedby={describedBy('email')}
          className={inputClass}
        />
      </Field>

      <Field name="subject" label="Subjek (opsional)" error={errors?.subject}>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={200}
          defaultValue={values?.subject}
          aria-invalid={invalid('subject')}
          aria-describedby={describedBy('subject')}
          className={inputClass}
        />
      </Field>

      <Field name="message" label="Pesan" error={errors?.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          defaultValue={values?.message}
          aria-invalid={invalid('message')}
          aria-describedby={describedBy('message')}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* Token waktu bertanda tangan dari server; dipakai untuk mendeteksi kiriman instan. */}
      <input type="hidden" name="form_token" defaultValue={token} />

      {/* Honeypot: tersembunyi untuk manusia dan screen reader. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input id="contact-check" name="contact_check" type="text" tabIndex={-1} autoComplete="new-password" />
      </div>

      {state.message ? (
        <p role="alert" className="text-sm text-accent">
          {state.message}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="text-sm underline underline-offset-[6px] transition-colors disabled:opacity-50 can-hover:hover:text-accent"
        >
          {pending ? 'Mengirim…' : 'Kirim pesan'}
        </button>
      </div>
    </form>
  )
}