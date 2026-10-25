export const USER_ROLES = ['admin', 'editor'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const USER_STATUSES = ['invited', 'active', 'disabled'] as const
export type UserStatus = (typeof USER_STATUSES)[number]

export const ROLE_LABEL: Record<UserRole, string> = { admin: 'Admin', editor: 'Editor' }
export const STATUS_LABEL: Record<UserStatus, string> = { invited: 'Diundang', active: 'Aktif', disabled: 'Nonaktif' }

export const isUserRole = (value: unknown): value is UserRole => USER_ROLES.some((role) => role === value)

const MAX_INVITE_HOURS = 24 * 14
export const inviteTtlMs = (raw: string | undefined = process.env.USER_INVITE_EXPIRY_HOURS): number => {
    const hours = Number(raw)
    const safe = Number.isFinite(hours) && hours >= 1 ? Math.min(hours, MAX_INVITE_HOURS) : 72
    return Math.round(safe * 60 * 60 * 1000)
}

export const RESEND_COOLDOWN_MS = 60_000

export const NAME_MAX_LENGTH = 120
export const API_BASE = '/api/user-admin'