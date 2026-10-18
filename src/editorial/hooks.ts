import { APIError, type CollectionAfterChangeHook, type CollectionAfterDeleteHook, type CollectionBeforeChangeHook } from 'payload'
import type { EditorialCollection } from './constants'
import { checkPublishGate, cleanupEditorial, recordPublished, reportBlockedPublish, type AppUser } from './service'

const asUser = (user: unknown): AppUser | null => (user ? (user as AppUser) : null)

/**
 * Gerbang publikasi. Berlaku untuk Publish di admin, publikasi terjadwal (job berjalan atas nama
 * penjadwalnya), dan API. Admin dan proses sistem tanpa user selalu lolos.
 */
export const publishGate =
  (collection: EditorialCollection): CollectionBeforeChangeHook =>
  async ({ data, originalDoc, req }) => {
    if (data?._status !== 'published') return data

    const user = asUser(req.user)
    const docId = originalDoc?.id ? Number(originalDoc.id) : null
    // Isi yang akan dipublikasikan = draft terakhir + perubahan di permintaan ini.
    const doc = { ...(originalDoc ?? {}), ...data } as Record<string, unknown>

    const result = await checkPublishGate({ payload: req.payload, collection, docId, doc, user })
    if (result.allowed) return data

    // Permintaan Local API berpengguna = job jadwal: catat dan kabari, karena tidak ada yang melihat errornya.
    if (req.payloadAPI === 'local' && user && docId) {
      await reportBlockedPublish(req.payload, collection, docId, user, result.message).catch(() => null)
    }
    throw new APIError(result.message, 403, undefined, true)
  }

export const afterPublish =
  (collection: EditorialCollection): CollectionAfterChangeHook =>
  async ({ doc, data, req }) => {
    if (data?._status !== 'published' || doc._status !== 'published') return doc
    try {
      await recordPublished(req.payload, collection, Number(doc.id), asUser(req.user))
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Gagal mencatat publikasi di workflow' })
    }
    return doc
  }

export const afterDeleteCleanup =
  (collection: EditorialCollection): CollectionAfterDeleteHook =>
  async ({ id, req }) => {
    try {
      await cleanupEditorial(req.payload, collection, Number(id))
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Gagal membersihkan data workflow dokumen yang dihapus' })
    }
  }
