import type { Access } from 'payload'

type MaybeUser = { role?: string | null } | null | undefined

export const isAdmin = (user: MaybeUser): boolean => user?.role === 'admin'

/** admin atau editor. User login tanpa role tidak dianggap staff. */
export const isStaff = (user: MaybeUser): boolean => user?.role === 'admin' || user?.role === 'editor'

export const adminOnly: Access = ({ req }) => isAdmin(req.user)

export const staffOnly: Access = ({ req }) => isStaff(req.user)

/** Publik hanya melihat yang published; staff melihat semuanya (termasuk draft). */
export const publishedOrStaff: Access = ({ req }) =>
  isStaff(req.user) ? true : { _status: { equals: 'published' } }

/** Admin ke semua user; selain itu hanya akunnya sendiri. */
export const selfOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true
  return { id: { equals: user.id } }
}