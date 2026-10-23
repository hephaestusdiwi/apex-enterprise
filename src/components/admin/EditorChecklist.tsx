'use client'

import { useAllFormFields, useDocumentInfo } from '@payloadcms/ui'

type Kind = 'text' | 'value' | 'blocks'
type Rule = { path: string; label: string; hint: string; kind: Kind; optional?: boolean }
type FieldState = { value?: unknown; rows?: unknown[] }

/** Syarat tiap koleksi. Yang wajib dihitung ke progres; yang opsional hanya saran. */
const RULES: Record<string, Rule[]> = {
  posts: [
    { path: 'title', label: 'Judul', hint: 'Tulis judul artikel di bagian atas', kind: 'text' },
    { path: 'excerpt', label: 'Ringkasan', hint: 'Satu-dua kalimat untuk kartu daftar artikel', kind: 'text' },
    { path: 'blocks', label: 'Isi artikel', hint: 'Tambahkan minimal satu blok', kind: 'blocks' },
    { path: 'cover', label: 'Gambar sampul', hint: 'Disarankan, supaya kartu artikel menarik', kind: 'value', optional: true },
    { path: 'seo.description', label: 'Deskripsi SEO', hint: 'Kosong = otomatis dari ringkasan', kind: 'text', optional: true },
  ],
  pages: [
    { path: 'title', label: 'Judul', hint: 'Tulis judul halaman di bagian atas', kind: 'text' },
    { path: 'blocks', label: 'Isi halaman', hint: 'Tambahkan minimal satu blok', kind: 'blocks' },
    { path: 'seo.description', label: 'Deskripsi SEO', hint: 'Kosong = otomatis dari konten', kind: 'text', optional: true },
  ],
  projects: [
    { path: 'title', label: 'Judul', hint: 'Tulis judul proyek di bagian atas', kind: 'text' },
    { path: 'hero', label: 'Gambar utama', hint: 'Gambar besar di atas halaman proyek', kind: 'value' },
    { path: 'blocks', label: 'Isi halaman', hint: 'Tambahkan minimal satu blok', kind: 'blocks' },
    { path: 'home.cover', label: 'Cover di Home', hint: 'Kosong = pakai gambar utama', kind: 'value', optional: true },
    { path: 'seo.description', label: 'Deskripsi SEO', hint: 'Kosong = otomatis dari konten', kind: 'text', optional: true },
  ],
}

const isFilled = (field: FieldState | undefined, kind: Kind): boolean => {
  if (!field) return false
  if (kind === 'blocks') {
    if (Array.isArray(field.rows)) return field.rows.length > 0
    return typeof field.value === 'number' && field.value > 0
  }
  const value = field.value
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

/** Kartu di sidebar yang menunjukkan apa saja yang masih perlu diisi sebelum dokumen siap diterbitkan. */
export function EditorChecklist() {
  const { collectionSlug } = useDocumentInfo()
  const [fields] = useAllFormFields()
  const rules = collectionSlug ? RULES[collectionSlug] : undefined
  if (!rules) return null

  const items = rules.map((rule) => ({
    ...rule,
    done: isFilled(fields[rule.path] as FieldState | undefined, rule.kind),
  }))
  const required = items.filter((item) => !item.optional)
  const doneCount = required.filter((item) => item.done).length
  const percent = Math.round((doneCount / required.length) * 100)
  const ready = doneCount === required.length

  return (
    <section className={`apex-check${ready ? ' apex-check--ready' : ''}`} aria-label="Checklist penerbitan">
      <header className="apex-check__head">
        <h3 className="apex-check__title">{ready ? 'Siap diterbitkan' : 'Lengkapi dulu'}</h3>
        <span className="apex-check__count">
          {doneCount}/{required.length}
        </span>
      </header>
      <div
        className="apex-check__bar"
        role="progressbar"
        aria-label="Kelengkapan"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
      <ul className="apex-check__list">
        {items.map((item) => (
          <li key={item.path} className={`apex-check__item${item.done ? ' is-done' : ''}`}>
            <span className="apex-check__mark" aria-hidden="true">
              {item.done ? '✓' : ''}
            </span>
            <span className="apex-check__text">
              <span className="apex-check__label">
                {item.label}
                {item.optional ? <em> · opsional</em> : null}
              </span>
              {item.done ? null : <small>{item.hint}</small>}
            </span>
          </li>
        ))}
      </ul>
      <p className="apex-check__foot">
        {ready
          ? 'Semua syarat terpenuhi. Klik Publish kalau sudah yakin.'
          : 'Belum lengkap pun tidak apa-apa. Simpan sebagai draft kapan saja.'}
      </p>
    </section>
  )
}
