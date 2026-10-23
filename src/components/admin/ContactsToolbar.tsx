'use client'

import { toast, useListQuery, useSelection } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Condition = Record<string, Record<string, unknown>>

const STATUSES = [
  { value: '', label: 'Semua' },
  { value: 'new', label: 'Baru' },
  { value: 'read', label: 'Sudah dibaca' },
  { value: 'archived', label: 'Diarsipkan' },
  { value: 'spam', label: 'Spam' },
]

const RANGES = [
  { value: '', label: 'Semua tanggal', daysBack: null },
  { value: 'today', label: 'Hari ini', daysBack: 0 },
  { value: '7', label: '7 hari terakhir', daysBack: 6 },
  { value: '30', label: '30 hari terakhir', daysBack: 29 },
]

const startOfDay = (daysBack: number): Date => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - daysBack)
  return d
}

const toConditions = (where: unknown): Condition[] => {
  if (!where || typeof where !== 'object') return []
  const w = where as { and?: Condition[] } & Condition
  if (Array.isArray(w.and)) return w.and
  return Object.keys(w).length > 0 ? [w] : []
}

const without = (list: Condition[], field: string): Condition[] => list.filter((c) => !(field in c))

export function ContactsToolbar() {
  const router = useRouter()
  const { query, refineListData } = useListQuery()
  const { count, getQueryParams } = useSelection()
  const [busy, setBusy] = useState(false)

  const conditions = toConditions(query?.where)
  const status = String((conditions.find((c) => 'status' in c)?.status as { equals?: unknown } | undefined)?.equals ?? '')

  const dateCondition = conditions.find((c) => 'createdAt' in c)?.createdAt as { greater_than_equal?: unknown } | undefined
  const from = typeof dateCondition?.greater_than_equal === 'string' ? new Date(dateCondition.greater_than_equal).getTime() : null
  const range = !dateCondition
    ? ''
    : (RANGES.find((r) => r.daysBack !== null && startOfDay(r.daysBack).getTime() === from)?.value ?? 'custom')

  const apply = (next: Condition[]) => refineListData({ where: next.length > 0 ? { and: next } : {}, page: 1 })

  const setStatus = (value: string) => {
    const rest = without(conditions, 'status')
    void apply(value ? [...rest, { status: { equals: value } }] : rest)
  }

  const setRange = (value: string) => {
    const rest = without(conditions, 'createdAt')
    const preset = RANGES.find((r) => r.value === value)
    void apply(
      preset?.daysBack == null
        ? rest
        : [...rest, { createdAt: { greater_than_equal: startOfDay(preset.daysBack).toISOString() } }],
    )
  }

  const archive = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/api/contacts${getQueryParams()}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const result = (await res.json()) as { docs?: unknown[]; errors?: unknown[] }
      toast.success(`${result.docs?.length ?? 0} pesan diarsipkan.`)
      if (result.errors?.length) toast.error(`${result.errors.length} pesan gagal diarsipkan.`)
      router.refresh()
    } catch {
      toast.error('Gagal mengarsipkan pesan.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="apex-toolbar">
      <div role="group" aria-label="Filter status" className="apex-pills">
        {STATUSES.map((s) => (
          <button key={s.value} type="button" className="apex-pill" aria-pressed={status === s.value} onClick={() => setStatus(s.value)}>
            {s.label}
          </button>
        ))}
      </div>

      <select aria-label="Filter tanggal" className="apex-select" value={range} onChange={(e) => setRange(e.target.value)}>
        {RANGES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
        {range === 'custom' ? (
          <option value="custom" disabled>
            Tanggal kustom
          </option>
        ) : null}
      </select>

      {count > 0 ? (
        <button type="button" className="apex-pill apex-pill--action" disabled={busy} onClick={() => void archive()}>
          {busy ? 'Mengarsipkan…' : `Arsipkan ${count} terpilih`}
        </button>
      ) : null}
    </div>
  )
}
