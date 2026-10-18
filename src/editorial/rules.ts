import type { ReviewStatus } from './constants'
import { MAX_REVIEWERS } from './constants'

export type Role = 'admin' | 'editor'
export type Actor = { id:string; role: Role }

export type ReviewState = {
    status: ReviewStatus
    reviewerIds: string[]
    requestedById: string | null
}

export type ReviewAction = 'request' | 'approve' | 'changes' | 'withdraw'
export const isReviewAction = (value: unknown): value is ReviewAction =>
    value === 'request' || value === 'approve' || value === 'changes' || value === 'withdraw'

export type RuleResult =
| { ok: true; next: ReviewStatus; reviewerIds: string[] }
| { ok: false; message: string }

const fail = (message: string): RuleResult => ({ ok: false, message })

export function evaluateAction(
  action: ReviewAction,
  state: ReviewState,
  actor: Actor,
  input: { reviewerIds?: string[]; note?: string } = {},
): RuleResult {
  const isAdmin = actor.role === 'admin'

  if (action === 'request') {
    if (state.status === 'in_review') {
      return fail('Review sedang berjalan. Tarik kembali dulu kalau ingin mengganti reviewer.')
    }
    const picked = [...new Set((input.reviewerIds ?? []).map(String))]
    const reviewers = isAdmin ? picked : picked.filter((id) => id !== actor.id)
    if (reviewers.length === 0) {
      return fail(
        picked.length > 0 ? 'Pilih reviewer selain dirimu sendiri.' : 'Pilih minimal satu reviewer.',
      )
    }
    if (reviewers.length > MAX_REVIEWERS) return fail(`Maksimal ${MAX_REVIEWERS} reviewer.`)
    return { ok: true, next: 'in_review', reviewerIds: reviewers }
  }

  if (action === 'approve' || action === 'changes') {
    if (state.status !== 'in_review') return fail('Tidak ada review yang sedang menunggu keputusan.')
    if (!isAdmin && !state.reviewerIds.includes(actor.id)) {
      return fail('Hanya reviewer yang ditunjuk (atau admin) yang bisa memutuskan.')
    }
    if (!isAdmin && state.requestedById === actor.id) {
      return fail('Kamu tidak bisa memutuskan review yang kamu minta sendiri.')
    }
    if (action === 'changes' && !(input.note ?? '').trim()) {
      return fail('Tulis catatan revisi supaya penulis tahu apa yang perlu diperbaiki.')
    }
    return {
      ok: true,
      next: action === 'approve' ? 'approved' : 'changes_requested',
      reviewerIds: state.reviewerIds,
    }
  }

  // withdraw
  if (state.status === 'draft') return fail('Belum ada review yang bisa ditarik.')
  if (!isAdmin && state.requestedById !== actor.id) {
    return fail('Hanya peminta review (atau admin) yang bisa menariknya kembali.')
  }
  return { ok: true, next: 'draft', reviewerIds: state.reviewerIds }
}

export type GateInput = {
    requireApproval: boolean
    actor: Actor | null
    status: ReviewStatus | null
    approvedFingerprint: string | null
    currentFingerprint: string
}

export type GateResult = { allowed: true } | { allowed: false; message: string }

/** Boleh dipublikasikan? Admin dan proses sistem selalu boleh. */
export function evaluatePublishGate(input: GateInput): GateResult {
  if (!input.requireApproval) return { allowed: true }
  if (input.actor === null || input.actor.role === 'admin') return { allowed: true }
  if (input.status !== 'approved') {
    return { allowed: false, message: 'Konten belum disetujui reviewer, jadi belum bisa dipublikasikan.' }
  }
  if (!input.approvedFingerprint || input.approvedFingerprint !== input.currentFingerprint) {
    return {
      allowed: false,
      message: 'Konten berubah setelah disetujui. Minta review ulang sebelum dipublikasikan.',
    }
  }
  return { allowed: true }
}
