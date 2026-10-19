'use client'

import { useState, useTransition } from 'react'
import { submitBooking, type BookingField } from '@/app/(frontend)/booking/actions'
import type { PublicDay } from '@/app/(frontend)/booking/availability'
import type { PackageItem } from '@/content/packages'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { formatDateId } from '@/lib/dateFormat'
import { priceLabel } from '@/lib/price'

type Props = {
    packages: PackageItem[]
    token: string
    preselectId: number | null
    initialMonth: string
    initialDays: PublicDay[]
    minMonth: string
    maxMonth: string
}

type Values = { packageId: number | null; date: string | null; name: string; email: string; phone: string; notes: string }

const STEPS = ['Paket', 'Tanggal', 'Data diri', 'Ringkasan']
const inputClass =
  'w-full border-b border-mute/50 bg-transparent py-3 text-base outline-none transition-colors placeholder:text-mute/60 focus:border-ink'
const btn = 'text-sm underline underline-offset-[6px] transition-colors disabled:opacity-50 can-hover:hover:text-accent'

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
        <label htmlFor={id} className="mb-1 block text-xs text-mute">{label}</label>
        {children}
        {error ? <p id={`${id}-error`} className="mt-2 text-xs text-accent">{error}</p> : null}
        </div>
    )
}

export function BookingWizard({ packages, token, preselectId, initialMonth, initialDays, minMonth, maxMonth }: Props) {
    const [step, setStep] = useState(preselectId ? 1 : 0)
    const [v, setV] = useState<Values>({ packageId: preselectId, date: null, name: '', email: '', phone: '', notes: '' })
    const [website, setWebsite] = useState('')
    const [errors, setErrors] = useState<Partial<Record<BookingField, string>>>({})
    const [message, setMessage] = useState<string>()
    const [code, setCode] = useState<string | null>(null)
    const [doneStatus, setDoneStatus] = useState<'pending' | 'confirmed'>('pending')
    const [pending, startTransition] = useTransition()

    const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((x) => ({ ...x, [k]: val }))
    const pkg = packages.find((p) => p.id === v.packageId)

    const canNext =
        step === 0 ? v.packageId !== null
        : step === 1 ? v.date !== null
        : step === 2 ? Boolean(v.name.trim() && v.email.trim() && v.phone.trim())
        : true

    const submit = () => {
        setMessage(undefined)
        setErrors({})
        startTransition(async () => {
            const res = await submitBooking({
                packageId: v.packageId ?? 0,
                date: v.date ?? '',
                name: v.name,
                email: v.email,
                phone: v.phone,
                notes: v.notes,
                form_token: token,
                website,
            })
            if (res.ok && res.code) {
                setCode(res.code)
                setDoneStatus(res.status ?? 'pending')
                return
            }
            setErrors(res.errors ?? {})
            setMessage(res.message)
            if (res.errors?.packageId) setStep(0)
                else if (res.errors?.date) {
            set('date', null)
            setStep(1)
            }else if (res.errors) setStep(2)
        })
    }

if (code) {
    return (
      <div role="status">
        <p className="text-lg">{doneStatus === 'confirmed' ? 'Booking dikonfirmasi.' : 'Booking diterima.'}</p>
        <p className="mt-8 text-xs text-mute">Kode booking</p>
        <p data-testid="booking-code" className="text-3xl tracking-widest">{code}</p>
        <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="text-mute">Paket</dt><dd>{pkg?.title}</dd>
          <dt className="text-mute">Tanggal</dt><dd>{v.date ? formatDateId(v.date) : ''}</dd>
        </dl>
        <p className="mt-8 text-sm text-mute">
          {doneStatus === 'confirmed'
            ? 'Simpan kode ini. Detail booking dikirim ke emailmu.'
            : 'Simpan kode ini. Tim akan menghubungi lewat WhatsApp atau email untuk konfirmasi.'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-10 text-xs text-mute">Langkah {step + 1} dari {STEPS.length} · {STEPS[step]}</p>

      {step === 0 && (
        <fieldset>
          <legend className="sr-only">Pilih paket</legend>
          {packages.map((p) => (
            <label key={p.id} className="grid cursor-pointer gap-2 border-t border-mute/30 py-6 md:grid-cols-12">
              <input type="radio" name="package" className="peer sr-only" checked={v.packageId === p.id} onChange={() => set('packageId', p.id)} />
              <span className="peer-checked:text-accent peer-focus-visible:underline md:col-span-8">
                <span className="block text-lg">{p.title}</span>
                {p.tagline ? <span className="mt-1 block text-sm text-mute">{p.tagline}</span> : null}
              </span>
              <span className="text-sm peer-checked:text-accent md:col-span-4">
                {priceLabel(p)}
                {p.priceNote ? <span className="block text-xs text-mute">{p.priceNote}</span> : null}
              </span>
            </label>
          ))}
          {errors.packageId ? <p className="mt-2 text-xs text-accent">{errors.packageId}</p> : null}
        </fieldset>
      )}

      {step === 1 && (
        <div>
          <BookingCalendar
            value={v.date}
            onChange={(d) => set('date', d)}
            initialMonth={initialMonth}
            initialDays={initialDays}
            minMonth={minMonth}
            maxMonth={maxMonth}
          />
          {errors.date ? <p role="alert" className="mt-4 text-xs text-accent">{errors.date}</p> : null}
          <p className="mt-6 text-sm">{v.date ? formatDateId(v.date) : 'Pilih tanggal yang tersedia.'}</p>
        </div>
      )}

      {step === 2 && (
        <div className="flex max-w-xl flex-col gap-8">
          <Field id="name" label="Nama" error={errors.name}>
            <input id="name" type="text" autoComplete="name" maxLength={120} value={v.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input id="email" type="email" autoComplete="email" maxLength={254} value={v.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
          </Field>
          <Field id="phone" label="WhatsApp" error={errors.phone}>
            <input id="phone" type="tel" autoComplete="tel" maxLength={20} placeholder="08xxxxxxxxxx" value={v.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
          </Field>
          <Field id="notes" label="Catatan (opsional)" error={errors.notes}>
            <textarea id="notes" rows={4} maxLength={2000} value={v.notes} onChange={(e) => set('notes', e.target.value)} className={`${inputClass} resize-y`} />
          </Field>
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <input name="website" type="text" tabIndex={-1} autoComplete="new-password" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="sr-only">Ringkasan</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
            <dt className="text-mute">Paket</dt><dd>{pkg?.title} · {pkg ? priceLabel(pkg) : ''}</dd>
            <dt className="text-mute">Tanggal</dt><dd>{v.date ? formatDateId(v.date) : ''}</dd>
            <dt className="text-mute">Nama</dt><dd>{v.name}</dd>
            <dt className="text-mute">Email</dt><dd>{v.email}</dd>
            <dt className="text-mute">WhatsApp</dt><dd>{v.phone}</dd>
            {v.notes ? (<><dt className="text-mute">Catatan</dt><dd className="whitespace-pre-wrap">{v.notes}</dd></>) : null}
          </dl>
          <p className="mt-6 text-xs text-mute">Booking akan diproses setelah kamu menekan kirim.</p>
        </div>
      )}

      {message ? <p role="alert" className="mt-8 text-sm text-accent">{message}</p> : null}

      <div className="mt-12 flex items-center gap-8">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="text-sm text-mute underline underline-offset-[6px] can-hover:hover:text-ink">
            Kembali
          </button>
        ) : null}
        {step < 3 ? (
          <button type="button" disabled={!canNext} onClick={() => setStep(step + 1)} className={btn}>Lanjut</button>
        ) : (
          <button type="button" disabled={pending} onClick={submit} className={btn}>
            {pending ? 'Mengirim…' : 'Kirim booking'}
          </button>
        )}
      </div>
    </div>
  )
}
