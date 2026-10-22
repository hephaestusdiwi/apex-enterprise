import type { Payload, ServerProps } from 'payload'
import { isStaff } from '@/access'
import { isEditorialCollection, type EditorialCollection } from '@/editorial/constants'
import { listUpcomingScheduled } from '@/editorial/service'
import { editorPath } from '@/preview/urls'

type Item = { key: string; href: string; title: string; meta: string }

const box = {
  background: 'var(--theme-elevation-50)',
  border: '1px solid var(--theme-elevation-100)',
  borderRadius: 4,
  padding: 16,
} as const
const label = { color: 'var(--theme-elevation-600)', fontSize: 12, margin: 0 } as const

const when = (iso: string | Date | null | undefined) =>
  iso ? new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: process.env.ANALYTICS_TZ || 'Asia/Jakarta' }) : ''

async function titleOf(payload: Payload, user: ServerProps['user'], collection: EditorialCollection, id: number | string) {
  const doc = await payload.findByID({
    // Payload's Local API type here only exposes the page/project overloads;
    // the runtime collection may also be posts, which shares the same title field.
    collection: collection as 'projects' | 'pages',
    id: Number(id),
    draft: true,
    depth: 0,
    user,
    overrideAccess: false,
    disableErrors: true,
    select: { title: true },
  })
  return doc ? ((doc as { title?: string | null }).title?.trim() || `#${id}`) : null
}

function List({ title, items }: { title: string; items: Item[] }) {
  if (items.length === 0) return null
  return (
    <div style={box}>
      <p style={{ ...label, marginBottom: 8 }}>{title}</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6, fontSize: 13 }}>
        {items.map((item) => (
          <li key={item.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <a href={item.href} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.title}
            </a>
            <span style={{ ...label, whiteSpace: 'nowrap' }}>{item.meta}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Antrean kerja di dashboard admin: review untuk saya, revisi yang diminta, dan jadwal publikasi. */
export async function EditorialQueue({ payload, user }: ServerProps) {
  if (!isStaff(user as { role?: string | null } | null | undefined) || !user) return null

  try {
    const mine = (where: Record<string, unknown>) =>
      payload.find({
        collection: 'editorial-reviews',
        where: { and: [where] } as never,
        depth: 0,
        limit: 8,
        sort: '-updatedAt',
        user,
        overrideAccess: false,
      })

    const [toReview, toRevise, scheduled] = await Promise.all([
      mine({ and: [{ status: { equals: 'in_review' } }, { reviewers: { equals: user.id } }] }),
      mine({ and: [{ status: { equals: 'changes_requested' } }, { requestedBy: { equals: user.id } }] }),
      listUpcomingScheduled(payload, 8),
    ])

    const toItems = async (docs: Record<string, unknown>[], meta: (row: Record<string, unknown>) => string) => {
      const items = await Promise.all(
        docs.map(async (row): Promise<Item | null> => {
          const collection = row.docCollection
          if (!isEditorialCollection(collection)) return null
          const title = await titleOf(payload, user, collection, row.docId as number)
          if (title === null) return null
          return { key: `${collection}-${row.docId}`, href: editorPath(collection, row.docId as number), title, meta: meta(row) }
        }),
      )
      return items.filter((item): item is Item => item !== null)
    }

    const [reviewItems, reviseItems, scheduleItems] = await Promise.all([
      toItems(toReview.docs as unknown as Record<string, unknown>[], (row) => when(row.requestedAt as string)),
      toItems(toRevise.docs as unknown as Record<string, unknown>[], (row) => when(row.decidedAt as string)),
      Promise.all(
        scheduled.map(async (job): Promise<Item | null> => {
          const collection = job.collection as EditorialCollection
          const title = await titleOf(payload, user, collection, job.docId as string)
          if (title === null) return null
          return {
            key: `job-${job.id}`,
            href: editorPath(collection, job.docId as string),
            title,
            meta: `${job.type === 'unpublish' ? 'Tarik' : 'Publikasi'} · ${when(job.waitUntil)}`,
          }
        }),
      ).then((items) => items.filter((item): item is Item => item !== null)),
    ])

    if (reviewItems.length + reviseItems.length + scheduleItems.length === 0) return null

    return (
      <section aria-label="Antrean editorial" style={{ marginBottom: 24, display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0 }}>Antrean editorial</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <List title="Menunggu review kamu" items={reviewItems} />
          <List title="Perlu direvisi" items={reviseItems} />
          <List title="Jadwal publikasi" items={scheduleItems} />
        </div>
      </section>
    )
  } catch (err) {
    payload.logger.error({ err, msg: 'Gagal memuat antrean editorial' })
    return null
  }
}
