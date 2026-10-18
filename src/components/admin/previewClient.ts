import type { PreviewCollection } from '@/preview/urls'

export type MintResult = { ok: true; url: string } | { ok: false; code: string; message: string }

/** Minta URL preview bertoken ke server. Tidak mengubah apa pun di database. */
export async function requestPreviewLink(
  collection: PreviewCollection,
  id: string | number,
  apiRoute = '/api',
  fetchFn: typeof fetch = fetch,
): Promise<MintResult> {
  try {
    const res = await fetchFn(`${apiRoute}/${collection}/${id}/preview-link`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    const body = (await res.json().catch(() => null)) as { url?: string; code?: string; message?: string } | null
    if (res.ok && body?.url) return { ok: true, url: body.url }
    return { ok: false, code: body?.code ?? 'error', message: body?.message ?? 'Preview belum bisa dibuka. Coba lagi.' }
  } catch {
    return { ok: false, code: 'network', message: 'Tidak bisa menghubungi server. Periksa koneksi lalu coba lagi.' }
  }
}

/** Dipanggil sinkron di dalam klik supaya browser tidak memblokir tab baru. */
export function openBlankWindow(): Window | null {
  const win = window.open('about:blank', '_blank')
  if (win) {
    try {
      win.opener = null
      win.document.title = 'Preview'
      win.document.body.innerHTML = '<p style="font:14px sans-serif;padding:24px">Menyiapkan preview…</p>'
    } catch {
      // tidak kritis
    }
  }
  return win
}

export type Notify = {
  error: (message: string) => void
  withAction: (message: string, label: string, onClick: () => void) => void
}

/** Minta link, lalu arahkan tab yang sudah dibuka ke preview. Mengembalikan true bila link berhasil dibuat. */
export async function openPreview(input: {
  collection: PreviewCollection
  id: string | number
  apiRoute?: string
  win: Window | null
  notify: Notify
}): Promise<boolean> {
  const { collection, id, apiRoute, win, notify } = input
  const result = await requestPreviewLink(collection, id, apiRoute)

  if (!result.ok) {
    win?.close()
    notify.error(result.message)
    return false
  }

  if (win && !win.closed) {
    win.location.href = result.url
    return true
  }

  // Tab baru diblokir browser: tombol di toast adalah gestur pengguna baru, jadi boleh membuka tab.
  notify.withAction('Browser memblokir tab baru.', 'Buka Preview', () => {
    window.open(result.url, '_blank', 'noopener')
  })
  return true
}

const FIELD_LABELS: Record<string, string> = {
  title: 'Judul',
  slug: 'Slug',
  hero: 'Hero',
  home: 'Tampilan di Home',
  meta: 'Meta',
  blocks: 'Blok konten',
}

/** Daftar bagian form yang masih bermasalah, untuk pesan "apa yang perlu diperbaiki". */
export function describeProblems(fields: Record<string, { valid?: boolean; errorMessage?: string } | undefined>): string[] {
  return Object.entries(fields)
    .filter(([, field]) => field?.valid === false)
    .map(([path, field]) => {
      const label = FIELD_LABELS[path.split('.')[0]] ?? path.split('.')[0]
      const where = path.includes('.') ? ` (${path})` : ''
      return field?.errorMessage ? `${label}${where}: ${field.errorMessage}` : `${label}${where}`
    })
}
