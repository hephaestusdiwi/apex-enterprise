'use client'

import { toast, useAuth, useConfig, useListQuery } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { ROLE_LABEL, STATUS_LABEL, USER_ROLES, USER_STATUSES, type UserRole } from '@/users/constants'
import { call } from './editorialClient'

type Condition = Record<string, Record<string, unknown>>

const STATUS_PILLS = [{ value: '', label: 'Semua' }, ...USER_STATUSES.map((value) => ({ value, label: STATUS_LABEL[value] }))]

const toConditions = (where: unknown): Condition[] => {
  if (!where || typeof where !== 'object') return []
  const w = where as { and?: Condition[] } & Condition
  if (Array.isArray(w.and)) return w.and
  return Object.keys(w).length > 0 ? [w] : []
}

const without = (list: Condition[], field: string): Condition[] => list.filter((c) => !(field in c))

const equalsOf = (conditions: Condition[], field: string): string =>
  String((conditions.find((c) => field in c)?.[field] as { equals?: unknown } | undefined)?.equals ?? '')

/**
 * Di atas daftar user: filter status dan role (pencarian nama/email memakai kotak cari bawaan Payload),
 * serta panel "Undang user". User baru hanya dibuat lewat undangan email; tidak ada password sementara.
 */
export function UsersToolbar() {
  const router = useRouter()
  const { user } = useAuth()
  const { config } = useConfig()
  const api = config.routes.api
  const { query, refineListData } = useListQuery()

  const conditions = toConditions(query?.where)
  const status = equalsOf(conditions, 'status')
  const role = equalsOf(conditions, 'role')

  const apply = (next: Condition[]) => refineListData({ where: next.length > 0 ? { and: next } : {}, page: 1 })
  const setFilter = (field: 'status' | 'role', value: string) => {
    const rest = without(conditions, field)
    void apply(value ? [...rest, { [field]: { equals: value } }] : rest)
  }

  const canInvite = (user as { role?: string } | null)?.role === 'admin'
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [inviteRole, setInviteRole] = useState<UserRole>('editor')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const result = await call('POST', `${api}/user-admin/invite`, { email, name, role: inviteRole })
    setBusy(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    toast.success(`Undangan dikirim ke ${email.trim().toLowerCase()}.`)
    setEmail('')
    setName('')
    setInviteRole('editor')
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="apex-toolbar-stack">
      <div className="apex-toolbar">
        <div role="group" aria-label="Filter status akun" className="apex-pills">
          {STATUS_PILLS.map((pill) => (
            <button key={pill.value} type="button" className="apex-pill" aria-pressed={status === pill.value} onClick={() => setFilter('status', pill.value)}>
              {pill.label}
            </button>
          ))}
        </div>

        <select aria-label="Filter role" className="apex-select" value={role} onChange={(e) => setFilter('role', e.target.value)}>
          <option value="">Semua role</option>
          {USER_ROLES.map((value) => (
            <option key={value} value={value}>
              {ROLE_LABEL[value]}
            </option>
          ))}
        </select>

        {canInvite ? (
          <button type="button" className="apex-pill apex-pill--action" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? 'Tutup' : 'Undang user'}
          </button>
        ) : null}
      </div>

      {canInvite && open ? (
        <form className="apex-invite" onSubmit={(e) => void submit(e)} aria-label="Undang user">
          <p className="apex-invite__hint">
            Penerima mendapat email berisi tautan sekali pakai untuk membuat password sendiri. Tidak ada password sementara.
          </p>
          <div className="apex-invite__grid">
            <label className="apex-invite__field">
              <span>Email</span>
              <input name="email" type="email" required autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="apex-invite__field">
              <span>Nama (opsional)</span>
              <input name="name" type="text" maxLength={120} autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="apex-invite__field">
              <span>Role</span>
              <select name="role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as UserRole)}>
                {USER_ROLES.map((value) => (
                  <option key={value} value={value}>
                    {ROLE_LABEL[value]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {error ? (
            <p className="apex-invite__error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="apex-invite__actions">
            <button type="submit" className="apex-pill apex-pill--action" disabled={busy}>
              {busy ? 'Mengirim…' : 'Kirim undangan'}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
