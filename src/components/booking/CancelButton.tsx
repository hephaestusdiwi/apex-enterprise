'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { cancelBooking } from '@/app/(frontend)/booking/[kode]/actions'

const btn = 'text-sm underline underline-offset-[6px] transition-colors disabled:opacity-50 can-hover:hover:text-accent'

export function CancelButton({ code, token }: { code: string; token: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState<string>()
  const [pending, startTransition] = useTransition()

  const run = () =>
    startTransition(async () => {
      const r = await cancelBooking(code, token)
      if (r.ok) router.refresh()
      else {
        setMessage(r.message)
        setConfirming(false)
      }
    })

  return (
    <div className="mt-12">
      {confirming ? (
        <div className="flex items-center gap-8">
          <button type="button" disabled={pending} onClick={run} className={btn}>
            {pending ? 'Membatalkan…' : 'Ya, batalkan'}
          </button>
          <button type="button" disabled={pending} onClick={() => setConfirming(false)} className="text-sm text-mute underline underline-offset-[6px] can-hover:hover:text-ink">
            Tidak jadi
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className={btn}>Batalkan booking</button>
      )}
      {message ? <p role="alert" className="mt-4 text-sm text-accent">{message}</p> : null}
    </div>
  )
}