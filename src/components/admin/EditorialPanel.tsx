'use client'

import { Button, toast, useConfig, useDocumentInfo } from '@payloadcms/ui'
import { useCallback, useEffect, useState } from 'react'
import { STATUS_LABEL, isEditorialCollection } from '@/editorial/constants'
import { call, stateUrl, type StateView } from './editorialClient'

const POLL_MS = 30_000

const box = {
  border: '1px solid var(--ax-line, var(--theme-elevation-100))',
  background: 'var(--ax-card, var(--theme-elevation-50))',
  borderRadius: 'var(--ax-radius, 4px)',
  padding: 16,
  display: 'grid',
  gap: 12,
  fontSize: 13,
} as const
const muted = { color: 'var(--theme-elevation-600)', fontSize: 12, margin: 0 } as const
const input = {
  width: '100%',
  border: '1px solid var(--theme-elevation-150)',
  background: 'var(--theme-input-bg, var(--theme-bg))',
  color: 'var(--theme-text)',
  borderRadius: 10,
  padding: 8,
  font: 'inherit',
} as const

const when = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : ''

const badgeColor: Record<StateView['review']['status'], string> = {
  draft: 'var(--theme-elevation-400)',
  in_review: 'var(--theme-warning-500, #d99a00)',
  changes_requested: 'var(--theme-error-500, #c0392b)',
  approved: 'var(--theme-success-500, #2e8b57)',
}

/** Panel workflow editorial di sidebar dokumen: review, reviewer, jadwal, dan catatan. */
export function EditorialPanel() {
  const { id, collectionSlug } = useDocumentInfo()
  const { config } = useConfig()
  const api = config.routes.api
  const collection = isEditorialCollection(collectionSlug) ? collectionSlug : null

  const [data, setData] = useState<StateView | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [picking, setPicking] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const [requestMessage, setRequestMessage] = useState('')
  const [decisionNote, setDecisionNote] = useState('')
  const [comment, setComment] = useState('')

  const load = useCallback(async () => {
    if (!collection || !id) return
    const result = await call<StateView>('GET', stateUrl(api, collection, id))
    if (result.ok) {
      setData(result.data)
      setError(null)
    } else {
      setError(result.message)
    }
  }, [api, collection, id])

  useEffect(() => {
    void load()
    const tick = () => {
      if (document.visibilityState === 'visible') void load()
    }
    const timer = setInterval(tick, POLL_MS)
    window.addEventListener('focus', tick)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', tick)
    }
  }, [load])

  if (!collection) return null

  if (!id) {
    return (
      <section aria-label="Workflow editorial" style={box}>
        <strong>Workflow editorial</strong>
        <p style={muted}>Simpan draft dulu untuk meminta review dan menulis catatan.</p>
      </section>
    )
  }

  const run = async (fn: () => Promise<{ ok: boolean; message?: string }>, success?: string) => {
    setBusy(true)
    try {
      const result = await fn()
      if (!result.ok) toast.error(result.message ?? 'Gagal.')
      else {
        if (success) toast.success(success)
        await load()
      }
      return result.ok
    } finally {
      setBusy(false)
    }
  }

  const review = (action: 'request' | 'approve' | 'changes' | 'withdraw', body: Record<string, unknown> = {}) =>
    call('POST', `${stateUrl(api, collection, id)}/review`, { action, ...body })

  const sendRequest = async () => {
    const ok = await run(
      () => review('request', { reviewerIds: picked, note: requestMessage }),
      'Permintaan review terkirim.',
    )
    if (ok) {
      setPicking(false)
      setPicked([])
      setRequestMessage('')
    }
  }

  const decide = async (action: 'approve' | 'changes') => {
    const ok = await run(
      () => review(action, { note: decisionNote }),
      action === 'approve' ? 'Konten disetujui.' : 'Permintaan revisi terkirim.',
    )
    if (ok) setDecisionNote('')
  }

  const postComment = async () => {
    const ok = await run(() => call('POST', `${stateUrl(api, collection, id)}/notes`, { body: comment }))
    if (ok) setComment('')
  }

  if (!data) {
    return (
      <section aria-label="Workflow editorial" style={box}>
        <strong>Workflow editorial</strong>
        <p style={muted}>{error ?? 'Memuat…'}</p>
      </section>
    )
  }

  const { review: r, actions, gate, scheduled, notes, reviewerOptions } = data
  const hasDecisionActions = actions.approve || actions.changes

  return (
    <section aria-label="Workflow editorial" style={box}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <strong>Workflow editorial</strong>
        <span
          data-testid="review-status"
          style={{
            border: `1px solid ${badgeColor[r.status]}`,
            color: badgeColor[r.status],
            borderRadius: 999,
            padding: '1px 10px',
            fontSize: 12,
          }}
        >
          {STATUS_LABEL[r.status]}
        </span>
      </div>

      {error ? <p style={{ ...muted, color: 'var(--theme-error-500)' }}>{error}</p> : null}

      {r.approvalStale ? (
        <p role="alert" style={{ ...muted, color: 'var(--theme-warning-600, #a36d00)' }}>
          Konten berubah setelah disetujui. Minta review ulang sebelum dipublikasikan.
        </p>
      ) : null}
      {gate.required ? (
        <p style={muted} data-testid="gate-note">
          {gate.allowed
            ? 'Wajib disetujui sebelum publish: syarat terpenuhi.'
            : `Wajib disetujui sebelum publish. ${gate.message ?? ''}`}
        </p>
      ) : null}

      {r.reviewers.length > 0 ? (
        <div>
          <p style={muted}>Reviewer</p>
          <p style={{ margin: '2px 0 0' }}>{r.reviewers.map((p) => p.email).join(', ')}</p>
          {r.requestedBy ? (
            <p style={muted}>
              Diminta oleh {r.requestedBy.email} · {when(r.requestedAt)}
            </p>
          ) : null}
          {r.decidedBy && (r.status === 'approved' || r.status === 'changes_requested') ? (
            <p style={muted}>
              Keputusan: {r.decidedBy.email} · {when(r.decidedAt)}
            </p>
          ) : null}
        </div>
      ) : null}

      {hasDecisionActions ? (
        <div style={{ display: 'grid', gap: 6 }}>
          <textarea
            aria-label="Catatan keputusan"
            placeholder="Catatan untuk penulis (wajib untuk revisi)"
            rows={3}
            style={input}
            value={decisionNote}
            onChange={(e) => setDecisionNote(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {actions.approve ? (
              <Button buttonStyle="primary" disabled={busy} onClick={() => void decide('approve')} size="small" type="button">
                Setujui
              </Button>
            ) : null}
            {actions.changes ? (
              <Button buttonStyle="secondary" disabled={busy} onClick={() => void decide('changes')} size="small" type="button">
                Minta revisi
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {actions.request && !picking ? (
          <Button buttonStyle="secondary" disabled={busy} onClick={() => setPicking(true)} size="small" type="button">
            {r.status === 'draft' ? 'Minta review' : 'Minta review ulang'}
          </Button>
        ) : null}
        {actions.withdraw ? (
          <Button
            buttonStyle="secondary"
            disabled={busy}
            onClick={() => void run(() => review('withdraw'), 'Review ditarik kembali.')}
            size="small"
            type="button"
          >
            Tarik kembali
          </Button>
        ) : null}
      </div>

      {picking ? (
        <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'grid', gap: 6 }}>
          <legend style={muted}>Pilih reviewer</legend>
          {reviewerOptions.length === 0 ? <p style={muted}>Belum ada staff lain yang bisa jadi reviewer.</p> : null}
          {reviewerOptions.map((person) => (
            <label key={person.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={picked.includes(person.id)}
                onChange={(e) =>
                  setPicked((cur) => (e.target.checked ? [...cur, person.id] : cur.filter((x) => x !== person.id)))
                }
              />
              {person.email}
            </label>
          ))}
          <textarea
            aria-label="Pesan untuk reviewer"
            placeholder="Pesan untuk reviewer (opsional)"
            rows={2}
            style={input}
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <Button buttonStyle="primary" disabled={busy || picked.length === 0} onClick={() => void sendRequest()} size="small" type="button">
              Kirim permintaan
            </Button>
            <Button buttonStyle="secondary" disabled={busy} onClick={() => setPicking(false)} size="small" type="button">
              Batal
            </Button>
          </div>
        </fieldset>
      ) : null}

      <div>
        <p style={muted}>Jadwal publikasi</p>
        {scheduled.length === 0 ? (
          <p style={muted}>Belum ada. Atur lewat tombol Publish ▾ lalu Schedule.</p>
        ) : (
          <ul style={{ margin: '4px 0 0', paddingLeft: 16 }} data-testid="scheduled-list">
            {scheduled.map((job) => (
              <li key={job.id}>
                {job.type === 'unpublish' ? 'Tarik dari publik' : 'Publikasi'} · {when(job.waitUntil)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <p style={muted}>Catatan ({notes.length})</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }} data-testid="notes-list">
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                borderLeft: `3px solid ${note.kind === 'system' ? 'var(--theme-elevation-200)' : note.kind === 'review' ? 'var(--theme-warning-500, #d99a00)' : 'var(--theme-elevation-400)'}`,
                paddingLeft: 8,
                opacity: note.resolved ? 0.55 : 1,
              }}
            >
              <p style={muted}>
                {note.kind === 'system' ? 'Sistem' : note.kind === 'review' ? 'Review' : 'Catatan'} ·{' '}
                {note.author?.email ?? '—'} · {when(note.createdAt)}
                {note.resolved ? ' · selesai' : ''}
              </p>
              <p style={{ margin: '2px 0', whiteSpace: 'pre-wrap', fontStyle: note.kind === 'system' ? 'italic' : 'normal' }}>
                {note.body}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {note.kind !== 'system' ? (
                  <button
                    type="button"
                    style={{ all: 'unset', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}
                    disabled={busy}
                    onClick={() => void run(() => call('PATCH', `${api}/editorial/notes/${note.id}`, { resolved: !note.resolved }))}
                  >
                    {note.resolved ? 'Buka lagi' : 'Tandai selesai'}
                  </button>
                ) : null}
                {note.canDelete ? (
                  <button
                    type="button"
                    style={{ all: 'unset', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm('Hapus catatan ini?')) void run(() => call('DELETE', `${api}/editorial/notes/${note.id}`))
                    }}
                  >
                    Hapus
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        <textarea
          aria-label="Tulis catatan"
          placeholder="Tulis catatan untuk tim…"
          rows={3}
          style={input}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div>
          <Button buttonStyle="secondary" disabled={busy || !comment.trim()} onClick={() => void postComment()} size="small" type="button">
            Kirim catatan
          </Button>
        </div>
      </div>
    </section>
  )
}
