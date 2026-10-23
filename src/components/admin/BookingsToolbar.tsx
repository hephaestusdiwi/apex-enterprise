'use client'

import { eq } from '@payloadcms/db-postgres/drizzle'
import { useListQuery } from '@payloadcms/ui'

type Condition = Record<string, Record<string, unknown>>

const STATUSES = [
    { value: '', label: 'Pending' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Dikonfirmasi' },
    { value: 'completed', label: 'Selesai' },
    { value: 'rejected', label: 'Ditolak' },
    { value: 'expired', label: 'Kedaluwarsa' },
    { value: 'spam', label: 'spam' },
]

const toConditions = (where: unknown): Condition[] => {
    if (!where || typeof where !== 'object') return []
    const w = where as { and?: Condition[] } & Condition
    if (Array.isArray(w.and)) return w.and
    return Object.keys(w).length > 0 ? [w] : []
}

const without = (list: Condition[], field: string): Condition[] => list.filter((c) => !(field in c))

export function BookingsToolbar() {
  const { query, refineListData } = useListQuery()

  const conditions = toConditions(query?.where)
  const status = String((conditions.find((c) => 'status' in c)?.status as { equals?: unknown } | undefined)?.equals ?? '')

  const setStatus = (value: string) => {
    const rest = without(conditions, 'status')
    const next = value ? [...rest, { status: { equals: value } }] : rest
    void refineListData({ where: next.length > 0 ? { and: next } : {}, page: 1 })
  }

  return (
    <div className="apex-toolbar">
      <div role="group" aria-label="Filter status booking" className="apex-pills">
        {STATUSES.map((s) => (
          <button key={s.value} type="button" className="apex-pill" aria-pressed={status === s.value} onClick={() => setStatus(s.value)}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
