import type { Endpoint } from 'payload'
import { isStaff } from '@/access'
import { PREVIEW_TTL_SECONDS, signPreviewToken } from './token'
import { incompleteReason } from './validate'
import { isDocId, previewPath, type PreviewCollection } from './urls'

const json = (body: Record<string, unknown>, status = 200) =>
    Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

/**
 * POST /api/<collection>/:id/preview-link
 * Dipanggil tombol Preview di admin. Mengembalikan URL preview dengan token yang
 * terikat ke dokumen dan user yang sedang login. Tidak mengubah apa pun di database.
 */
export const previewLinkEndpoint = (collection: PreviewCollection): Endpoint => ({
  path: '/:id/preview-link',
  method: 'post',
  handler: async (req) => {
    const id = String(req.routeParams?.id ?? '')

    if (!req.user) return json({ code: 'unauthenticated', message: 'Sesi login berakhir. Masuk lagi lalu coba Preview.' }, 401)
    if (!isStaff(req.user as { role?: string | null })) {
      return json({ code: 'forbidden', message: 'Akun ini tidak memiliki izin untuk membuka preview.' }, 403)
    }
    if (!isDocId(id)) return json({ code: 'not_found', message: 'Dokumen tidak ditemukan.' }, 404)

    const doc = await req.payload.findByID({
      collection,
      id,
      draft: true,
      depth: 0,
      user: req.user,
      overrideAccess: false,
      disableErrors: true,
    })
    if (!doc) {
      return json({ code: 'not_found', message: 'Draft tidak ditemukan atau sudah dihapus.' }, 404)
    }

    const incomplete = incompleteReason(doc)
    if (incomplete) return json({ code: 'incomplete', message: incomplete }, 422)

    const exp = Math.floor(Date.now() / 1000) + PREVIEW_TTL_SECONDS
    const token = signPreviewToken({ c: collection, id, uid: String(req.user.id), exp }, req.payload.secret)

    return json({
      url: `${previewPath(collection, id, doc.slug)}?token=${token}`,
      status: doc._status === 'published' ? 'published' : 'draft',
      expiresAt: new Date(exp * 1000).toISOString(),
    })
  },
})
