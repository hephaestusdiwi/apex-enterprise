import type { Endpoint, PayloadRequest } from 'payload'
import { isStaff } from '../access'
import { isDocId } from '../preview/urls'
import { isEditorialCollection, type EditorialCollection } from './constants'
import { isReviewAction } from './rules'
import {
  addNote,
  deleteNote,
  getState,
  runReviewAction,
  setNoteResolved,
  type ActionResult,
  type AppUser,
} from './service'

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

const fromResult = (result: ActionResult) =>
  result.ok ? json({ ok: true }) : json({ message: result.message }, result.status)

function guard(req: PayloadRequest): { user: AppUser } | { error: Response } {
  if (!req.user) return { error: json({ message: 'Sesi login berakhir. Masuk lagi lalu coba lagi.' }, 401) }
  if (!isStaff(req.user as { role?: string | null })) {
    return { error: json({ message: 'Akun ini tidak memiliki izin.' }, 403) }
  }
  return { user: req.user as unknown as AppUser }
}

function target(req: PayloadRequest): { collection: EditorialCollection; docId: number } | null {
  const collection = req.routeParams?.collection
  const id = req.routeParams?.id
  if (!isEditorialCollection(collection) || !isDocId(id)) return null
  return { collection, docId: Number(id) }
}

async function readBody(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    const body = await req.json?.()
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

const notFound = () => json({ message: 'Dokumen tidak ditemukan.' }, 404)

/**
 * Semua penulisan workflow lewat sini (Local API di server), sehingga siapa boleh apa selalu
 * dipaksakan server dan penulis catatan tidak bisa dipalsukan dari klien.
 */
export const editorialEndpoints: Endpoint[] = [
  {
    path: '/editorial/:collection/:id',
    method: 'get',
    handler: async (req) => {
      const auth = guard(req)
      if ('error' in auth) return auth.error
      const t = target(req)
      if (!t) return notFound()
      const state = await getState(req.payload, auth.user, t.collection, t.docId)
      return state ? json(state) : notFound()
    },
  },
  {
    path: '/editorial/:collection/:id/review',
    method: 'post',
    handler: async (req) => {
      const auth = guard(req)
      if ('error' in auth) return auth.error
      const t = target(req)
      if (!t) return notFound()
      const body = await readBody(req)
      if (!isReviewAction(body.action)) return json({ message: 'Aksi tidak dikenal.' }, 400)
      const reviewerIds = Array.isArray(body.reviewerIds) ? body.reviewerIds.map(String) : []
      const note = typeof body.note === 'string' ? body.note : ''
      return fromResult(
        await runReviewAction(req.payload, auth.user, t.collection, t.docId, body.action, { reviewerIds, note }),
      )
    },
  },
  {
    path: '/editorial/:collection/:id/notes',
    method: 'post',
    handler: async (req) => {
      const auth = guard(req)
      if ('error' in auth) return auth.error
      const t = target(req)
      if (!t) return notFound()
      const body = await readBody(req)
      return fromResult(await addNote(req.payload, auth.user, t.collection, t.docId, body.body))
    },
  },
  {
    path: '/editorial/notes/:noteId',
    method: 'patch',
    handler: async (req) => {
      const auth = guard(req)
      if ('error' in auth) return auth.error
      const body = await readBody(req)
      return fromResult(await setNoteResolved(req.payload, auth.user, String(req.routeParams?.noteId ?? ''), body.resolved))
    },
  },
  {
    path: '/editorial/notes/:noteId',
    method: 'delete',
    handler: async (req) => {
      const auth = guard(req)
      if ('error' in auth) return auth.error
      return fromResult(await deleteNote(req.payload, auth.user, String(req.routeParams?.noteId ?? '')))
    },
  },
]
