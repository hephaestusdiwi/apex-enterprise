'use client'

import { Button, toast, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { isPreviewCollection } from '@/preview/urls'
import { openBlankWindow, openPreview, type Notify } from './previewClient'

const notify: Notify = {
  error: (message) => toast.error(message),
  withAction: (message, label, onClick) => toast.info(message, { action: { label, onClick }, duration: 15000 }),
}

type Props = { rowData?: { id?: number | string }; collectionSlug?: string }

/** Kolom "Preview" di daftar Projects/Pages. Membuka versi draft terbaru yang tersimpan. */
export function PreviewCell({ rowData, collectionSlug }: Props) {
  const { config } = useConfig()
  const pathname = usePathname()
  const [busy, setBusy] = useState(false)

  const slug = collectionSlug ?? pathname.split('/')[3]
  const id = rowData?.id
  if (!isPreviewCollection(slug) || id === undefined || id === null) return null

  const onClick = async (event: { preventDefault: () => void; stopPropagation: () => void }) => {
    event.preventDefault()
    event.stopPropagation()
    const win = openBlankWindow()
    setBusy(true)
    try {
      await openPreview({ collection: slug, id, apiRoute: config.routes.api, win, notify })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      aria-label="Preview"
      buttonStyle="pill"
      disabled={busy}
      onClick={onClick}
      size="small"
      type="button"
    >
      {busy ? 'Menyiapkan…' : 'Preview'}
    </Button>
  )
}
