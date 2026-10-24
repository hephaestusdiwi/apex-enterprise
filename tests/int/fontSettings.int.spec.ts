// @vitest-environment node
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { getSiteSettings } from '@/content/site'
import { buildFontHead, DEFAULT_FONTS } from '@/lib/fonts'
import type { SiteSetting } from '@/payload-types'

let payload: Payload
let before: SiteSetting
let fontId: number
let woffId: number
let imageId: number

const woff = (signature: 'wOF2' | 'wOFF', size = 256) => {
  const buf = Buffer.alloc(size)
  buf.write(signature, 0, 'ascii')
  buf.writeUInt32BE(0x00010000, 4)
  buf.writeUInt32BE(size, 8)
  return buf
}

// PNG 1x1 valid.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

const upload = (name: string, mimetype: string, data: Buffer, alt = '') =>
  payload.create({ collection: 'media', data: { alt }, file: { data, mimetype, name, size: data.length } })

// Singleton global: selalu pulihkan pengaturan tipografi asli setelah test.
const save = (typography: NonNullable<SiteSetting['typography']>) =>
  payload.updateGlobal({
    slug: 'site-settings',
    data: { siteName: before.siteName || '__TEST__ Site', typography },
  })

const CLEAN = { source: 'default', googleFamily: null, file: null } as const

/** Pesan validasi dari Payload ada di error.data.errors (message umumnya hanya "field is invalid"). */
const rejection = async (promise: Promise<unknown>): Promise<string> => {
  try {
    await promise
  } catch (error) {
    const errors = (error as { data?: { errors?: { message: string }[] } }).data?.errors
    return errors?.map((item) => item.message).join(' | ') || (error as Error).message
  }
  throw new Error('Seharusnya ditolak, tetapi berhasil disimpan')
}

beforeAll(async () => {
  payload = await getPayload({ config: await config })
  before = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

  const font = await upload('__test__-font.woff2', 'font/woff2', woff('wOF2'))
  fontId = font.id
  const legacy = await upload('__test__-legacy.woff', 'application/octet-stream', woff('wOFF'), 'Legacy Test')
  woffId = legacy.id
  const image = await upload('__test__-image.png', 'image/png', PNG, '__TEST__ image')
  imageId = image.id
}, 60_000)

afterAll(async () => {
  await save({
    body: before.typography?.body ?? { source: 'default' },
    heading: before.typography?.heading ?? { source: 'default' },
  })
  await payload.delete({ collection: 'media', where: { filename: { like: '__test__-' } } })
}, 60_000)

describe('upload font ke Media', () => {
  it('menyimpan woff2/woff valid dengan MIME dinormalkan dan alt terisi otomatis', async () => {
    const font = await payload.findByID({ collection: 'media', id: fontId, depth: 0 })
    expect(font.mimeType).toBe('font/woff2')
    expect(font.alt).toBe('test font') // dari nama file
    expect(font.url).toMatch(/\/api\/media\/file\/__test__-font\.woff2/)

    const legacy = await payload.findByID({ collection: 'media', id: woffId, depth: 0 })
    expect(legacy.mimeType).toBe('font/woff') // dikirim klien sebagai octet-stream
    expect(legacy.alt).toBe('Legacy Test')
  })

  it('menolak file yang hanya diganti ekstensinya, ekstensi tidak cocok, dan format non-web', async () => {
    const html = Buffer.from('<html><script>alert(1)</script></html>'.padEnd(120))
    // Ditolak lapisan Payload (isi tidak terdeteksi sebagai font) ...
    expect(await rejection(upload('__test__-evil.woff2', 'font/woff2', html))).toMatch(/not allowed/)
    expect(await rejection(upload('__test__-flavor.woff2', 'font/woff2', woff('wOF2').fill(0x74, 4, 8) /* flavor tidak dikenal */))).toMatch(/not allowed/)
    // ... dan lapisan hook Media untuk yang lolos dari Payload.
    expect(await rejection(upload('__test__-evil2.woff2', 'image/png', PNG))).toMatch(/bukan font WOFF2/)
    expect(await rejection(upload('__test__-mismatch.woff', 'font/woff', woff('wOF2')))).toMatch(/tidak sesuai/)
    expect(await rejection(upload('__test__-fake.png', 'image/png', woff('wOF2')))).toMatch(/\.woff2/)
    expect(await rejection(upload('__test__-font.ttf', 'font/ttf', Buffer.alloc(200)))).toMatch(/not allowed/)
    expect(await rejection(upload('__test__-font.otf', 'font/otf', Buffer.alloc(200)))).toMatch(/not allowed/)
    expect(await rejection(upload('__test__-text.txt', 'text/plain', Buffer.from('halo')))).toMatch(/not allowed/)

    const leftovers = await payload.find({ collection: 'media', where: { filename: { in: ['__test__-evil.woff2', '__test__-mismatch.woff', '__test__-fake.png'] } } })
    expect(leftovers.totalDocs).toBe(0)
  })

  it('upload gambar biasa tidak berubah', async () => {
    const image = await payload.findByID({ collection: 'media', id: imageId, depth: 0 })
    expect(image.mimeType).toBe('image/png')
    expect(image.alt).toBe('__TEST__ image')
    expect(image.width).toBe(1)
  })
})

describe('Site Settings > Tipografi', () => {
  // updateGlobal menggabungkan data parsial dengan nilai tersimpan; mulai tiap kasus dari keadaan bersih.
  beforeEach(async () => {
    await save({ body: { ...CLEAN }, heading: { ...CLEAN } })
  })

  it('menyimpan pilihan Google Font dan membacanya di frontend', async () => {
    await save({
      body: { source: 'google', googleFamily: 'inter' },
      heading: { source: 'google', googleFamily: 'playfair-display' },
    })
    const { fonts } = await getSiteSettings()
    expect(fonts.body).toEqual({ source: 'google', key: 'inter' })
    expect(fonts.heading).toEqual({ source: 'google', key: 'playfair-display' })

    const head = buildFontHead(fonts)
    expect(head.googleHref).toContain('family=Inter')
    expect(head.googleHref).toContain('family=Playfair+Display')
    expect(head.css).toContain('--site-font-body:"Inter"')
  })

  it('menolak keluarga font di luar daftar dan sumber Google tanpa keluarga', async () => {
    expect(await rejection(save({ body: { source: 'google', googleFamily: 'comic-sans' as never } }))).toMatch(/daftar/)
    expect(await rejection(save({ body: { source: 'google', googleFamily: 'https://evil.example/x.css' as never } }))).toMatch(/daftar/)
    expect(await rejection(save({ heading: { source: 'google' } }))).toMatch(/daftar/)
  })

  it('menyimpan font upload dan menghasilkan @font-face dari file Media', async () => {
    await save({
      body: { source: 'upload', file: fontId },
      heading: { source: 'upload', file: woffId },
    })
    const { fonts } = await getSiteSettings()
    expect(fonts.body).toMatchObject({ source: 'upload', asset: { format: 'woff2' } })
    expect(fonts.heading).toMatchObject({ source: 'upload', asset: { format: 'woff' } })

    const head = buildFontHead(fonts)
    expect(head.googleHref).toBeNull()
    expect(head.css).toMatch(/@font-face\{font-family:"ApexBodyUpload";src:url\("\/api\/media\/file\/__test__-font\.woff2"\) format\("woff2"\)/)
    expect(head.css).toMatch(/format\("woff"\)/)
    expect(head.css).toContain('sans-serif')
  })

  it('menolak sumber upload tanpa file, atau dengan file yang bukan font', async () => {
    expect(await rejection(save({ body: { source: 'upload' } }))).toMatch(/Pilih file font/)
    expect(await rejection(save({ body: { source: 'upload', file: null } }))).toMatch(/Pilih file font/)
    expect(await rejection(save({ body: { source: 'upload', file: imageId } }))).toMatch(/\.woff2 atau \.woff/)
    expect(await rejection(save({ body: { source: 'upload', file: 999_999_999 } }))).toBeTruthy()
  })

  it('kosong atau bawaan = tampilan bawaan, tanpa CSS font', async () => {
    await save({ body: { source: 'default' }, heading: { source: 'default' } })
    const { fonts } = await getSiteSettings()
    expect(fonts).toEqual(DEFAULT_FONTS)
    expect(buildFontHead(fonts)).toEqual({ googleHref: null, preloads: [], css: '' })
  })

  it('file font yang sudah dipilih lalu dihapus dari Media jatuh ke bawaan', async () => {
    const temp = await upload('__test__-temp.woff2', 'font/woff2', woff('wOF2'))
    await save({ body: { source: 'upload', file: temp.id } })
    expect((await getSiteSettings()).fonts.body.source).toBe('upload')

    await payload.delete({ collection: 'media', id: temp.id })
    expect((await getSiteSettings()).fonts.body).toEqual({ source: 'default' })
  })
})
