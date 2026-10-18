import type { CollectionConfig, PayloadHandler } from 'payload'
import { adminOnly, isStaff } from '../access'
import {
  clientIp,
  countryFromHeaders,
  isBot,
  normalizePath,
  parseUserAgent,
  referrerHost,
  visitorHash,
} from '../lib/analytics'
import { rateLimit } from '../lib/rateLimit'

/** Data kunjungan lebih lama dari ini dihapus otomatis. */
export const RETENTION_DAYS = 180

const done = () => new Response(null, { status: 204 })

/**
 * POST /api/visits/hit — dipanggil PageViewTracker di website.
 * Selalu 204 supaya tidak membocorkan alasan sebuah kunjungan diabaikan.
 */
const hit: PayloadHandler = async (req) => {
  const { payload } = req

  try {
    // Kunjungan admin/editor yang sedang login tidak dihitung.
    if (isStaff(req.user)) return done()

    const ua = req.headers.get('user-agent') ?? ''
    if (isBot(ua)) return done()

    const ip = clientIp(req.headers)
    if (!rateLimit(`hit:${ip}`, 120, 60_000)) return done()

    const body = (await req.json?.()) as { path?: unknown; referrer?: unknown } | undefined
    const path = normalizePath(body?.path)
    if (!path) return done()

    const ownHost = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? ''

    await payload.create({
      collection: 'visits',
      data: {
        path,
        referrer: referrerHost(body?.referrer, ownHost),
        country: countryFromHeaders(req.headers),
        visitor: visitorHash(process.env.PAYLOAD_SECRET || '', ip, ua),
        ...parseUserAgent(ua),
      },
    })

    // Bersihkan data lama sesekali (tanpa cron): ~1 dari 100 kunjungan.
    if (Math.random() < 0.01) {
      const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString()
      payload
        .delete({ collection: 'visits', where: { createdAt: { less_than: cutoff } } })
        .catch((err: unknown) => payload.logger.error({ err, msg: 'Gagal membersihkan data kunjungan lama' }))
    }
  } catch (err) {
    payload.logger.error({ err, msg: 'Gagal mencatat kunjungan' })
  }

  return done()
}

export const Visits: CollectionConfig = {
  slug: 'visits',
  labels: { singular: 'Kunjungan', plural: 'Kunjungan' },
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'referrer', 'device', 'browser', 'country', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    // Hanya dibuat lewat endpoint /hit (Local API), tidak bisa lewat REST/GraphQL/admin.
    create: () => false,
    read: adminOnly,
    update: () => false,
    delete: adminOnly,
  },
  endpoints: [{ path: '/hit', method: 'post', handler: hit }],
  fields: [
    { name: 'path', type: 'text', required: true, index: true },
    { name: 'referrer', type: 'text', label: 'Sumber (host)' },
    {
      name: 'device',
      type: 'select',
      options: [
        { label: 'Desktop', value: 'desktop' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'Lainnya', value: 'other' },
      ],
    },
    { name: 'browser', type: 'text' },
    { name: 'os', type: 'text', label: 'OS' },
    { name: 'country', type: 'text', label: 'Negara' },
    {
      name: 'visitor',
      type: 'text',
      index: true,
      admin: { description: 'ID anonim yang berganti tiap hari (bukan IP).' },
    },
  ],
}
