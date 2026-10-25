'use client'

import { toast, useAuth, useConfig, useDocumentInfo } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ROLE_LABEL, type UserRole } from '@/users/constants'
import { effectiveStatus, inviteState } from '@/users/rules'
import { call } from './editorialClient'
import { StatusChip } from './StatusCell'

type Ref = number | string | { id?: number | string; email?: string; name?: string | null } | null | undefined

type UserData = {
  email?: string
  name?: string | null
  role?: string | null
  status?: string | null
  createdAt?: string
  invitedBy?: Ref
  invitedAt?: string | null
  inviteExpiresAt?: string | null
  activatedAt?: string | null
  roleChangedBy?: Ref
  roleChangedAt?: string | null
  disabledBy?: Ref
  disabledAt?: string | null
}

const formatWhen = (iso: string | null | undefined): string => {
  if (!iso) return ''
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

const personLabel = (ref: Ref): string => {
  if (!ref) return ''
  if (typeof ref === 'object') return ref.name?.trim() || ref.email || ''
  return ''
}

const withWho = (who: Ref, when: string | null | undefined): string => {
  const date = formatWhen(when)
  const name = personLabel(who)
  return [date, name ? `oleh ${name}` : ''].filter(Boolean).join(' · ')
}

/**
 * Kartu akun di sidebar detail user: status, riwayat undangan/role/nonaktif, dan aksi
 * (kirim ulang undangan, nonaktifkan/aktifkan). Aksi hanya untuk admin; server tetap memeriksa ulang.
 */
export function UserAccountPanel() {
  const router = useRouter()
  const { id, initialData } = useDocumentInfo()
  const { user: me } = useAuth()
  const { config } = useConfig()
  const api = config.routes.api
  const [busy, setBusy] = useState(false)

  const data = (initialData ?? {}) as UserData
  if (!id || !data.email) return null

  const isAdmin = (me as { role?: string } | null)?.role === 'admin'
  const isSelf = String((me as { id?: unknown } | null)?.id ?? '') === String(id)
  const status = effectiveStatus(data)
  const invite = inviteState(data)
  const role = data.role === 'admin' ? 'admin' : 'editor'
  const title = data.name?.trim() || data.email

  const run = async (action: 'resend' | 'disable' | 'enable', success: string) => {
    setBusy(true)
    const result = await call('POST', `${api}/user-admin/${id}/${action}`)
    setBusy(false)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success(success)
    router.refresh()
  }

  const disable = () => {
    if (!window.confirm(`Nonaktifkan ${data.email}? Sesi login yang sedang berjalan akan diputus dan tautan undangan/reset yang beredar tidak berlaku lagi.`)) return
    void run('disable', 'Akun dinonaktifkan.')
  }

  return (
    <section className="apex-summary" aria-label="Akun user">
      <div className="apex-summary__who">
        <span className="apex-avatar" aria-hidden="true">
          {title.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="apex-summary__name">{title}</p>
          {data.name?.trim() ? <span className="apex-summary__sub">{data.email}</span> : null}
        </div>
      </div>

      <div className="apex-chips">
        <StatusChip value={invite === 'expired' ? 'invite_expired' : status} />
        <StatusChip value={role} />
      </div>

      <dl className="apex-summary__stats">
        {data.createdAt ? (
          <div className="apex-summary__wide">
            <dt>Dibuat</dt>
            <dd>{formatWhen(data.createdAt)}</dd>
          </div>
        ) : null}
        {data.invitedAt ? (
          <div className="apex-summary__wide">
            <dt>Diundang</dt>
            <dd>{withWho(data.invitedBy, data.invitedAt)}</dd>
          </div>
        ) : null}
        {status === 'invited' ? (
          <div className="apex-summary__wide">
            <dt>Undangan</dt>
            <dd>{invite === 'pending' ? `Berlaku sampai ${formatWhen(data.inviteExpiresAt)}` : 'Kedaluwarsa. Kirim ulang undangan.'}</dd>
          </div>
        ) : null}
        {data.activatedAt ? (
          <div className="apex-summary__wide">
            <dt>Menerima undangan</dt>
            <dd>{formatWhen(data.activatedAt)}</dd>
          </div>
        ) : null}
        {data.roleChangedAt ? (
          <div className="apex-summary__wide">
            <dt>Role terakhir diubah</dt>
            <dd>{withWho(data.roleChangedBy, data.roleChangedAt)}</dd>
          </div>
        ) : null}
        {status === 'disabled' && data.disabledAt ? (
          <div className="apex-summary__wide">
            <dt>Dinonaktifkan</dt>
            <dd>{withWho(data.disabledBy, data.disabledAt)}</dd>
          </div>
        ) : null}
      </dl>

      {isAdmin ? (
        <div className="apex-summary__actions">
          {status === 'invited' ? (
            <button type="button" className="apex-cta" disabled={busy} onClick={() => void run('resend', 'Undangan dikirim ulang.')}>
              {busy ? 'Memproses…' : 'Kirim ulang undangan'}
            </button>
          ) : null}
          {status === 'disabled' ? (
            <button type="button" className="apex-cta" disabled={busy} onClick={() => void run('enable', 'Akun diaktifkan kembali.')}>
              {busy ? 'Memproses…' : 'Aktifkan akun'}
            </button>
          ) : (
            <button type="button" className="apex-cta apex-cta--ghost apex-cta--danger" disabled={busy || isSelf} onClick={disable}>
              Nonaktifkan akun
            </button>
          )}
          <p className="apex-summary__note">
            {isSelf
              ? 'Anda tidak bisa menonaktifkan akun sendiri.'
              : `Nonaktifkan lebih disarankan daripada menghapus: riwayat kerja ${ROLE_LABEL[role as UserRole]} ini tetap tersimpan.`}
          </p>
        </div>
      ) : null}
    </section>
  )
}
