export const EDITORIAL_COLLECTIONS = ['projects', 'pages', 'posts'] as const
export type EditorialCollection = (typeof EDITORIAL_COLLECTIONS)[number]

export const isEditorialCollection = (value: unknown): value is EditorialCollection =>
  typeof value === 'string' && (EDITORIAL_COLLECTIONS as readonly string[]).includes(value)

export const REVIEW_STATUSES = ['draft', 'in_review', 'changes_requested', 'approved'] as const
export type ReviewStatus = (typeof REVIEW_STATUSES)[number]

export const STATUS_LABEL: Record<ReviewStatus, string> = {
  draft: 'Draft',
  in_review: 'Menunggu review',
  changes_requested: 'Perlu revisi',
  approved: 'Disetujui',
}

export const NOTE_KINDS = ['comment', 'review', 'system'] as const
export type NoteKind = (typeof NOTE_KINDS)[number]

export const NOTE_MAX_LENGTH = 4000
export const MAX_REVIEWERS = 10
