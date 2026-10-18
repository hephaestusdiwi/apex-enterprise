import type { StateView } from '@/editorial/service'
import type { EditorialCollection } from '@/editorial/constants'

export type { StateView }

export type CallResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string }

/** Panggilan ke /api/editorial/* dengan cookie sesi. Pesan error server diteruskan apa adanya. */
export async function call<T = unknown>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  body?: unknown,
  fetchFn: typeof fetch = fetch,
): Promise<CallResult<T>> {
  try {
    const res = await fetchFn(url, {
      method,
      credentials: 'include',
      cache: 'no-store',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const json = (await res.json().catch(() => null)) as (T & { message?: string }) | null
    if (res.ok) return { ok: true, data: json as T }
    return { ok: false, status: res.status, message: json?.message ?? 'Permintaan gagal. Coba lagi.' }
  } catch {
    return { ok: false, status: 0, message: 'Tidak bisa menghubungi server. Periksa koneksi lalu coba lagi.' }
  }
}

export const stateUrl = (api: string, collection: EditorialCollection, id: string | number) =>
  `${api}/editorial/${collection}/${id}`
