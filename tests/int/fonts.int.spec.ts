// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  DEFAULT_FONTS,
  FONT_MIME_TYPES,
  GOOGLE_FONTS,
  GOOGLE_FONT_KEYS,
  GOOGLE_FONT_OPTIONS,
  buildFontHead,
  checkFontUpload,
  detectFontFormat,
  fontFormatOfMedia,
  fontLabelFromFilename,
  fontStack,
  isGoogleFontKey,
  safeFontUrl,
  type SiteFonts,
} from '@/lib/fonts'
import { toFontAsset, toFontChoice } from '@/content/mapper'
import type { Media } from '@/payload-types'

/** Header WOFF/WOFF2 minimal yang valid (tanda tangan, flavor TrueType, panjang). */
const woff = (signature: 'wOF2' | 'wOFF', opts: { flavor?: 'TT' | 'OTTO'; size?: number; declared?: number } = {}) => {
  const size = opts.size ?? 128
  const buf = Buffer.alloc(size)
  buf.write(signature, 0, 'ascii')
  if (opts.flavor === 'OTTO') buf.write('OTTO', 4, 'ascii')
  else buf.writeUInt32BE(0x00010000, 4)
  buf.writeUInt32BE(opts.declared ?? size, 8)
  return buf
}

const media = (overrides: Partial<Media> = {}): Media =>
  ({
    id: 1,
    alt: 'Font',
    filename: 'brand.woff2',
    mimeType: 'font/woff2',
    url: '/api/media/file/brand.woff2',
    createdAt: '2026-10-23T00:00:00.000Z',
    updatedAt: '2026-10-23T00:00:00.000Z',
    ...overrides,
  }) as Media

describe('font: pilihan Google Fonts', () => {
  it('daftar di kode valid: nama aman, bobot terurut, ada generik', () => {
    expect(GOOGLE_FONT_KEYS.length).toBeGreaterThan(0)
    for (const key of GOOGLE_FONT_KEYS) {
      const font = GOOGLE_FONTS[key]
      expect(key).toMatch(/^[a-z0-9-]+$/)
      expect(font.family).toMatch(/^[A-Za-z0-9 ]+$/)
      expect(['sans-serif', 'serif']).toContain(font.generic)
      expect(font.weights.length).toBeGreaterThan(0)
      expect([...font.weights]).toEqual([...font.weights].sort((a, b) => a - b))
    }
    expect(GOOGLE_FONT_OPTIONS.map((option) => option.value)).toEqual(GOOGLE_FONT_KEYS)
  })

  it('memetakan pilihan Google Font ke URL stylesheet, variabel CSS, dan fallback generik', () => {
    const fonts: SiteFonts = {
      body: toFontChoice({ source: 'google', googleFamily: 'open-sans' }),
      heading: toFontChoice({ source: 'google', googleFamily: 'playfair-display' }),
    }
    expect(fonts.body).toEqual({ source: 'google', key: 'open-sans' })

    const head = buildFontHead(fonts)
    const url = new URL(head.googleHref!)
    expect(url.origin).toBe('https://fonts.googleapis.com')
    expect(url.pathname).toBe('/css2')
    expect(head.googleHref).toContain('family=Open+Sans:wght@300;400;500;600;700')
    expect(head.googleHref).toContain('family=Playfair+Display:wght@400;500;600;700')
    expect(head.googleHref).toContain('display=swap')

    expect(head.css).toContain('--site-font-body:"Open Sans", \'Helvetica Neue\', Helvetica, Arial, sans-serif')
    expect(head.css).toContain('--site-font-heading:"Playfair Display", Georgia, \'Times New Roman\', serif')
    expect(head.preloads).toEqual([])
  })

  it('tidak menggandakan family kalau body dan heading memakai font yang sama', () => {
    const choice = toFontChoice({ source: 'google', googleFamily: 'inter' })
    const head = buildFontHead({ body: choice, heading: choice })
    expect(head.googleHref!.match(/family=/g)).toHaveLength(1)
  })

  it('menolak nilai di luar daftar (tidak ada URL font bebas)', () => {
    for (const bad of ['https://evil.example/x.css', 'Inter', 'INTER', 'inter;color:red', '', null, undefined]) {
      expect(isGoogleFontKey(bad)).toBe(false)
    }
    expect(toFontChoice({ source: 'google', googleFamily: 'https://evil.example/x.css' as never })).toEqual({ source: 'default' })
    expect(toFontChoice({ source: 'google', googleFamily: 'Inter' as never })).toEqual({ source: 'default' })
  })
})

describe('font: upload sendiri', () => {
  it('memetakan Media font menjadi @font-face dengan nama aman dan fallback generik', () => {
    const body = toFontChoice({ source: 'upload', file: media() })
    expect(body).toEqual({ source: 'upload', asset: { src: '/api/media/file/brand.woff2', format: 'woff2' } })

    const head = buildFontHead({ body, heading: toFontChoice({ source: 'upload', file: media({ filename: 'head.woff', mimeType: 'font/woff', url: '/api/media/file/head.woff' }) }) })
    expect(head.googleHref).toBeNull()
    expect(head.css).toContain('@font-face{font-family:"ApexBodyUpload";src:url("/api/media/file/brand.woff2") format("woff2")')
    expect(head.css).toContain('@font-face{font-family:"ApexHeadingUpload";src:url("/api/media/file/head.woff") format("woff")')
    expect(head.css).toContain('font-display:swap')
    expect(head.css).toContain('--site-font-body:"ApexBodyUpload", \'Helvetica Neue\', Helvetica, Arial, sans-serif')
    expect(head.css).toContain('--site-font-heading:"ApexHeadingUpload", ')
    // Hanya woff2 yang di-preload.
    expect(head.preloads).toEqual([{ href: '/api/media/file/brand.woff2', type: 'font/woff2' }])
  })

  it('hanya menerima file font yang konsisten (ekstensi + MIME) dan bukan sekadar id', () => {
    expect(toFontAsset(media({ filename: 'x.png', mimeType: 'image/png', url: '/api/media/file/x.png' }))).toBeNull()
    expect(toFontAsset(media({ mimeType: 'image/png' }))).toBeNull()
    expect(toFontAsset(media({ mimeType: 'font/woff' }))).toBeNull() // .woff2 tapi MIME woff
    expect(toFontAsset(media({ filename: 'x.ttf', mimeType: 'font/ttf', url: '/api/media/file/x.ttf' }))).toBeNull()
    expect(toFontAsset(7)).toBeNull() // relasi belum di-populate
    expect(toFontAsset(null)).toBeNull()
    expect(fontFormatOfMedia({ filename: 'A.WOFF2', mimeType: 'font/woff2' })).toBe('woff2')
  })

  it('menolak URL yang tidak aman dan tidak pernah menyuntikkan CSS', () => {
    const attacks = [
      'https://evil.example/a.woff2',
      '//evil.example/a.woff2',
      '/\\evil.example/a.woff2',
      'javascript:alert(1)',
      'data:font/woff2;base64,AAAA',
      '/api/media/file/a.woff2"); } body { display:none } /*',
      '/api/media/file/a.woff2;color:red',
    ]
    for (const url of attacks) {
      expect(safeFontUrl(url), url).toBeNull()
      expect(toFontChoice({ source: 'upload', file: media({ url }) }), url).toEqual({ source: 'default' })
    }
    // Tanda kutip dan kurung pada nama file di-encode, query dibuang.
    expect(safeFontUrl("/api/media/file/my font (1)'.woff2?2026")).toBe('/api/media/file/my%20font%20%281%29%27.woff2')

    const head = buildFontHead({ body: { source: 'upload', asset: { src: '/api/media/file/my font (1).woff2', format: 'woff2' } }, heading: DEFAULT_FONTS.heading })
    expect(head.css).not.toMatch(/[<>\\]/)
    expect(head.css).toContain('url("/api/media/file/my%20font%20%281%29.woff2")')
  })

  describe('validasi upload (tipe file + ekstensi + isi)', () => {
    const check = (filename: string, mimeType: string | undefined, data: Buffer) => checkFontUpload({ filename, mimeType, data })

    it('allowlist Media hanya woff2 dan woff', () => {
      expect([...FONT_MIME_TYPES]).toEqual(['font/woff2', 'font/woff'])
    })

    it('menerima woff2 dan woff yang valid, dengan MIME dinormalkan', () => {
      expect(check('Inter.woff2', 'font/woff2', woff('wOF2'))).toEqual({ kind: 'font', format: 'woff2', mimeType: 'font/woff2' })
      expect(check('Inter.WOFF2', 'application/octet-stream', woff('wOF2', { flavor: 'OTTO' }))).toEqual({ kind: 'font', format: 'woff2', mimeType: 'font/woff2' })
      expect(check('Inter.woff', 'application/font-woff', woff('wOFF'))).toEqual({ kind: 'font', format: 'woff', mimeType: 'font/woff' })
      expect(check('Inter.woff2', '', woff('wOF2'))).toMatchObject({ kind: 'font' })
    })

    it('menolak file yang hanya diganti ekstensinya', () => {
      expect(check('evil.woff2', 'font/woff2', Buffer.from('<html><script>alert(1)</script></html>'.padEnd(80)))).toMatchObject({ kind: 'invalid' })
      const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex')
      expect(check('evil.woff2', 'image/png', png)).toMatchObject({ kind: 'invalid' })
    })

    it('menolak ekstensi yang tidak cocok dengan isi, atau format font lain', () => {
      expect(check('a.woff', 'font/woff', woff('wOF2'))).toMatchObject({ kind: 'invalid', message: expect.stringContaining('tidak sesuai') })
      expect(check('a.png', 'image/png', woff('wOF2'))).toMatchObject({ kind: 'invalid' })
      expect(check('a.ttf', 'font/ttf', Buffer.alloc(100))).toMatchObject({ kind: 'invalid', message: expect.stringContaining('.woff2') })
      expect(check('a.otf', 'font/otf', Buffer.alloc(100))).toMatchObject({ kind: 'invalid' })
    })

    it('menolak MIME klien yang bukan font dan header yang rusak/terpotong', () => {
      expect(check('a.woff2', 'text/html', woff('wOF2'))).toMatchObject({ kind: 'invalid' })
      expect(check('a.woff2', 'font/woff2', woff('wOF2', { declared: 5000 }))).toMatchObject({ kind: 'invalid' }) // terpotong
      expect(check('a.woff2', 'font/woff2', woff('wOF2', { size: 20 }))).toMatchObject({ kind: 'invalid' })
      expect(check('a.woff2', 'font/woff2', Buffer.alloc(0))).toMatchObject({ kind: 'invalid' })
      expect(detectFontFormat(null)).toBeNull()
    })

    it('tidak mengusik upload gambar biasa', () => {
      const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex')
      expect(check('foto.png', 'image/png', png)).toEqual({ kind: 'not-font' })
      expect(check('foto.jpg', 'image/jpeg', Buffer.alloc(100))).toEqual({ kind: 'not-font' })
    })

    it('mengisi alt dari nama file', () => {
      expect(fontLabelFromFilename('Inter-Regular.woff2')).toBe('Inter Regular')
      expect(fontLabelFromFilename('my_font.v2.woff')).toBe('my fontv2')
      expect(fontLabelFromFilename('.woff2')).toBe('Font')
      expect(fontLabelFromFilename(null)).toBe('Font')
    })
  })
})

describe('font: fallback generik', () => {
  it('setiap font pilihan berakhir dengan keluarga generik', () => {
    for (const key of GOOGLE_FONT_KEYS) {
      const stack = fontStack({ source: 'google', key }, 'body')!
      expect(stack.endsWith(GOOGLE_FONTS[key].generic), key).toBe(true)
      expect(stack.startsWith(`"${GOOGLE_FONTS[key].family}",`), key).toBe(true)
    }
    const upload = fontStack({ source: 'upload', asset: { src: '/api/media/file/a.woff2', format: 'woff2' } }, 'heading')!
    expect(upload.endsWith('sans-serif')).toBe(true)
  })

  it('font serif memakai fallback serif, bukan sans', () => {
    expect(fontStack({ source: 'google', key: 'lora' }, 'body')).toMatch(/, serif$/)
    expect(fontStack({ source: 'google', key: 'inter' }, 'body')).toMatch(/, sans-serif$/)
  })
})

describe('font: nilai kosong dan tampilan bawaan', () => {
  it('tidak ada pilihan = bawaan, tanpa CSS, link, atau preload', () => {
    for (const empty of [null, undefined, {}, { source: null }, { source: 'default' as const }]) {
      expect(toFontChoice(empty)).toEqual({ source: 'default' })
    }
    expect(buildFontHead(DEFAULT_FONTS)).toEqual({ googleHref: null, preloads: [], css: '' })
    expect(fontStack({ source: 'default' }, 'body')).toBeNull()
  })

  it('pilihan tidak lengkap jatuh ke bawaan', () => {
    expect(toFontChoice({ source: 'google' })).toEqual({ source: 'default' })
    expect(toFontChoice({ source: 'google', googleFamily: null })).toEqual({ source: 'default' })
    expect(toFontChoice({ source: 'upload' })).toEqual({ source: 'default' })
    expect(toFontChoice({ source: 'upload', file: null })).toEqual({ source: 'default' })
    expect(toFontChoice({ source: 'upload', file: 42 })).toEqual({ source: 'default' })
  })

  it('hanya satu peran yang dipilih: peran lain tidak menulis variabelnya', () => {
    const head = buildFontHead({ body: { source: 'google', key: 'inter' }, heading: { source: 'default' } })
    expect(head.css).toContain('--site-font-body:')
    expect(head.css).not.toContain('--site-font-heading')

    const headingOnly = buildFontHead({ body: { source: 'default' }, heading: { source: 'google', key: 'lora' } })
    expect(headingOnly.css).toContain('--site-font-heading:')
    expect(headingOnly.css).not.toContain('--site-font-body')
  })

  it('font upload dengan URL tidak aman diabaikan, font Google pasangannya tetap jalan', () => {
    const head = buildFontHead({
      body: { source: 'upload', asset: { src: 'https://evil.example/a.woff2', format: 'woff2' } },
      heading: { source: 'google', key: 'lora' },
    })
    expect(head.css).not.toContain('--site-font-body')
    expect(head.css).not.toContain('@font-face')
    expect(head.css).toContain('--site-font-heading')
    expect(head.googleHref).toContain('family=Lora')
  })
})
