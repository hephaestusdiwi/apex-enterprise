import { or } from "@payloadcms/db-postgres/drizzle"

export const FOLLOW_UP_STATUSES = ['new', 'contacted', 'deal', 'dropped'] as const

export type FollowUpStatus = (typeof FOLLOW_UP_STATUSES)[number]

export const FOLLOW_UP_LABELS: Record<FollowUpStatus, string> = {
    new: 'Baru',
    contacted: 'Dihubungi',
    deal: 'Deal',
    dropped: 'Tidak lanjut',
}

export const FOLLOW_UP_OPTIONS = FOLLOW_UP_STATUSES.map((value) => ({ label: FOLLOW_UP_LABELS[value], value }))

export type FollowUpData = {
    status?: FollowUpStatus | null
    notes?: string | null
    updatedAt?: string | null
}

/**
 * Tentukan isi `followUp` yang disimpan, atau `undefined` bila dokumen tidak perlu disentuh.
 *
 * - create: status awal "Baru" kalau belum diisi (data lama tidak diubah, jadi status kosong = belum diatur).
 * - update tanpa `followUp` di data (mis. job kedaluwarsa, ubah status booking): dibiarkan.
 * - update dengan `followUp`: `updatedAt` hanya berubah kalau status atau catatan benar-benar berubah,
 *   dan nilai kiriman klien untuk `updatedAt` tidak dipercaya.
 */
export function resolveFollowUp(
    incoming: FollowUpData | null | undefined,
    original: FollowUpData | null | undefined,
    operation: 'create' | 'update',
    now: Date = new Date(),
): FollowUpData | undefined {
    if (operation === 'create') return { ...incoming, status: incoming?.status ?? 'new' }
    if (!incoming) return undefined

    const same =
    (incoming.status ?? null) === (original?.status ?? null) &&
    (incoming.notes ?? '').trim() === (original?.notes ?? '').trim()

    return { ...incoming, updatedAt: same ? (original?.updatedAt ?? null): now.toISOString() }
}