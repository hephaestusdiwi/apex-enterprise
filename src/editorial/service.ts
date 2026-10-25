import type { Payload, Where } from 'payload'
import { isDocId } from '../preview/urls'
import { contentFingerprint } from './fingerprint'
import {
  NOTE_MAX_LENGTH,
  isEditorialCollection,
  type EditorialCollection,
  type NoteKind,
  type ReviewStatus,
} from './constants'
import {
  evaluateAction,
  evaluatePublishGate,
  type Actor,
  type ReviewAction,
  type Role,
} from './rules'
import { use } from 'react'

export type AppUser = { id: number | string; email: string; role?: string | null }
export type Person = { id: string; email: string }

export type NoteView = {
    id: number
    kind: NoteKind
    body: string
    resolved: boolean
    createdAt: string
    author: Person | null
    canDelete: boolean
}

export type StateView = {
    review: {
        status: ReviewStatus
        reviewers: Person[]
        requestedBy: Person | null
        requestedAt: string | null
        decidedBy: Person | null
        decidedAt: string | null
        approvalStale: boolean
    }
    notes: NoteView[]
    scheduled: { id: number | string; type: 'publish' | 'unpublish'; waitUntil: string }[]
    gate: { required: boolean; allowed: boolean; message: string | null }
    actions:  Record<ReviewAction, boolean>
    reviewerOptions: Person[]
    me: { id: string; role: Role; email: string }
}

export type ActionResult = { ok: true } | { ok: false; status: number; message: string }

// -- base helpers

const fail = (status: number, message: string): { ok: false; status: number; message: string } => ({
    ok: false,
    status,
    message,
})

export const toActor = (user: AppUser): Actor => ({
    id: String(user.id),
    role: user.role === 'admin' ? 'admin' : 'editor'
})

const idOf = (value: unknown): string | null => {
    if (value === null || value === undefined) return null
    if (typeof value === 'object') {
        const id =  (value as { id?: unknown }).id
        return id === undefined || id === null ? null : String(id)
    }
    return String(value)
}

const asNumberId = (id: string): number | string => (/^\d+$/.test(id) ? Number(id) : id)

type Row = Record<string, unknown> & { id: number }

const siteUrl = () => (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const editorUrl = (collection: EditorialCollection, docId: number) =>
  `${siteUrl()}/admin/collections/${collection}/${docId}`

export async function getSettings(payload: Payload): Promise<{ requireApproval: boolean; notifyByEmail: boolean }> {
  const settings = (await payload.findGlobal({ slug: 'workflow-settings', depth: 0 })) as {
    requireApproval?: boolean | null
    notifyByEmail?: boolean | null
  }
  return { requireApproval: Boolean(settings.requireApproval), notifyByEmail: settings.notifyByEmail !== false }
}

async function loadStaff(payload: Payload): Promise<Map<string, Person & { role: Role }>> {
  const { docs } = await payload.find({
    collection: 'users',
    // Hanya akun aktif yang bisa dipilih sebagai reviewer (bukan yang nonaktif atau belum menerima undangan).
    where: { and: [{ role: { in: ['admin', 'editor'] } }, { status: { equals: 'active' } }] },
    limit: 500,
    depth: 0,
    pagination: false,
    sort: 'email',
  })
  return new Map(
    docs.map((user) => [
      String(user.id),
      { id: String(user.id), email: user.email, role: (user.role === 'admin' ? 'admin' : 'editor') as Role },
    ]),
  )
}

/** Dokumen draft terbaru, hanya jika user memang boleh membacanya (access control Payload). */
async function loadDoc(payload: Payload, user: AppUser, collection: EditorialCollection, docId: number) {
  const doc = await payload.findByID({
    collection: collection as never,
    id: docId,
    draft: true,
    depth: 0,
    user: user as never,
    overrideAccess: false,
    disableErrors: true,
  })
  return (doc ?? null) as (Record<string, unknown> & { title?: string | null }) | null
}

async function findReview(payload: Payload, collection: EditorialCollection, docId: number): Promise<Row | null> {
  const { docs } = await payload.find({
    collection: 'editorial-reviews',
    where: { and: [{ docCollection: { equals: collection } }, { docId: { equals: docId } }] },
    limit: 1,
    depth: 0,
    pagination: false,
  })
  return (docs[0] as unknown as Row) ?? null
}

async function ensureReview(payload: Payload, collection: EditorialCollection, docId: number): Promise<Row> {
  const existing = await findReview(payload, collection, docId)
  if (existing) return existing
  try {
    return (await payload.create({
      collection: 'editorial-reviews',
      data: { docCollection: collection, docId, status: 'draft' },
    })) as unknown as Row
  } catch (error) {
    // Dua permintaan bersamaan: yang kedua kalah di unique index, ambil yang sudah ada.
    const again = await findReview(payload, collection, docId)
    if (again) return again
    throw error
  }
}

const reviewerIdsOf = (row: Row | null): string[] =>
  ((row?.reviewers as unknown[] | undefined) ?? []).map(idOf).filter((id): id is string => Boolean(id))

async function upcomingScheduled(payload: Payload, collection: EditorialCollection, docId: number) {
  const { docs } = await payload.db.find({
    collection: 'payload-jobs',
    limit: 10,
    sort: 'waitUntil',
    where: {
      and: [
        { taskSlug: { equals: 'schedulePublish' } },
        { waitUntil: { greater_than: new Date() } },
        { 'input.doc.value': { equals: String(docId) } },
        { 'input.doc.relationTo': { equals: collection } },
      ],
    },
  })
  return docs.map((job: Record<string, unknown>) => ({
    id: job.id as number | string,
    type: ((job.input as { type?: string } | undefined)?.type === 'unpublish' ? 'unpublish' : 'publish') as
      | 'publish'
      | 'unpublish',
    waitUntil: new Date(job.waitUntil as string).toISOString(),
  }))
}

/** Jadwal publikasi mendatang untuk semua dokumen (dashboard). */
export async function listUpcomingScheduled(payload: Payload, limit = 8) {
  const { docs } = await payload.db.find({
    collection: 'payload-jobs',
    limit,
    sort: 'waitUntil',
    where: { and: [{ taskSlug: { equals: 'schedulePublish' } }, { waitUntil: { greater_than: new Date() } }] },
  })
  return (docs as Record<string, unknown>[])
    .map((job) => {
      const input = job.input as { type?: string; doc?: { relationTo?: string; value?: string } } | undefined
      return {
        id: job.id as number | string,
        type: (input?.type === 'unpublish' ? 'unpublish' : 'publish') as 'publish' | 'unpublish',
        waitUntil: new Date(job.waitUntil as string).toISOString(),
        collection: input?.doc?.relationTo,
        docId: input?.doc?.value,
      }
    })
    .filter((job) => isEditorialCollection(job.collection) && isDocId(job.docId))
}

// ---------- notifikasi ----------

async function notify(
  payload: Payload,
  recipients: Iterable<Person | null | undefined>,
  exclude: string,
  subject: string,
  lines: string[],
) {
  try {
    const settings = await getSettings(payload)
    if (!settings.notifyByEmail) return
    const to = [
      ...new Set([...recipients].filter((p): p is Person => Boolean(p) && p!.id !== exclude).map((p) => p.email)),
    ]
    if (to.length === 0) return
    // Tidak di-await: email tidak boleh menahan permintaan pengguna.
    payload
      .sendEmail({ to, subject, text: lines.join('\n') })
      .catch((err: unknown) => payload.logger.error({ err, msg: 'Gagal mengirim email workflow' }))
  } catch (err) {
    payload.logger.error({ err, msg: 'Gagal menyiapkan email workflow' })
  }
}

const LABELS: Record<EditorialCollection, string> = { projects: 'Project', pages: 'Page', posts: 'Artikel' }
const label = (collection: EditorialCollection) => LABELS[collection]

async function addNoteRow(
  payload: Payload,
  collection: EditorialCollection,
  docId: number,
  authorId: string,
  kind: NoteKind,
  body: string,
) {
  await payload.create({
    collection: 'editorial-notes',
    data: { docCollection: collection, docId, author: asNumberId(authorId) as number, kind, body, resolved: false },
  })
}

// ---------- state untuk panel admin ----------

export async function getState(
  payload: Payload,
  user: AppUser,
  collection: EditorialCollection,
  docId: number,
): Promise<StateView | null> {
  const doc = await loadDoc(payload, user, collection, docId)
  if (!doc) return null

  const actor = toActor(user)
  const [settings, row, staff, notesRes, scheduled] = await Promise.all([
    getSettings(payload),
    findReview(payload, collection, docId),
    loadStaff(payload),
    payload.find({
      collection: 'editorial-notes',
      where: { and: [{ docCollection: { equals: collection } }, { docId: { equals: docId } }] },
      sort: 'createdAt',
      limit: 300,
      depth: 0,
      pagination: false,
    }),
    upcomingScheduled(payload, collection, docId),
  ])

  const person = (value: unknown): Person | null => {
    const id = idOf(value)
    return id ? (staff.get(id) ? { id, email: staff.get(id)!.email } : { id, email: `user #${id}` }) : null
  }

  const status = ((row?.status as ReviewStatus | undefined) ?? 'draft') as ReviewStatus
  const fingerprint = contentFingerprint(doc)
  const approvedFingerprint = (row?.approvedFingerprint as string | null | undefined) ?? null
  const approvalStale = status === 'approved' && approvedFingerprint !== fingerprint
  const reviewerIds = reviewerIdsOf(row)
  const state = { status, reviewerIds, requestedById: idOf(row?.requestedBy) }

  const gate = evaluatePublishGate({
    requireApproval: settings.requireApproval,
    actor,
    status,
    approvedFingerprint,
    currentFingerprint: fingerprint,
  })

  const can = (action: ReviewAction) =>
    action === 'request'
      ? status !== 'in_review'
      : evaluateAction(action, state, actor, { note: 'x' }).ok

  const notes: NoteView[] = (notesRes.docs as unknown as Row[]).map((note) => {
    const authorId = idOf(note.author)
    const kind = note.kind as NoteKind
    return {
      id: note.id,
      kind,
      body: String(note.body ?? ''),
      resolved: Boolean(note.resolved),
      createdAt: String(note.createdAt),
      author: person(note.author),
      canDelete: actor.role === 'admin' || (kind !== 'system' && authorId === actor.id),
    }
  })

  return {
    review: {
      status,
      reviewers: reviewerIds.map((id) => person(id)!).filter(Boolean),
      requestedBy: person(row?.requestedBy),
      requestedAt: (row?.requestedAt as string | null | undefined) ?? null,
      decidedBy: person(row?.decidedBy),
      decidedAt: (row?.decidedAt as string | null | undefined) ?? null,
      approvalStale,
    },
    notes,
    scheduled,
    gate: {
      required: settings.requireApproval,
      allowed: gate.allowed,
      message: gate.allowed ? null : gate.message,
    },
    actions: { request: can('request'), approve: can('approve'), changes: can('changes'), withdraw: can('withdraw') },
    reviewerOptions: [...staff.values()]
      .filter((member) => actor.role === 'admin' || member.id !== actor.id)
      .map(({ id, email }) => ({ id, email })),
    me: { id: actor.id, role: actor.role, email: user.email },
  }
}

// ---------- aksi review ----------

export async function runReviewAction(
  payload: Payload,
  user: AppUser,
  collection: EditorialCollection,
  docId: number,
  action: ReviewAction,
  input: { reviewerIds?: string[]; note?: string },
): Promise<ActionResult> {
  const doc = await loadDoc(payload, user, collection, docId)
  if (!doc) return fail(404, 'Dokumen tidak ditemukan atau sudah dihapus.')

  const actor = toActor(user)
  const row = await ensureReview(payload, collection, docId)
  const state = {
    status: row.status as ReviewStatus,
    reviewerIds: reviewerIdsOf(row),
    requestedById: idOf(row.requestedBy),
  }

  const result = evaluateAction(action, state, actor, input)
  if (!result.ok) return fail(action === 'request' ? 400 : 403, result.message)

  const staff = await loadStaff(payload)
  const note = (input.note ?? '').trim().slice(0, NOTE_MAX_LENGTH)
  const now = new Date().toISOString()
  const title = doc.title?.trim() || `${label(collection)} #${docId}`
  const url = editorUrl(collection, docId)

  if (action === 'request') {
    const unknown = result.reviewerIds.filter((id) => !staff.has(id))
    if (unknown.length > 0) return fail(400, 'Reviewer tidak valid.')

    await payload.update({
      collection: 'editorial-reviews',
      id: row.id,
      data: {
        status: 'in_review',
        reviewers: result.reviewerIds.map((id) => asNumberId(id) as number),
        requestedBy: asNumberId(actor.id) as number,
        requestedAt: now,
        decidedBy: null,
        decidedAt: null,
        approvedFingerprint: null,
      },
    })
    const reviewers = result.reviewerIds.map((id) => staff.get(id)!)
    await addNoteRow(payload, collection, docId, actor.id, 'system', `Review diminta ke: ${reviewers.map((r) => r.email).join(', ')}.`)
    if (note) await addNoteRow(payload, collection, docId, actor.id, 'review', note)
    await notify(payload, reviewers, actor.id, `[APEX] Review diminta: ${title}`, [
      `${user.email} meminta kamu meninjau ${label(collection)} "${title}".`,
      ...(note ? ['', `Pesan: ${note}`] : []),
      '',
      `Buka: ${url}`,
    ])
    return { ok: true }
  }

  if (action === 'withdraw') {
    await payload.update({
      collection: 'editorial-reviews',
      id: row.id,
      data: { status: 'draft', approvedFingerprint: null, decidedBy: null, decidedAt: null },
    })
    await addNoteRow(payload, collection, docId, actor.id, 'system', `Review ditarik kembali oleh ${user.email}.`)
    return { ok: true }
  }

  // approve / changes
  const approved = action === 'approve'
  await payload.update({
    collection: 'editorial-reviews',
    id: row.id,
    data: {
      status: result.next,
      decidedBy: asNumberId(actor.id) as number,
      decidedAt: now,
      approvedFingerprint: approved ? contentFingerprint(doc) : null,
    },
  })
  await addNoteRow(
    payload,
    collection,
    docId,
    actor.id,
    'system',
    approved ? `Disetujui oleh ${user.email}.` : `Revisi diminta oleh ${user.email}.`,
  )
  if (note) await addNoteRow(payload, collection, docId, actor.id, 'review', note)

  const requester = state.requestedById ? staff.get(state.requestedById) : null
  await notify(
    payload,
    [requester],
    actor.id,
    `[APEX] ${approved ? 'Disetujui' : 'Perlu revisi'}: ${title}`,
    [
      `${user.email} ${approved ? 'menyetujui' : 'meminta revisi pada'} ${label(collection)} "${title}".`,
      ...(note ? ['', `Catatan: ${note}`] : []),
      '',
      `Buka: ${url}`,
    ],
  )
  return { ok: true }
}

// ---------- catatan ----------

export async function addNote(
  payload: Payload,
  user: AppUser,
  collection: EditorialCollection,
  docId: number,
  rawBody: unknown,
): Promise<ActionResult> {
  const body = typeof rawBody === 'string' ? rawBody.trim() : ''
  if (!body) return fail(400, 'Catatan tidak boleh kosong.')
  if (body.length > NOTE_MAX_LENGTH) return fail(400, `Catatan maksimal ${NOTE_MAX_LENGTH} karakter.`)

  const doc = await loadDoc(payload, user, collection, docId)
  if (!doc) return fail(404, 'Dokumen tidak ditemukan atau sudah dihapus.')

  await addNoteRow(payload, collection, docId, String(user.id), 'comment', body)

  // Hanya saat ada review yang aktif, supaya diskusi biasa tidak membanjiri email.
  const row = await findReview(payload, collection, docId)
  if (row && row.status !== 'draft') {
    const staff = await loadStaff(payload)
    const involved = [...reviewerIdsOf(row), idOf(row.requestedBy)]
      .filter((id): id is string => Boolean(id))
      .map((id) => staff.get(id))
    const title = doc.title?.trim() || `${label(collection)} #${docId}`
    await notify(payload, involved, String(user.id), `[APEX] Catatan baru: ${title}`, [
      `${user.email} menulis catatan pada ${label(collection)} "${title}":`,
      '',
      body,
      '',
      `Buka: ${editorUrl(collection, docId)}`,
    ])
  }
  return { ok: true }
}

async function loadNoteForUser(payload: Payload, user: AppUser, noteId: string) {
  if (!isDocId(noteId)) return null
  const note = (await payload
    .findByID({ collection: 'editorial-notes', id: Number(noteId), depth: 0, disableErrors: true })
    .catch(() => null)) as unknown as Row | null
  if (!note) return null
  // Hanya jika user memang boleh membaca dokumen induknya.
  const doc = await loadDoc(payload, user, note.docCollection as EditorialCollection, Number(note.docId))
  return doc ? note : null
}

export async function setNoteResolved(
  payload: Payload,
  user: AppUser,
  noteId: string,
  resolved: unknown,
): Promise<ActionResult> {
  if (typeof resolved !== 'boolean') return fail(400, 'Nilai "resolved" harus true atau false.')
  const note = await loadNoteForUser(payload, user, noteId)
  if (!note) return fail(404, 'Catatan tidak ditemukan.')
  await payload.update({
    collection: 'editorial-notes',
    id: note.id,
    data: {
      resolved,
      resolvedBy: resolved ? (asNumberId(String(user.id)) as number) : null,
      resolvedAt: resolved ? new Date().toISOString() : null,
    },
  })
  return { ok: true }
}

export async function deleteNote(payload: Payload, user: AppUser, noteId: string): Promise<ActionResult> {
  const note = await loadNoteForUser(payload, user, noteId)
  if (!note) return fail(404, 'Catatan tidak ditemukan.')
  const admin = user.role === 'admin'
  const own = idOf(note.author) === String(user.id)
  if (!admin && !(own && note.kind !== 'system')) return fail(403, 'Kamu tidak boleh menghapus catatan ini.')
  await payload.delete({ collection: 'editorial-notes', id: note.id })
  return { ok: true }
}

// ---------- gerbang publikasi & jejak ----------

export async function checkPublishGate(input: {
  payload: Payload
  collection: EditorialCollection
  docId: number | null
  doc: Record<string, unknown>
  user: AppUser | null
}) {
  const settings = await getSettings(input.payload)
  const row = input.docId ? await findReview(input.payload, input.collection, input.docId) : null
  return evaluatePublishGate({
    requireApproval: settings.requireApproval,
    actor: input.user ? toActor(input.user) : null,
    status: (row?.status as ReviewStatus | undefined) ?? null,
    approvedFingerprint: (row?.approvedFingerprint as string | null | undefined) ?? null,
    currentFingerprint: contentFingerprint(input.doc),
  })
}

/** Setelah publikasi: review dianggap selesai dan siklus berikutnya mulai dari draft. */
export async function recordPublished(
  payload: Payload,
  collection: EditorialCollection,
  docId: number,
  user: AppUser | null,
) {
  const row = await findReview(payload, collection, docId)
  if (row && row.status !== 'draft') {
    await payload.update({
      collection: 'editorial-reviews',
      id: row.id,
      data: { status: 'draft', approvedFingerprint: null },
    })
  }
  if (user) await addNoteRow(payload, collection, docId, String(user.id), 'system', `Dipublikasikan oleh ${user.email}.`)
}

/** Dipanggil saat publikasi terjadwal ditolak gerbang: catat dan beri tahu penjadwalnya. */
export async function reportBlockedPublish(
  payload: Payload,
  collection: EditorialCollection,
  docId: number,
  user: AppUser,
  message: string,
) {
  await addNoteRow(payload, collection, docId, String(user.id), 'system', `Publikasi terjadwal ditolak: ${message}`)
  await notify(payload, [{ id: String(user.id), email: user.email }], '', '[APEX] Publikasi terjadwal ditolak', [
    message,
    '',
    `Buka: ${editorUrl(collection, docId)}`,
  ])
}

export async function cleanupEditorial(payload: Payload, collection: EditorialCollection, docId: number) {
  const where: Where = { and: [{ docCollection: { equals: collection } }, { docId: { equals: docId } }] }
  await payload.delete({ collection: 'editorial-notes', where })
  await payload.delete({ collection: 'editorial-reviews', where })
}
