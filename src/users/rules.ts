import { stat } from 'fs';
import { USER_ROLES, USER_STATUSES, UserStatus, type UserRole } from './constants'
import { act } from 'react';

export type Person = { id: string | number; role?: string | null; status?: string | null }

const sameUser = (a: Person, b: Person) => String(a.id) === String(b.id)

export const effectiveStatus = (user: Pick<Person, 'status'>): UserStatus =>
    USER_STATUSES.find((status) => status === user.status) ?? 'active'

export const isActiveUser = (user: Pick<Person, 'status'> | null | undefined): boolean =>
    !user || effectiveStatus(user) === 'active'

export const isActiveAdmin = (user: Person): boolean => user.role === 'admin' && effectiveStatus(user) === 'active'

const needsAdmin = (actor: Person): string | null =>
  isActiveAdmin(actor) ? null : 'Hanya admin yang bisa mengelola user.'

/**
 * Nonaktifkan atau aktifkan akun. `otherActiveAdmins` = jumlah admin aktif selain target.
 * Menonaktifkan diri sendiri selalu ditolak, dan admin terakhir tidak boleh hilang.
 */
export function checkStatusChange(input: {
  actor: Person
  target: Person
  next: Extract<UserStatus, 'active' | 'disabled'>
  otherActiveAdmins: number
}): string | null {
  const { actor, target, next, otherActiveAdmins } = input
  const denied = needsAdmin(actor)
  if (denied) return denied
  if (next === 'disabled') {
    if (sameUser(actor, target)) return 'Anda tidak bisa menonaktifkan akun sendiri.'
    if (isActiveAdmin(target) && otherActiveAdmins < 1) return 'Tidak bisa menonaktifkan admin terakhir.'
  }
  return null
}

/** Ganti role. Menurunkan admin terakhir ditolak (juga bila dilakukan admin itu sendiri). */
export function checkRoleChange(input: {
  actor: Person
  target: Person
  nextRole: string
  otherActiveAdmins: number
}): string | null {
  const { actor, target, nextRole, otherActiveAdmins } = input
  const denied = needsAdmin(actor)
  if (denied) return denied
  if (!USER_ROLES.some((role) => role === nextRole)) return 'Role tidak dikenal.'
  if (target.role === 'admin' && nextRole !== 'admin' && isActiveAdmin(target) && otherActiveAdmins < 1) {
    return sameUser(actor, target)
      ? 'Anda admin terakhir. Jadikan user lain admin dulu sebelum menurunkan role Anda.'
      : 'Tidak bisa menurunkan admin terakhir.'
  }
  return null
}

/** Hapus akun: nonaktifkan lebih disarankan, dan tidak boleh menghapus diri sendiri atau admin terakhir. */
export function checkDelete(input: { actor: Person; target: Person; otherActiveAdmins: number }): string | null {
  const { actor, target, otherActiveAdmins } = input
  const denied = needsAdmin(actor)
  if (denied) return denied
  if (sameUser(actor, target)) return 'Anda tidak bisa menghapus akun sendiri.'
  if (isActiveAdmin(target) && otherActiveAdmins < 1) return 'Tidak bisa menghapus admin terakhir.'
  return null
}

export type InviteState = 'none' | 'pending' | 'expired'

/** Status undangan untuk tampilan. Undangan tanpa batas waktu (mis. akun diaktifkan ulang) dianggap perlu dikirim ulang. */
export function inviteState(
  user: { status?: string | null; inviteExpiresAt?: string | null },
  now: Date = new Date(),
): InviteState {
  if (effectiveStatus(user) !== 'invited') return 'none'
  const expires = user.inviteExpiresAt ? new Date(user.inviteExpiresAt).getTime() : NaN
  return Number.isFinite(expires) && expires > now.getTime() ? 'pending' : 'expired'
}

export const roleOf = (value: unknown): UserRole => (value === 'admin' ? 'admin' : 'editor')
