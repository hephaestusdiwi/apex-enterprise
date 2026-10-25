import type { Endpoint, PayloadRequest } from 'payload'
import { inviteUser, resendInvite, setUserStatus, type Actor, type ServiceResult } from './service'

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

/** Hanya pesan dan data non-rahasia yang keluar ke klien; tidak ada token, tautan, atau password. */
const respond = (result: ServiceResult<Record<string, unknown>>) => {
  if (!result.ok) return json({ message: result.message }, result.status)
  const { ok: _ok, ...data } = result
  return json({ ok: true, ...data })
}

function actorOf(req: PayloadRequest): { actor: Actor } | { error: Response } {
  if (!req.user) return { error: json({ message: 'Sesi login berakhir. Masuk lagi lalu coba lagi.' }, 401) }
  return { actor: req.user as unknown as Actor }
}

async function readBody(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    const body = await req.json?.()
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

/**
 * Semua tindakan manajemen user lewat sini (Local API di server). Siapa boleh apa dipaksakan di service,
 * jadi klien tidak bisa memalsukan pelaku, status, atau jejak audit.
 */
export const userEndpoints: Endpoint[] = [
  {
    path: '/user-admin/invite',
    method: 'post',
    handler: async (req) => {
      const auth = actorOf(req)
      if ('error' in auth) return auth.error
      const body = await readBody(req)
      return respond(await inviteUser(req.payload, auth.actor, { email: body.email, name: body.name, role: body.role }))
    },
  },
  {
    path: '/user-admin/:id/resend',
    method: 'post',
    handler: async (req) => {
      const auth = actorOf(req)
      if ('error' in auth) return auth.error
      return respond(await resendInvite(req.payload, auth.actor, req.routeParams?.id))
    },
  },
  {
    path: '/user-admin/:id/disable',
    method: 'post',
    handler: async (req) => {
      const auth = actorOf(req)
      if ('error' in auth) return auth.error
      return respond(await setUserStatus(req.payload, auth.actor, req.routeParams?.id, 'disabled'))
    },
  },
  {
    path: '/user-admin/:id/enable',
    method: 'post',
    handler: async (req) => {
      const auth = actorOf(req)
      if ('error' in auth) return auth.error
      return respond(await setUserStatus(req.payload, auth.actor, req.routeParams?.id, 'active'))
    },
  },
]
