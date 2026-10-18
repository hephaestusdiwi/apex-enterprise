'use client'

import { useEffect, useState } from 'react'
import { editorPath, loginPath, type PreviewCollection } from '@/preview/urls'

type Props = {
  collection: PreviewCollection
  id: string
  token: string
  status: 'draft' | 'published'
  hasPublished: boolean
  updatedAt: string
  publicHref: string | null
}

type Notice = 'stale' | 'gone' | 'expired' | 'unauthenticated' | 'forbidden' | null

const POLL_MS = 20_000

const statusLabel = (status: Props['status'], hasPublished: boolean): string => {
  if (status === 'published') return 'Sama dengan versi published (tidak ada perubahan draft)'
  return hasPublished ? 'Draft: ada perubahan yang belum dipublikasikan' : 'Draft: belum dipublikasikan'
}

const linkClass =
  'inline-flex min-h-10 items-center justify-center rounded-full border border-ink/40 px-4 text-xs transition-colors can-hover:hover:border-accent can-hover:hover:text-accent'

export function PreviewBanner({ collection, id, token, status, hasPublished, updatedAt, publicHref }: Props) {
  const [notice, setNotice] = useState<Notice>(null)
  const [savedAt, setSavedAt] = useState('')
  const [mediaErrors, setMediaErrors] = useState(0)

  useEffect(() => {
    setSavedAt(new Date(updatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }))
  }, [updatedAt])

  // Cek berkala: draft berubah, dihapus, atau sesi/izin berakhir saat preview terbuka.
  useEffect(() => {
    if (notice && notice !== 'stale') return
    const query = new URLSearchParams({ collection, id, token }).toString()

    const check = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const res = await fetch(`/preview/check?${query}`, { cache: 'no-store', credentials: 'same-origin' })
        if (res.ok) {
          const body = (await res.json()) as { updatedAt?: string }
          if (body.updatedAt && body.updatedAt !== updatedAt) setNotice('stale')
        } else if (res.status === 401) setNotice('unauthenticated')
        else if (res.status === 404) setNotice('gone')
        else if (res.status === 410) setNotice('expired')
        else setNotice('forbidden')
      } catch {
        // jaringan putus sementara: coba lagi di putaran berikutnya
      }
    }

    const timer = setInterval(check, POLL_MS)
    return () => clearInterval(timer)
  }, [collection, id, token, updatedAt, notice])

  // Gambar/video yang gagal dimuat tidak mematikan halaman; editor diberi tahu.
  useEffect(() => {
    const onError = (event: Event) => {
      const el = event.target
      if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement || el instanceof HTMLSourceElement) {
        setMediaErrors((count) => count + 1)
      }
    }
    window.addEventListener('error', onError, true)
    return () => window.removeEventListener('error', onError, true)
  }, [])

  const here = typeof window === 'undefined' ? '/' : window.location.pathname + window.location.search

  return (
    <>
      <div aria-hidden className="h-36 md:h-20" />
      <aside
        aria-label="Preview Mode"
        className="fixed inset-x-0 bottom-0 z-[60] border-t border-ink/20 bg-paper/95 text-ink backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-xs md:flex-row md:items-center md:justify-between md:px-10">
          <div className="min-w-0 space-y-1">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <strong className="rounded-full bg-accent px-2.5 py-0.5 font-medium text-paper">Preview Mode</strong>
              <span>{statusLabel(status, hasPublished)}</span>
            </p>
            <p className="text-mute">
              Tampilan ini tidak terlihat oleh pengunjung publik.
              {savedAt ? ` Draft tersimpan ${savedAt}.` : ''}
            </p>

            {notice === 'stale' ? (
              <p role="status" className="text-accent">
                Draft diperbarui di editor.{' '}
                <button type="button" className="underline underline-offset-4" onClick={() => window.location.reload()}>
                  Muat ulang
                </button>
              </p>
            ) : null}
            {notice === 'gone' ? (
              <p role="alert" className="text-accent">Draft ini sudah dihapus atau tidak tersedia lagi.</p>
            ) : null}
            {notice === 'expired' ? (
              <p role="alert" className="text-accent">Link preview kedaluwarsa. Buka lagi lewat tombol Preview di editor.</p>
            ) : null}
            {notice === 'unauthenticated' ? (
              <p role="alert" className="text-accent">
                Sesi login berakhir.{' '}
                <a className="underline underline-offset-4" href={loginPath(here)}>Masuk lagi</a>
              </p>
            ) : null}
            {notice === 'forbidden' ? (
              <p role="alert" className="text-accent">Izin akun Anda untuk preview ini sudah tidak berlaku.</p>
            ) : null}
            {mediaErrors > 0 ? (
              <p role="status" className="text-accent">
                {mediaErrors} gambar/media tidak dapat dimuat. Periksa file di Media.
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <a className={linkClass} href={editorPath(collection, id)}>
              Kembali ke Editor
            </a>
            {publicHref ? (
              <a className={linkClass} href={publicHref} target="_blank" rel="noopener noreferrer">
                Lihat versi publik
              </a>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  )
}
