'use client'

import { Button, Modal, toast, useAllFormFields, useConfig, useDocumentInfo, useForm, useFormModified, useLocale, useModal } from '@payloadcms/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { isPreviewCollection } from '@/preview/urls'
import { describeProblems, openBlankWindow, openPreview, type Notify } from './previewClient'

const MODAL_SLUG = 'apex-preview-choice'
/** Dokumen baru: setelah draft tersimpan Payload pindah halaman; kita lanjutkan dengan toast berisi tombol. */
const PENDING_KEY = 'apex:preview-after-create'

const notify: Notify = {
  error: (message) => toast.error(message),
  withAction: (message, label, onClick) => toast.info(message, { action: { label, onClick }, duration: 15000 }),
}

type SaveResult = { ok: true } | { ok: false; problems: string[] }

export function PreviewButton() {
  const { id, collectionSlug } = useDocumentInfo()
  const modified = useFormModified()
  const { submit } = useForm()
  const [fields] = useAllFormFields()
  const { code: locale } = useLocale()
  const { config } = useConfig()
  const { openModal, closeModal } = useModal()
  const [busy, setBusy] = useState(false)

  const apiRoute = config.routes.api
  const collection = isPreviewCollection(collectionSlug) ? collectionSlug : null

  // Nilai terbaru untuk dibaca setelah `await submit` (closure biasa akan basi).
  const latest = useRef({ modified, fields })
  latest.current = { modified, fields }
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  /** Simpan sebagai draft lewat form Payload sendiri (sama dengan tombol Save Draft), tanpa mengubah status published. */
  const saveDraft = useCallback(async (): Promise<SaveResult> => {
    const search = `?locale=${locale}&depth=0&fallback-locale=null&draft=true`
    await submit({
      action: `${apiRoute}/${collectionSlug}${id ? `/${id}` : ''}${search}`,
      method: id ? 'PATCH' : 'POST',
      overrides: { _status: 'draft' },
      skipValidation: true,
    })
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Dokumen baru berhasil dibuat: Payload sudah memindahkan halaman dan komponen ini dilepas.
    if (!mounted.current) return { ok: true }

    const problems = describeProblems(latest.current.fields as Record<string, { valid?: boolean; errorMessage?: string }>)
    if (problems.length > 0 || latest.current.modified) return { ok: false, problems }
    return { ok: true }
  }, [submit, apiRoute, collectionSlug, id, locale])

  const run = useCallback(
    async (mode: 'saved' | 'save-first') => {
      if (!collection) return
      closeModal(MODAL_SLUG)
      const win = openBlankWindow() // harus sebelum await pertama
      setBusy(true)
      try {
        if (mode === 'save-first') {
          const saved = await saveDraft()
          if (!saved.ok) {
            win?.close()
            toast.error(
              saved.problems.length > 0
                ? `Draft belum tersimpan, jadi preview tidak dibuka. Perbaiki dulu: ${saved.problems.join('; ')}`
                : 'Draft belum bisa disimpan, jadi preview tidak dibuka. Periksa pesan di editor.',
            )
            return
          }
          if (!id) {
            win?.close()
            window.sessionStorage.setItem(PENDING_KEY, collection)
            return
          }
        }

        if (!id) {
          win?.close()
          return
        }
        await openPreview({ collection, id, apiRoute, win, notify })
      } finally {
        if (mounted.current) setBusy(false)
      }
    },
    [collection, id, apiRoute, closeModal, saveDraft],
  )

  const runRef = useRef(run)
  runRef.current = run

  // Setelah dokumen baru dibuat lewat "Simpan dan Preview": tawarkan membuka preview (klik = izin popup).
  useEffect(() => {
    if (!id || !collection) return
    if (window.sessionStorage.getItem(PENDING_KEY) !== collection) return
    window.sessionStorage.removeItem(PENDING_KEY)
    toast.success('Draft tersimpan.', {
      action: { label: 'Buka Preview', onClick: () => void runRef.current('saved') },
      duration: 15000,
    })
  }, [id, collection])

  if (!collection) return null

  const isNew = !id

  const onClick = () => {
    // Perubahan belum tersimpan tidak pernah dibuang diam-diam: editor memilih.
    if (isNew || modified) {
      openModal(MODAL_SLUG)
      return
    }
    void run('saved')
  }

  return (
    <>
      <Button
        aria-label="Preview"
        buttonStyle="secondary"
        disabled={busy}
        id="apex-preview-button"
        onClick={onClick}
        size="medium"
        type="button"
      >
        {busy ? 'Menyiapkan…' : 'Preview'}
      </Button>

      <Modal className="confirmation-modal" closeOnBlur={false} slug={MODAL_SLUG}>
        <div className="confirmation-modal__wrapper">
          <div className="confirmation-modal__content">
            <h1>{isNew ? 'Simpan draft dulu?' : 'Ada perubahan yang belum disimpan'}</h1>
            <p>
              {isNew
                ? 'Dokumen ini belum pernah disimpan. Simpan sebagai draft agar bisa dipreview. Status tidak berubah menjadi Published.'
                : 'Pilih apakah preview memakai perubahan terbaru (disimpan sebagai draft dulu) atau versi yang sudah tersimpan. Perubahan Anda tidak akan dibuang.'}
            </p>
          </div>
          <div className="confirmation-modal__controls">
            <Button buttonStyle="secondary" id="apex-preview-cancel" onClick={() => closeModal(MODAL_SLUG)} size="large" type="button">
              Batal
            </Button>
            {isNew ? null : (
              <Button buttonStyle="secondary" id="apex-preview-saved" onClick={() => void run('saved')} size="large" type="button">
                Preview versi tersimpan
              </Button>
            )}
            <Button id="apex-preview-save" onClick={() => void run('save-first')} size="large" type="button">
              Simpan dan Preview
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
