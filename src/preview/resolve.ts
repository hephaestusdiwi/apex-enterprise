import { isStaff } from '@/access'
import { getPayloadClient } from '@/lib/payload'
import type { Page, Post, Project } from '@/payload-types'
import { verifyPreviewToken } from './token'
import { isDocId, isPreviewCollection, type PreviewCollection } from './urls'
import { tr } from 'payload/i18n/tr'
import { fa } from 'payload/i18n/fa'

export type PreviewFailure = 'unauthenticated' | 'forbidden' | 'invalid' | 'expired' | 'mismatch' | 'not_found'

export type PreviewDoc =
  | { collection: 'projects'; doc: Project }
  | { collection: 'pages'; doc: Page }
  | { collection: 'posts'; doc: Post }

export type ResolveResult =
  | ({
      ok: true
      status: 'draft' | 'published'
      hasPublished: boolean
      publishedSlug: string | null
      updatedAt: string
    } & PreviewDoc)
  | { ok: false; reason: PreviewFailure }

type Input = {
    collection: string
    id: string
    token: unknown
    headers: Headers
    light?: boolean
}

export async function resolvePreview({ collection, id, token, headers, light = false }: Input): Promise<ResolveResult> {
    if (!isPreviewCollection(collection) || !isDocId(id)) return { ok: false, reason: 'not_found' }

    const payload = await getPayloadClient()

    const verified = verifyPreviewToken(token, payload.secret)
    if (!verified.ok && verified.reason === 'invalid') return { ok: false, reason: 'invalid' }
    if (verified.ok && (verified.claims.c !== collection || verified.claims.id !== id)) {
        return { ok: false, reason: 'mismatch' }
    }

    const { user } = await payload.auth({ headers })
    if (!user) return { ok: false, reason: 'unauthenticated' }

    if (!verified.ok)  return { ok: false, reason: 'expired' }
    if (verified.claims.uid !== String(user.id)) return { ok: false, reason: 'mismatch' }
    if (!isStaff(user as { role?: string | null })) return { ok: false, reason: 'forbidden' }

    const draft = await payload.findByID({
        collection: collection as PreviewCollection,
        id,
        draft: true,
        depth: light ? 0 : 1,
        user,
        overrideAccess: false,
        disableErrors: true,
    })
    if (!draft) return { ok: false, reason: 'not_found' }

    let hasPublished = false
    let publishedSlug: string | null = null
    if (!light) {
        const published = await payload.findByID({
            collection: collection as PreviewCollection,
            id,
            draft: false,
            user,
            overrideAccess: false,
            disableErrors: true,
            select: { _status: true, slug: true },
        })
        hasPublished = published?._status === 'published'
        publishedSlug = hasPublished ? (published?.slug ?? null) : null
    }

    const status: 'draft' | 'published' = draft._status === 'published' ?  'published' : 'draft'
    const base = { ok: true as const, status, hasPublished, publishedSlug, updatedAt: draft.updatedAt }
    if (collection === 'projects') return { ...base, collection, doc: draft as Project }
    if (collection === 'posts') return { ...base, collection, doc: draft as Post }
    return { ...base, collection: 'pages', doc: draft as Page }
}
