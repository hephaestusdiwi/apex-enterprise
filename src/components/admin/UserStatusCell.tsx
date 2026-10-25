'use client'

import { inviteState } from '@/users/rules'
import { StatusChip } from './StatusCell'

/** Kolom status akun di daftar user. Undangan yang lewat batas waktu diberi tanda sendiri. */
export function UserStatusCell({ cellData, rowData }: { cellData?: unknown; rowData?: unknown }) {
  const row = (rowData ?? {}) as { inviteExpiresAt?: string | null }
  const status = typeof cellData === 'string' ? cellData : 'active'
  const expired = status === 'invited' && inviteState({ status, inviteExpiresAt: row.inviteExpiresAt }) === 'expired'
  return <StatusChip value={expired ? 'invite_expired' : status} />
}
