import { resolvePreview, type PreviewFailure } from '@/preview/resolve'

export const dynamic = 'force-dynamic'

const STATUS: Record<PreviewFailure, number> = {
  unauthenticated: 401,
  forbidden: 403,
  invalid: 403,
  mismatch: 403,
  expired: 410,
  not_found: 404,
}

const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' }

/** Polling ringan dari PreviewBanner: apakah draft berubah, dihapus, atau akses berakhir. */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const result = await resolvePreview({
    collection: params.get('collection') ?? '',
    id: params.get('id') ?? '',
    token: params.get('token'),
    headers: req.headers,
    light: true,
  })

  if (!result.ok) return Response.json({ state: result.reason }, { status: STATUS[result.reason], headers })
  return Response.json({ state: 'ok', updatedAt: result.updatedAt, status: result.status }, { headers })
}
