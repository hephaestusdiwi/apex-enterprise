import {
  APIError,
  AuthenticationError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeDeleteHook,
  type CollectionBeforeLoginHook,
  type CollectionBeforeOperationHook,
  type CollectionConfig,
  type Field,
} from 'payload'
import { adminOnly, isAdmin, isStaff, selfOrAdmin } from '../access'
import { NAME_MAX_LENGTH, ROLE_LABEL, STATUS_LABEL, USER_ROLES, USER_STATUSES } from '../users/constants'
import { checkDelete, checkRoleChange, effectiveStatus, type Person } from '../users/rules'
import { countOtherActiveAdmins } from '../users/service'

// Kunci context request internal (tidak bisa diisi klien): menandai reset password yang
// sebenarnya adalah penerimaan undangan.
const ACTIVATE_ON_RESET = 'apexActivateOnReset'
// Permintaan lupa-password publik untuk akun yang tidak aktif: tidak boleh menerbitkan token atau mengirim email.
const BLOCKED_RESET = 'apexBlockedReset'

const asPerson = (user: unknown): Person | null =>
  user && typeof user === 'object' && 'id' in user ? (user as Person) : null

/**
 * Field yang hanya boleh ditulis server (service undangan/aktivasi lewat Local API, atau hook di bawah).
 * Tidak bisa diubah lewat REST/GraphQL/form admin, bahkan oleh admin.
 */
const serverOnly = { create: () => false, update: () => false } as const

const serverField = (field: Field): Field => ({ ...field, access: serverOnly }) as Field

// Jaring pengaman: akun nonaktif/diundang tidak boleh login, apa pun jalurnya.
const blockedStatuses = new Set(['invited', 'disabled'])

const guardAuthOperations: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  const rawEmail = (args as { data?: { email?: unknown } }).data?.email
  const email = typeof rawEmail === 'string' ? rawEmail.toLowerCase().trim() : ''

  if (operation === 'login' && email) {
    const user = await req.payload.db.findOne<{ id: number | string; status?: string | null }>({
      collection: 'users',
      where: { email: { equals: email } },
      req,
    })
    // Pesan sama dengan password salah: tidak membocorkan status akun, dan tidak menambah hitungan lockout.
    if (user && blockedStatuses.has(effectiveStatus(user))) throw new AuthenticationError(req.t)
    return args
  }

  if (operation === 'forgotPassword' && (args as { disableEmail?: boolean }).disableEmail !== true && email) {
    // Reset lewat form publik (REST maupun GraphQL) hanya untuk akun aktif. Akun diundang/nonaktif tidak bisa
    // "menghidupkan diri" lewat sini, dan permintaan ini tidak boleh menimpa tautan undangan yang beredar.
    // Respons ke pemanggil tetap sama seperti email tak dikenal. Penerima email sudah dihitung Payload sebelum
    // hook ini, jadi yang bisa dilakukan: matikan pengiriman email dan buang token sebelum tersimpan (beforeChange).
    const user = await req.payload.db.findOne<{ id: number | string; status?: string | null }>({
      collection: 'users',
      where: { email: { equals: email } },
      req,
    })
    if (user && effectiveStatus(user) !== 'active') {
      req.context[BLOCKED_RESET] = true
      return { ...args, disableEmail: true }
    }
    return args
  }

  if (operation === 'resetPassword') {
    const token = (args as { data?: { token?: unknown } }).data?.token
    if (typeof token !== 'string' || token === '') return args
    const user = await req.payload.db.findOne<{ id: number | string; status?: string | null }>({
      collection: 'users',
      where: { resetPasswordToken: { equals: token } },
      req,
    })
    if (user && effectiveStatus(user) === 'disabled') {
      throw new APIError('Token is either invalid or has expired.', 403)
    }
    // Token valid milik akun yang diundang = penerimaan undangan; akun diaktifkan setelah password dibuat.
    if (user && effectiveStatus(user) === 'invited') req.context[ACTIVATE_ON_RESET] = true
    return args
  }

  return args
}

const finishLogin: CollectionBeforeLoginHook = async ({ user, req }) => {
  if (req.context[ACTIVATE_ON_RESET]) {
    const activatedAt = new Date().toISOString()
    await req.payload.db.updateOne({
      collection: 'users',
      id: user.id,
      data: { status: 'active', activatedAt, inviteExpiresAt: null },
      req,
      returning: false,
    })
    req.payload.logger.info({ msg: 'user-admin: undangan diterima', event: 'accept-invite', targetId: user.id })
    return { ...user, status: 'active', activatedAt, inviteExpiresAt: null }
  }
  if (blockedStatuses.has(effectiveStatus(user))) throw new AuthenticationError(req.t)
  return user
}

const protectRoleAndAudit: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  if (req.context?.[BLOCKED_RESET]) {
    const { resetPasswordToken: _token, resetPasswordExpiration: _expiration, ...rest } = data as Record<string, unknown>
    return rest
  }

  if (operation === 'create') {
    // User pertama selalu admin, apa pun isi formnya.
    const { totalDocs } = await req.payload.count({ collection: 'users', req })
    return totalDocs === 0 ? { ...data, role: 'admin' } : data
  }

  const actor = asPerson(req.user)
  // Panggilan tanpa user (skrip, seed, test) dipercaya; aturan ini untuk tindakan manusia lewat admin/REST.
  if (!actor || !originalDoc || typeof data.role !== 'string' || data.role === originalDoc.role) return data

  const error = checkRoleChange({
    actor,
    target: originalDoc as Person,
    nextRole: data.role,
    otherActiveAdmins: await countOtherActiveAdmins(req.payload, originalDoc.id, req),
  })
  if (error) throw new APIError(error, 400)

  req.payload.logger.info({
    msg: 'user-admin: role diubah',
    event: 'role-change',
    actorId: actor.id,
    targetId: originalDoc.id,
    from: originalDoc.role,
    to: data.role,
  })
  return { ...data, roleChangedBy: actor.id, roleChangedAt: new Date().toISOString() }
}

const protectDelete: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const actor = asPerson(req.user)
  if (!actor) return
  const target = await req.payload
    .findByID({ collection: 'users', id, depth: 0, overrideAccess: true, disableErrors: true, req })
    .catch(() => null)
  if (!target) return
  const error = checkDelete({
    actor,
    target: target as Person,
    otherActiveAdmins: await countOtherActiveAdmins(req.payload, id, req),
  })
  if (error) throw new APIError(error, 400)
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email'],
    components: {
      beforeListTable: ['/components/admin/UsersToolbar#UsersToolbar'],
    },
  },
  defaultSort: '-createdAt',
  auth: {
    // Aktifkan di production yang memakai HTTPS: COOKIE_SECURE=true. Nilai lain memakai bawaan Payload
    // (lockout 5x gagal selama 10 menit, token berlaku 2 jam).
    // Masa berlaku tautan undangan diatur terpisah (USER_INVITE_EXPIRY_HOURS), bukan di sini.
    cookies: { secure: process.env.COOKIE_SECURE === 'true', sameSite: 'Lax' },
  },
  access: {
    // Hanya staff aktif (admin/editor) yang boleh masuk admin panel.
    admin: ({ req }) => isStaff(req.user),
    // Tidak ada create lewat REST/GraphQL/admin: user baru hanya lewat undangan email
    // (POST /api/user-admin/invite) atau pendaftaran admin pertama. Tidak ada password sementara.
    create: () => false,
    read: selfOrAdmin,
    update: selfOrAdmin,
    delete: adminOnly,
  },
  hooks: {
    beforeOperation: [guardAuthOperations],
    beforeChange: [protectRoleAndAudit],
    beforeLogin: [finishLogin],
    beforeDelete: [protectDelete],
  },
  fields: [
    {
      // Kartu akun di sidebar: ringkasan, riwayat undangan/role, dan aksi (tidak punya kolom database).
      name: 'account',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/components/admin/UserAccountPanel#UserAccountPanel' } },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Nama',
      maxLength: NAME_MAX_LENGTH,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: USER_ROLES.map((value) => ({ label: ROLE_LABEL[value], value })),
      admin: { components: { Cell: '/components/admin/StatusCell#StatusCell' } },
      access: {
        // Membuat user sudah dibatasi (undangan admin + pendaftaran user pertama).
        create: () => true,
        // Ganti role hanya admin; editor tidak bisa menaikkan dirinya sendiri.
        // Admin terakhir tidak bisa menurunkan role-nya (lihat hook beforeChange).
        update: ({ req }) => isAdmin(req.user),
      },
    },
    serverField({
      name: 'status',
      type: 'select',
      label: 'Status akun',
      required: true,
      defaultValue: 'active',
      index: true,
      options: USER_STATUSES.map((value) => ({ label: STATUS_LABEL[value], value })),
      // Disembunyikan dari form (ditampilkan di kartu akun), tapi tetap bisa jadi kolom dan filter daftar.
      admin: { condition: () => false, components: { Cell: '/components/admin/UserStatusCell#UserStatusCell' } },
    }),
    // Jejak audit: siapa dan kapan (peristiwa terakhir), mengikuti pola EditorialReviews.
    serverField({ name: 'invitedBy', type: 'relationship', relationTo: 'users', admin: { hidden: true } }),
    serverField({ name: 'invitedAt', type: 'date', admin: { hidden: true } }),
    serverField({ name: 'inviteExpiresAt', type: 'date', admin: { hidden: true } }),
    serverField({ name: 'activatedAt', type: 'date', admin: { hidden: true } }),
    serverField({ name: 'roleChangedBy', type: 'relationship', relationTo: 'users', admin: { hidden: true } }),
    serverField({ name: 'roleChangedAt', type: 'date', admin: { hidden: true } }),
    serverField({ name: 'disabledBy', type: 'relationship', relationTo: 'users', admin: { hidden: true } }),
    serverField({ name: 'disabledAt', type: 'date', admin: { hidden: true } }),
  ],
}
