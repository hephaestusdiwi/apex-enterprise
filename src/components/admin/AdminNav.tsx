import { NavHamburger, NavWrapper } from '@payloadcms/next/client'
import { Logout } from '@payloadcms/ui'
import type { Payload, ServerProps } from 'payload'
import { PREFERENCE_KEYS } from 'payload/shared'
import { isAdmin, isStaff } from '@/access'
import { AdminNavLinks, type NavIcon, type NavItem, type NavSection } from './AdminNavLinks'
import { glob } from 'fs'

type Permissions = ServerProps['permissions']
type MaybeUser = Parameters<typeof isStaff>[0]

/** Koleksi yang sengaja tidak masuk sidebar: data mentah/internal (kunjungan, review & catatan editorial). */
const HIDDEN_COLLECTIONS = new Set(['visits', 'editorial-reviews', 'editorial-notes'])

/** Entri sidebar yang sudah ditata manual. Koleksi/global lain yang bisa dibaca masuk ke grup "Lainnya". */
const KNOWN_COLLECTIONS = new Set([
  'projects',
  'pages',
  'posts',
  'post-categories',
  'media',
  'videos',
  'contacts',
  'bookings',
  'service-packages',
  'booking-blackouts',
  'users',
])
const KNOWN_GLOBALS = new Set(['site-settings', 'contact-settings', 'booking-settings', 'workflow-settings'])

async function countOf(payload: Payload, collection: 'contacts' | 'bookings', status: string): Promise<number> {
  try {
    const { totalDocs } = await payload.count({ collection, where: { status: { equals: status } } })
    return totalDocs
  } catch (err) {
    payload.logger.error({ err, msg: `Gagal menghitung badge sidebar (${collection})` })
    return 0
  }
}

/** Status buka/tutup grup sidebar yang disimpan Payload di preferensi pengguna. */
async function readGroupState(payload: Payload, user: ServerProps['user']): Promise<Record<string, boolean | undefined>> {
  if (!user?.collection) return {}
  try {
    const res = await payload.find({
      collection: 'payload-preferences',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        and: [
          { key: { equals: PREFERENCE_KEYS.NAV } },
          { 'user.relationTo': { equals: user.collection } },
          { 'user.value': { equals: user.id } },
        ],
      },
    })
    const groups = (res.docs[0]?.value as { groups?: Record<string, { open?: boolean }> } | undefined)?.groups ?? {}
    return Object.fromEntries(Object.entries(groups).map(([label, state]) => [label, state?.open]))
  } catch {
    return {}
  }
}

const labelOf = (value: unknown, fallback: string): string => (typeof value === 'string' ? value : fallback)

export async function AdminNav({ payload, permissions, user, visibleEntities }: ServerProps) {
    const admin = payload.config.routes.admin
    const who = user as MaybeUser
    const staff = isStaff(who)
    const canCollection = (slug: string) => Boolean((permissions as Permissions)?.collections?.[slug]?.read)
    const canGlobal = (slug: string) => Boolean((permissions as Permissions)?.globals?.[slug]?.read)

    const collection = (slug: string, label: string, icon: NavIcon, extra: Partial<NavItem> = {}): NavItem | null =>
        canCollection(slug) ? { href: `${admin}/collections/${slug}`, label, icon, ...extra } : null
    const global = (slug: string, label: string, icon: NavIcon): NavItem | null =>
        canGlobal(slug) ? { href: `${admin}/globals/${slug}`, label, icon } : null

    const [newMessages, pendingBookings, groupState] = await Promise.all([
        staff ? countOf(payload, 'contacts', 'new') : 0,
        staff ? countOf(payload, 'bookings', 'pending') : 0,
        readGroupState(payload, user),
    ])

    const present = (items: (NavItem | null)[]): NavItem[] => items.filter((item): item is NavItem => item !== null)

    const extras: NavItem[] = [
        ...payload.config.collections
            .filter(
                ({ slug }) =>
                    visibleEntities?.collections.includes(slug) &&
                    !KNOWN_COLLECTIONS.has(slug) &&
                    !HIDDEN_COLLECTIONS.has(slug) &&
                    canCollection(slug),
            )
            .map((c): NavItem => ({ href: `${admin}/collections/${c.slug}`, label: labelOf(c.labels?.plural, c.slug), icon: 'dot' })),
            ...payload.config.globals
            .filter(({ slug }) => visibleEntities?.globals?.includes(slug) && !KNOWN_GLOBALS.has(slug) && canGlobal(slug))
            .map((g): NavItem => ({ href: `${admin}/globals/${g.slug}`, label: labelOf(g.label, g.slug), icon: 'dot' })),
    ]

    const sections: NavSection[] = [
        {
            items: present([
                { href: admin, label: 'Dashboard', icon: 'dashboard', exact: true },
                isAdmin(who) ? { href: `${admin}/statistik`, label: 'Statistik Pengunjung', icon: 'chart' } : null,
            ]),
        },
        {
            label: 'Konten',
            items: present([
                collection('projects', 'Proyek', 'folder'),
                collection('pages', 'Halaman', 'file'),
                collection('posts', 'Artikel', 'article'),
                collection('post-categories', 'Kategori Artikel', 'tag'),
                collection('media', 'Media', 'image'),
                collection('vides', 'Video', 'video'),
            ]),
        },
        {
            label: 'Pesan dan Booking',
            items: present([
                collection('contacts', 'Pesan Kontak', 'mail', { count: newMessages, countTone: 'alert' }),
                collection('bookings', 'Booking', 'bookingCheck', { count: pendingBookings, countTone: 'neutral' }),
                staff ? { href: `${admin}/booking-calendar`, label: 'Kalender Booking', icon: 'calendar' } : null,
                collection('service-packages', 'Paket Layanan','package'),
                collection('bookings-blackouts', 'Tanggal Tutup', 'ban'),
            ]),
        },
        {
            label: 'Pengaturan',
            items: present([
                global('site-settings', 'Informasi Website', 'globe'),
                global('contact-settings', 'Kontak', 'phone'),
                global('booking-settings', 'Booking', 'sliders'),
                global('workflow-settings', 'Workflow', 'workflow'),
                collection('users', 'Pengguna', 'users'),
            ]),
        },
        { label: 'Lainnya', items: extras },
    ]
        .filter((section) => section.items.length > 0)
        .map((section) => ({  ...section, isOpen: section.label ? groupState[section.label] : undefined }))

  return (
    <NavWrapper baseClass="nav">
      <nav className="nav__wrap">
        <AdminNavLinks sections={sections} />
        <div className="nav__controls">
          <Logout />
        </div>
      </nav>
      <div className="nav__header">
        <div className="nav__header-content">
          <NavHamburger baseClass="nav" />
        </div>
      </div>
    </NavWrapper>
  )
}