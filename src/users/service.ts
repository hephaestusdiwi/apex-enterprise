import { randomBytes } from 'node:crypto'
import { commitTransaction, createLocalReq, initTransaction, killTransaction, type Payload, type PayloadRequest } from 'payload'
import { NAME_MAX_LENGTH, RESEND_COOLDOWN_MS, inviteTtlMs, isUserRole, type UserRole } from './constants'
import { buildInviteEmail } from './inviteEmail'
import { checkStatusChange, effectiveStatus, isActiveAdmin, type Person } from './rules'

export type Actor = {
  id: number | string
  email: string
  name?: string | null
  role?: string | null
  status?: string | null
}

export type Failure = { ok: false; status: number; message: string }
export type ServiceResult<T extends object = object> = ({ ok: true } & T) | Failure

const fail = (status: number, message: string): Failure => ({ ok: false, status, message })

const siteUrl = () => (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const normalizeEmail = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null
}

/** Adapter bawaan "console" hanya mencatat email, tidak mengirimnya. Undangan butuh SMTP sungguhan. */
export const isEmailConfigured = (payload: Payload): boolean => Boolean(payload.email) && payload.email.name !== 'console'

/** Password acak untuk akun yang baru diundang. Tidak disimpan, ditampilkan, atau dikirim ke mana pun. */
const unknownPassword = (): string => randomBytes(48).toString('base64url')

/** Audit hanya mencatat id, tidak pernah token atau tautan undangan. */
const audit = (payload: Payload, event: string, actor: Actor, targetId: number | string) => {
  payload.logger.info({ msg: `user-admin: ${event}`, event, actorId: actor.id, targetId })
}

const localReq = (payload: Payload, actor: Actor): Promise<PayloadRequest> =>
  createLocalReq({ user: { ...actor, collection: 'users' } as never }, payload)

/** Jumlah admin aktif selain `excludeId`. */
export async function countOtherActiveAdmins(payload: Payload, excludeId: number | string, req?: PayloadRequest): Promise<number> {
  const { totalDocs } = await payload.count({
    collection: 'users',
    where: {
      and: [{ role: { equals: 'admin' } }, { status: { equals: 'active' } }, { id: { not_equals: excludeId } }],
    },
    overrideAccess: true,
    req,
  })
  return totalDocs
}

const requireAdmin = (actor: Actor): Failure | null =>
  isActiveAdmin(actor) ? null : fail(403, 'Hanya admin yang bisa mengelola user.')

type UserDoc = {
  id: number | string
  email: string
  name?: string | null
  role?: string | null
  status?: string | null
  invitedAt?: string | null
  activatedAt?: string | null
}

async function findByEmail(payload: Payload, email: string, req?: PayloadRequest): Promise<UserDoc | null> {
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req,
  })
  return (docs[0] as UserDoc | undefined) ?? null
}

async function findById(payload: Payload, id: unknown, req?: PayloadRequest): Promise<UserDoc | null> {
  if (typeof id !== 'string' && typeof id !== 'number') return null
  const doc = await payload
    .findByID({ collection: 'users', id, depth: 0, overrideAccess: true, disableErrors: true, req })
    .catch(() => null)
  return (doc as UserDoc | null) ?? null
}

/**
 * Terbitkan token sekali pakai, lalu kirim emailnya. Dipanggil di dalam transaksi pemanggil:
 * kalau email gagal terkirim, semua perubahan dibatalkan. Token hanya hidup di email dan kolom tersembunyi.
 */
async function issueAndSendInvite(args: {
  payload: Payload
  req: PayloadRequest
  actor: Actor
  email: string
  name?: string | null
  role: UserRole
  expiresAt: Date
}): Promise<void> {
  const { payload, req, actor, email, name, role, expiresAt } = args

  // disableEmail: Payload tidak mengirim email reset bawaan; kita kirim email undangan sendiri.
  const token = await payload.forgotPassword({
    collection: 'users',
    data: { email },
    disableEmail: true,
    expiration: expiresAt.getTime() - Date.now(),
    req,
  })
  if (!token) throw new Error('Token undangan tidak terbit.')

  const { config } = payload
  const link = `${siteUrl()}${config.routes.admin}${config.admin.routes.reset}/${token}`
  const message = buildInviteEmail({
    appName: process.env.SMTP_FROM_NAME || 'APEX',
    inviterName: actor.name?.trim() || actor.email,
    inviteeName: name,
    role,
    link,
    expiresAt,
  })
  await payload.sendEmail({ to: email, ...message })
}

const logSendFailure = (payload: Payload, err: unknown) => {
  // Hanya pesan singkat: jangan teruskan objek error utuh, supaya isi email/tautan tidak ikut tercatat.
  const detail = err instanceof Error ? err.message.slice(0, 200) : 'unknown'
  payload.logger.error({ msg: `user-admin: gagal mengirim undangan (${detail})` })
}

/** Undang user baru lewat email. Akun dibuat berstatus `invited` dengan password acak yang tidak pernah dilihat siapa pun. */
export async function inviteUser(
  payload: Payload,
  actor: Actor,
  input: { email: unknown; name?: unknown; role?: unknown },
): Promise<ServiceResult<{ id: number | string; email: string }>> {
  const denied = requireAdmin(actor)
  if (denied) return denied

  const email = normalizeEmail(input.email)
  if (!email) return fail(400, 'Email tidak valid.')
  const role = input.role ?? 'editor'
  if (!isUserRole(role)) return fail(400, 'Role harus admin atau editor.')
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  if (name.length > NAME_MAX_LENGTH) return fail(400, `Nama maksimal ${NAME_MAX_LENGTH} karakter.`)

  if (!isEmailConfigured(payload)) {
    return fail(503, 'Pengiriman email belum dikonfigurasi (isi SMTP_HOST). Undangan tidak bisa dikirim.')
  }

  const existing = await findByEmail(payload, email)
  if (existing) {
    return effectiveStatus(existing) === 'invited'
      ? fail(409, 'Email ini sudah diundang. Gunakan "Kirim ulang undangan" di daftar user.')
      : fail(409, 'Email ini sudah terdaftar sebagai user.')
  }

  const req = await localReq(payload, actor)
  const shouldCommit = await initTransaction(req)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + inviteTtlMs())

  try {
    const created = await payload.create({
      collection: 'users',
      data: {
        email,
        name: name || undefined,
        role,
        status: 'invited',
        password: unknownPassword(),
        invitedBy: actor.id as number,
        invitedAt: now.toISOString(),
        inviteExpiresAt: expiresAt.toISOString(),
      },
      depth: 0,
      overrideAccess: true,
      req,
    })
    await issueAndSendInvite({ payload, req, actor, email, name, role, expiresAt })
    if (shouldCommit) await commitTransaction(req)
    audit(payload, 'invite', actor, created.id)
    return { ok: true, id: created.id, email }
  } catch (err) {
    await killTransaction(req)
    logSendFailure(payload, err)
    return fail(502, 'Gagal mengirim email undangan. Tidak ada akun yang dibuat; coba lagi.')
  }
}

/** Kirim ulang undangan: token lama langsung tidak berlaku. */
export async function resendInvite(payload: Payload, actor: Actor, userId: unknown): Promise<ServiceResult> {
  const denied = requireAdmin(actor)
  if (denied) return denied
  if (!isEmailConfigured(payload)) {
    return fail(503, 'Pengiriman email belum dikonfigurasi (isi SMTP_HOST). Undangan tidak bisa dikirim.')
  }

  const target = await findById(payload, userId)
  if (!target) return fail(404, 'User tidak ditemukan.')
  if (effectiveStatus(target) !== 'invited') return fail(409, 'Hanya user yang masih berstatus diundang yang bisa dikirimi ulang undangan.')

  const lastSent = target.invitedAt ? new Date(target.invitedAt).getTime() : 0
  if (Date.now() - lastSent < RESEND_COOLDOWN_MS) {
    return fail(429, 'Undangan baru saja dikirim. Tunggu sebentar sebelum mengirim ulang.')
  }

  const role = isUserRole(target.role) ? target.role : 'editor'
  const req = await localReq(payload, actor)
  const shouldCommit = await initTransaction(req)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + inviteTtlMs())

  try {
    await payload.update({
      collection: 'users',
      id: target.id,
      data: { invitedBy: actor.id as number, invitedAt: now.toISOString(), inviteExpiresAt: expiresAt.toISOString() },
      depth: 0,
      overrideAccess: true,
      req,
    })
    await issueAndSendInvite({ payload, req, actor, email: target.email, name: target.name, role, expiresAt })
    if (shouldCommit) await commitTransaction(req)
    audit(payload, 'resend-invite', actor, target.id)
    return { ok: true }
  } catch (err) {
    await killTransaction(req)
    logSendFailure(payload, err)
    return fail(502, 'Gagal mengirim email undangan. Coba lagi.')
  }
}

/**
 * Nonaktifkan atau aktifkan akun. Menonaktifkan memutus sesi yang sedang berjalan dan mematikan tautan
 * undangan/reset yang beredar. Akun yang belum pernah menyelesaikan undangan kembali ke `invited`
 * saat diaktifkan (perlu kirim ulang undangan), bukan langsung `active`.
 */
export async function setUserStatus(
  payload: Payload,
  actor: Actor,
  userId: unknown,
  next: 'active' | 'disabled',
): Promise<ServiceResult<{ status: 'invited' | 'active' | 'disabled' }>> {
  const target = await findById(payload, userId)
  if (!target) return fail(404, 'User tidak ditemukan.')

  const otherActiveAdmins = await countOtherActiveAdmins(payload, target.id)
  const error = checkStatusChange({ actor, target: target as Person, next, otherActiveAdmins })
  if (error) return fail(isActiveAdmin(actor) ? 409 : 403, error)

  const current = effectiveStatus(target)
  if (next === 'disabled' && current === 'disabled') return fail(409, 'Akun sudah nonaktif.')
  if (next === 'active' && current !== 'disabled') return fail(409, 'Akun tidak sedang nonaktif.')

  const req = await localReq(payload, actor)
  const shouldCommit = await initTransaction(req)

  try {
    if (next === 'disabled') {
      await payload.update({
        collection: 'users',
        id: target.id,
        data: {
          status: 'disabled',
          disabledBy: actor.id as number,
          disabledAt: new Date().toISOString(),
          inviteExpiresAt: null,
          resetPasswordToken: null,
          resetPasswordExpiration: null,
        } as never,
        depth: 0,
        overrideAccess: true,
        req,
      })
      // Putuskan sesi login yang masih berjalan; JWT lama tidak berlaku tanpa sesinya.
      await payload.db.updateOne({ collection: 'users', id: target.id, data: { sessions: [] }, req, returning: false })
      if (shouldCommit) await commitTransaction(req)
      audit(payload, 'disable', actor, target.id)
      return { ok: true, status: 'disabled' }
    }

    // Pernah diundang tapi tidak pernah menyelesaikannya: belum punya password sungguhan.
    const neverActivated = Boolean(target.invitedAt) && !target.activatedAt
    const status = neverActivated ? 'invited' : 'active'
    await payload.update({ collection: 'users', id: target.id, data: { status }, depth: 0, overrideAccess: true, req })
    if (shouldCommit) await commitTransaction(req)
    audit(payload, 'enable', actor, target.id)
    return { ok: true, status }
  } catch (err) {
    await killTransaction(req)
    payload.logger.error({ msg: `user-admin: gagal mengubah status (${err instanceof Error ? err.message.slice(0, 200) : 'unknown'})` })
    return fail(500, 'Gagal mengubah status akun. Coba lagi.')
  }
}
