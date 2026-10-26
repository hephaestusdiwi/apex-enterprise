import type { Payload } from 'payload'
import type { Media, Project } from '@/payload-types'
import { addDays, todayInJakarta } from '@/lib/availability'
import { formatDateShort } from '@/lib/dateFormat'
import type { FollowUpStatus } from '@/lib/followUp'
import { STATS_TZ } from '@/lib/trafficStats'

/**
 * Data untuk dashboard admin (src/components/admin/Dashboard.tsx).
 *
 * Semua query memakai Local API dengan `overrideAccess: false` + user yang sedang login,
 * jadi aturan akses koleksi (src/access) tetap berlaku. Dashboard hanya dirender di dalam
 * admin panel, tetapi akses tidak bergantung pada itu saja.
 */

/** Jumlah proyek yang diambil: 1 untuk hero + sisanya untuk grid. */
const PROJECT_LIMIT = 13
const PAGE_LIMIT = 5
const MESSAGE_LIMIT = 5
const BOOKING_LIMIT = 5
/** Booking dianggap "baru" kalau masuk dalam rentang ini. */
const FRESH_BOOKING_HOURS = 24
/** Jadwal mendatang = booking dikonfirmasi dari hari ini sampai sekian hari ke depan. */
export const UPCOMING_BOOKING_DAYS = 7

type DashboardUser = Record<string, unknown> & { id: number | string }

export type DashboardImage = {
  src: string
  /** Pilihan untuk <img srcset>; kosong bila hanya ada satu ukuran. */
  srcSet?: string
  alt: string
  width?: number
  height?: number
  /** Nilai CSS object-position dari focal point di Media. */
  position: string
}

export type DashboardStatus = 'draft' | 'published'

export type DashboardProject = {
  id: number
  title: string
  slug: string | null
  status: DashboardStatus
  updatedAt: string
  image: DashboardImage | null
  /** Proyek punya cover video (tile home memutar video). Dashboard tidak memutarnya. */
  hasVideo: boolean
}

export type DashboardPage = {
  id: number
  title: string
  slug: string | null
  status: DashboardStatus
  updatedAt: string
}

export type DashboardMessage = {
  id: number
  name: string
  email: string
  subject: string | null
  excerpt: string
  createdAt: string
}

export type DashboardBooking = {
  id: number
  code: string
  name: string
  packageTitle: string | null
  /** YYYY-MM-DD (WIB) */
  date: string
  createdAt: string
}

export type DashboardBookings = {
  /** Booking yang masuk dalam FRESH_BOOKING_HOURS jam terakhir (spam tidak dihitung). */
  fresh: { total: number; since: string }
  /** Menunggu konfirmasi: status pending, yang tanggalnya paling dekat di atas. */
  pending: { items: DashboardBooking[]; total: number }
  /** Sudah dikonfirmasi dan tanggalnya dalam UPCOMING_BOOKING_DAYS hari ke depan. */
  upcoming: { items: DashboardBooking[]; total: number }
  /** Tanggal hari ini (WIB), dipakai untuk label "Hari ini" / "Besok". */
  today: string
}

export type DashboardFollowUp = {
  /** Belum dihubungi (status follow-up "Baru") dan sedang berjalan ("Dihubungi"), per sumber prospek. */
  contacts: { fresh: number; contacted: number }
  bookings: { fresh: number; contacted: number }
}

export type DashboardData = {
  projects: {
    recent: DashboardProject[]
    total: number
    drafts: number
  } | null
  pages: { recent: DashboardPage[]; total: number } | null
  messages: { recent: DashboardMessage[]; unread: number } | null
  bookings: DashboardBookings | null
  followUp: DashboardFollowUp | null
}

const toStatus = (value: unknown): DashboardStatus => (value === 'published' ? 'published' : 'draft')

const sizeOf = (media: Media, name: 'thumbnail' | 'medium' | 'large') => {
  const size = media.sizes?.[name]
  return size?.url ? { url: size.url, width: size.width ?? undefined, height: size.height ?? undefined } : null
}

/**
 * Ubah relasi upload (sudah di-populate depth 1) jadi data gambar siap tampil.
 * `variant`: 'card' memakai thumbnail 400px; 'hero' memakai medium + large.
 */
export const toDashboardImage = (
  value: number | Media | null | undefined,
  variant: 'card' | 'hero',
): DashboardImage | null => {
  if (!value || typeof value !== 'object') return null
  if (!value.url) return null

  const position = `${value.focalX ?? 50}% ${value.focalY ?? 50}%`
  const thumb = sizeOf(value, 'thumbnail')
  const medium = sizeOf(value, 'medium')
  const large = sizeOf(value, 'large')

  if (variant === 'card') {
    const pick = thumb ?? medium ?? { url: value.url, width: value.width ?? undefined, height: value.height ?? undefined }
    return { src: pick.url, alt: value.alt, width: pick.width, height: pick.height, position }
  }

  const main = large ?? medium ?? { url: value.url, width: value.width ?? undefined, height: value.height ?? undefined }
  const srcSet = medium && large ? `${medium.url} ${medium.width ?? 960}w, ${large.url} ${large.width ?? 1920}w` : undefined
  return { src: main.url, srcSet, alt: value.alt, width: main.width, height: main.height, position }
}

type ProjectDoc = Pick<Project, 'id' | 'title' | 'slug' | 'hero' | 'home' | '_status' | 'updatedAt'>

const toDashboardProject = (doc: ProjectDoc, variant: 'card' | 'hero'): DashboardProject => ({
  id: doc.id,
  title: doc.title,
  slug: doc.slug ?? null,
  status: toStatus(doc._status),
  updatedAt: doc.updatedAt,
  // Urutan sama seperti tile di home: cover, lalu hero.
  image: toDashboardImage(doc.home?.cover, variant) ?? toDashboardImage(doc.hero, variant),
  hasVideo: Boolean(doc.home?.coverVideo),
})

const collapse = (value: string): string => value.replace(/\s+/g, ' ').trim()

export const excerpt = (value: string, max = 96): string => {
  const text = collapse(value)
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

/** Prospek yang masih dianggap aktif: pesan yang belum diarsipkan/spam, booking yang belum selesai/ditolak/batal. */
export const FOLLOW_UP_SOURCE_STATUSES = {
  contacts: ['new', 'read'],
  bookings: ['pending', 'confirmed'],
} as const

/** Jalankan satu bagian dashboard; kegagalan satu bagian tidak menjatuhkan seluruh halaman. */
async function safe<T>(payload: Payload, label: string, run: () => Promise<T>): Promise<T | null> {
  try {
    return await run()
  } catch (err) {
    payload.logger.error({ err, msg: `Dashboard: gagal memuat ${label}` })
    return null
  }
}

/**
 * Ambil data dashboard untuk user yang sedang login.
 *
 * - Projects & Pages memakai `draft: true` supaya yang tampil adalah versi terbaru (termasuk draft),
 *   sama seperti daftar koleksi di admin. Status "draft" juga dipakai untuk dokumen terbit yang punya
 *   perubahan belum dipublikasikan.
 * - Contacts: hanya pesan berstatus "new". Akses `read` Contacts khusus staff.
 */
export async function getDashboardData(
  payload: Payload,
  user: DashboardUser,
  now: Date = new Date(),
): Promise<DashboardData> {
  const access = { user, overrideAccess: false } as const

  const [projects, pages, messages, bookings, followUp] = await Promise.all([
    safe(payload, 'proyek', async () => {
      const [recent, drafts] = await Promise.all([
        payload.find({
          collection: 'projects',
          draft: true,
          sort: '-updatedAt',
          limit: PROJECT_LIMIT,
          depth: 1,
          select: { title: true, slug: true, hero: true, home: true, _status: true, updatedAt: true },
          ...access,
        }),
        payload.find({
          collection: 'projects',
          draft: true,
          where: { _status: { equals: 'draft' } },
          limit: 1,
          depth: 0,
          select: { _status: true },
          ...access,
        }),
      ])
      return {
        // Dokumen pertama dipakai untuk hero, jadi memakai varian gambar besar bila ada gambar.
        recent: recent.docs.map((doc, index) => toDashboardProject(doc, index === 0 ? 'hero' : 'card')),
        total: recent.totalDocs,
        drafts: drafts.totalDocs,
      }
    }),

    safe(payload, 'halaman', async () => {
      const result = await payload.find({
        collection: 'pages',
        draft: true,
        sort: '-updatedAt',
        limit: PAGE_LIMIT,
        depth: 0,
        select: { title: true, slug: true, _status: true, updatedAt: true },
        ...access,
      })
      return {
        recent: result.docs.map(
          (doc): DashboardPage => ({
            id: doc.id,
            title: doc.title,
            slug: doc.slug ?? null,
            status: toStatus(doc._status),
            updatedAt: doc.updatedAt,
          }),
        ),
        total: result.totalDocs,
      }
    }),

    safe(payload, 'pesan kontak', async () => {
      const result = await payload.find({
        collection: 'contacts',
        where: { status: { equals: 'new' } },
        sort: '-createdAt',
        limit: MESSAGE_LIMIT,
        depth: 0,
        select: { name: true, email: true, subject: true, message: true, createdAt: true },
        ...access,
      })
      return {
        recent: result.docs.map(
          (doc): DashboardMessage => ({
            id: doc.id,
            name: doc.name,
            email: doc.email,
            subject: doc.subject?.trim() || null,
            excerpt: excerpt(doc.message),
            createdAt: doc.createdAt,
          }),
        ),
        unread: result.totalDocs,
      }
    }),

    safe(payload, 'booking', async () => {
      const today = todayInJakarta(now)
      const since = new Date(now.getTime() - FRESH_BOOKING_HOURS * 3_600_000).toISOString()
      const list = {
        collection: 'bookings',
        sort: 'date',
        limit: BOOKING_LIMIT,
        depth: 0,
        select: { code: true, name: true, packageTitle: true, date: true, createdAt: true },
        ...access,
      } as const

      const [fresh, pending, upcoming] = await Promise.all([
        payload.count({
          collection: 'bookings',
          where: { and: [{ createdAt: { greater_than_equal: since } }, { status: { not_equals: 'spam' } }] },
          ...access,
        }),
        payload.find({ ...list, where: { status: { equals: 'pending' } } }),
        payload.find({
          ...list,
          where: {
            and: [
              { status: { equals: 'confirmed' } },
              { date: { greater_than_equal: today } },
              { date: { less_than_equal: addDays(today, UPCOMING_BOOKING_DAYS) } },
            ],
          },
        }),
      ])

      const toBooking = (doc: (typeof pending.docs)[number]): DashboardBooking => ({
        id: doc.id,
        code: doc.code,
        name: doc.name,
        packageTitle: doc.packageTitle?.trim() || null,
        date: doc.date,
        createdAt: doc.createdAt,
      })

      return {
        fresh: { total: fresh.totalDocs, since },
        pending: { items: pending.docs.map(toBooking), total: pending.totalDocs },
        upcoming: { items: upcoming.docs.map(toBooking), total: upcoming.totalDocs },
        today,
      }
    }),

    safe(payload, 'follow-up prospek', async () => {
      const count = (collection: 'contacts' | 'bookings', followUpStatus: FollowUpStatus) =>
        payload
          .count({
            collection,
            where: {
              and: [
                { 'followUp.status': { equals: followUpStatus } },
                { status: { in: [...FOLLOW_UP_SOURCE_STATUSES[collection]] } },
              ],
            },
            ...access,
          })
          .then((result) => result.totalDocs)

      const [contactsFresh, contactsContacted, bookingsFresh, bookingsContacted] = await Promise.all([
        count('contacts', 'new'),
        count('contacts', 'contacted'),
        count('bookings', 'new'),
        count('bookings', 'contacted'),
      ])
      return {
        contacts: { fresh: contactsFresh, contacted: contactsContacted },
        bookings: { fresh: bookingsFresh, contacted: bookingsContacted },
      }
    }),
  ])

  return { projects, pages, messages, bookings, followUp }
}

/**
 * Pilih proyek untuk hero: yang terbaru diperbarui dan punya gambar. Bila tidak ada satu pun yang
 * punya gambar, pakai yang terbaru. Sisanya masuk grid, urutan tetap dari yang terbaru.
 */
export function splitHero(recent: DashboardProject[]): { hero: DashboardProject | null; rest: DashboardProject[] } {
  const hero = recent.find((project) => project.image) ?? recent[0] ?? null
  return { hero, rest: recent.filter((project) => project !== hero) }
}

// --- Format teks (Bahasa Indonesia, zona waktu mengikuti statistik traffic) ---

export const greetingFor = (now: Date, timeZone = STATS_TZ): string => {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone }).format(now),
  )
  if (hour >= 4 && hour < 11) return 'Selamat pagi'
  if (hour >= 11 && hour < 15) return 'Selamat siang'
  if (hour >= 15 && hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export const displayName = (user: { email?: unknown }): string => {
  const email = typeof user.email === 'string' ? user.email : ''
  return email.split('@')[0] || 'Admin'
}

const dateOnly = (timeZone: string) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone })

const dateTime = (timeZone: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  })

/** "baru saja", "5 menit lalu", "3 jam lalu", "2 hari lalu", lalu tanggal untuk yang lebih lama. */
export const timeAgo = (iso: string, now: Date = new Date(), timeZone = STATS_TZ): string => {
  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) return ''
  const seconds = Math.max(0, Math.round((now.getTime() - then.getTime()) / 1000))
  if (seconds < 60) return 'baru saja'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  return dateOnly(timeZone).format(then)
}

/** Label tanggal booking: "Hari ini", "Besok", atau mis. "Sel, 28 Okt". Semua dalam WIB (YYYY-MM-DD). */
export const bookingDayLabel = (date: string, today: string): string => {
  if (date === today) return 'Hari ini'
  if (date === addDays(today, 1)) return 'Besok'
  return formatDateShort(date)
}

export const fullDate = (iso: string, timeZone = STATS_TZ): string => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : dateTime(timeZone).format(date)
}
