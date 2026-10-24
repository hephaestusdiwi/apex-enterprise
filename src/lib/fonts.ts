// Font situs: daftar Google Fonts yang diizinkan, validasi file font upload, dan pembuat CSS.
// Semua yang masuk ke <link>/<style> berasal dari daftar di file ini atau lolos sanitasi di sini,
// jadi teks bebas dari admin tidak pernah ditulis ke CSS.

// --- Google Fonts (daftar dikelola di kode)

export type FontGeneric = 'sans-serif' | 'serif'

type GoogleFontDef = {
  label: string
  /** Nama keluarga persis seperti di Google Fonts (huruf, angka, spasi saja). */
  family: string
  generic: FontGeneric
  /** Hanya bobot yang benar-benar ada di Google Fonts: bobot yang tidak ada membuat seluruh request CSS gagal. */
  weights: readonly number[]
}

// Key (slug) = nilai yang disimpan di database. Menambah/menghapus key butuh migrasi (enum Postgres).
export const GOOGLE_FONTS = {
  inter: { label: 'Inter', family: 'Inter', generic: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  poppins: { label: 'Poppins', family: 'Poppins', generic: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  roboto: { label: 'Roboto', family: 'Roboto', generic: 'sans-serif', weights: [300, 400, 500, 700] },
  'open-sans': { label: 'Open Sans', family: 'Open Sans', generic: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  montserrat: { label: 'Montserrat', family: 'Montserrat', generic: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  lato: { label: 'Lato', family: 'Lato', generic: 'sans-serif', weights: [300, 400, 700] },
  'dm-sans': { label: 'DM Sans', family: 'DM Sans', generic: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  'work-sans': { label: 'Work Sans', family: 'Work Sans', generic: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  manrope: { label: 'Manrope', family: 'Manrope', generic: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  'space-grotesk': { label: 'Space Grotesk', family: 'Space Grotesk', generic: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  'bebas-neue': { label: 'Bebas Neue', family: 'Bebas Neue', generic: 'sans-serif', weights: [400] },
  'playfair-display': { label: 'Playfair Display', family: 'Playfair Display', generic: 'serif', weights: [400, 500, 600, 700] },
  lora: { label: 'Lora', family: 'Lora', generic: 'serif', weights: [400, 500, 600, 700] },
  merriweather: { label: 'Merriweather', family: 'Merriweather', generic: 'serif', weights: [300, 400, 700] },
  'cormorant-garamond': { label: 'Cormorant Garamond', family: 'Cormorant Garamond', generic: 'serif', weights: [300, 400, 500, 600, 700] },
  'dm-serif-display': { label: 'DM Serif Display', family: 'DM Serif Display', generic: 'serif', weights: [400] },
  'libre-baskerville': { label: 'Libre Baskerville', family: 'Libre Baskerville', generic: 'serif', weights: [400, 700] },
} as const satisfies Record<string, GoogleFontDef>

export type GoogleFontKey = keyof typeof GOOGLE_FONTS

export const GOOGLE_FONT_KEYS = Object.keys(GOOGLE_FONTS) as GoogleFontKey[]

export const GOOGLE_FONT_OPTIONS = GOOGLE_FONT_KEYS.map((key) => ({ label: GOOGLE_FONTS[key].label, value: key }))

export const isGoogleFontKey = (value: unknown): value is GoogleFontKey =>
  typeof value === 'string' && GOOGLE_FONT_KEYS.some((key) => key === value)

// --- File font upload

export type FontFormat = 'woff2' | 'woff'

export const FONT_FORMATS = {
  woff2: { mime: 'font/woff2', signature: 'wOF2', minSize: 48 },
  woff: { mime: 'font/woff', signature: 'wOFF', minSize: 44 },
} as const satisfies Record<FontFormat, { mime: string; signature: string; minSize: number }>

export const FONT_EXTENSIONS = Object.keys(FONT_FORMATS) as FontFormat[]

/** Dipakai untuk allowlist upload Media dan filter pemilih font di Site Settings. */
export const FONT_MIME_TYPES = FONT_EXTENSIONS.map((format) => FONT_FORMATS[format].mime)

// MIME yang umum dikirim browser/OS untuk file font (dan 'octet-stream' kalau OS tidak mengenalinya).
const CLIENT_FONT_MIMES = new Set([
  'font/woff2',
  'font/woff',
  'application/font-woff2',
  'application/font-woff',
  'application/x-font-woff2',
  'application/x-font-woff',
  'application/octet-stream',
  'binary/octet-stream',
])

const extensionOf = (filename: string | null | undefined): string => {
  const name = (filename ?? '').trim().toLowerCase()
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot + 1) : ''
}

const asFontFormat = (ext: string): FontFormat | null => FONT_EXTENSIONS.find((format) => format === ext) ?? null

/**
 * Baca header WOFF/WOFF2: tanda tangan, flavor (TrueType atau CFF), dan panjang yang dideklarasikan.
 * Ini pemeriksaan isi file, bukan sekadar nama atau MIME dari klien.
 */
export const detectFontFormat = (data: Uint8Array | null | undefined): FontFormat | null => {
  if (!data || data.length < 44) return null
  const ascii = (from: number) => String.fromCharCode(data[from]!, data[from + 1]!, data[from + 2]!, data[from + 3]!)
  const format = FONT_EXTENSIONS.find((candidate) => FONT_FORMATS[candidate].signature === ascii(0))
  if (!format) return null

  const flavor = ascii(4)
  const isTrueType = data[4] === 0x00 && data[5] === 0x01 && data[6] === 0x00 && data[7] === 0x00
  if (!isTrueType && flavor !== 'OTTO') return null

  const declared = ((data[8]! << 24) | (data[9]! << 16) | (data[10]! << 8) | data[11]!) >>> 0
  if (declared < FONT_FORMATS[format].minSize || declared > data.length) return null
  return format
}

export type FontUploadCheck =
  | { kind: 'not-font' }
  | { kind: 'font'; format: FontFormat; mimeType: string }
  | { kind: 'invalid'; message: string }

/**
 * Putusan untuk satu file upload. File yang tidak mengaku font (bukan ekstensi font, bukan MIME font,
 * isi bukan font) dibiarkan ke aturan Media biasa. File yang mengaku font harus konsisten:
 * ekstensi, isi, dan MIME dari klien harus cocok, dan formatnya harus .woff2 atau .woff.
 */
export const checkFontUpload = (file: {
  filename: string | null | undefined
  mimeType?: string | null
  data: Uint8Array | null | undefined
}): FontUploadCheck => {
  const ext = extensionOf(file.filename)
  const claimedFormat = asFontFormat(ext)
  const detected = detectFontFormat(file.data)
  const clientMime = (file.mimeType ?? '').split(';')[0]!.trim().toLowerCase()
  const claimsFont = claimedFormat !== null || detected !== null || clientMime.includes('font')

  if (!claimsFont) return { kind: 'not-font' }

  if (!claimedFormat) {
    return { kind: 'invalid', message: 'Format font harus .woff2 (disarankan) atau .woff.' }
  }
  if (!detected) {
    return { kind: 'invalid', message: `Isi file bukan font ${claimedFormat.toUpperCase()} yang valid. Pastikan file tidak rusak atau hanya diganti ekstensinya.` }
  }
  if (detected !== claimedFormat) {
    return { kind: 'invalid', message: `Ekstensi .${claimedFormat} tidak sesuai isi file (${detected.toUpperCase()}). Ganti ekstensinya.` }
  }
  if (clientMime && !CLIENT_FONT_MIMES.has(clientMime)) {
    return { kind: 'invalid', message: `Tipe file ${clientMime} tidak cocok untuk font.` }
  }
  return { kind: 'font', format: detected, mimeType: FONT_FORMATS[detected].mime }
}

/** Format font sebuah dokumen Media, atau null kalau bukan font yang konsisten (ekstensi + MIME tersimpan). */
export const fontFormatOfMedia = (media: { filename?: string | null; mimeType?: string | null }): FontFormat | null => {
  const format = asFontFormat(extensionOf(media.filename))
  return format && media.mimeType === FONT_FORMATS[format].mime ? format : null
}

/** Nama font untuk kolom alt Media (wajib) dari nama file: "Inter-Regular.woff2" -> "Inter Regular". */
export const fontLabelFromFilename = (filename: string | null | undefined): string => {
  const base = (filename ?? '').replace(/\.[^.]*$/, '').replace(/[-_]+/g, ' ').replace(/[^\p{L}\p{N} ]+/gu, '').trim()
  return base || 'Font'
}

/**
 * Jadikan URL file font aman dipakai di url("...") CSS. Hanya path lokal (mis. /api/media/file/x.woff2);
 * host lain, skema, dan karakter di luar daftar aman ditolak (null). Query string dibuang.
 */
export const safeFontUrl = (src: string | null | undefined): string | null => {
  if (!src) return null
  const origin = 'http://font.invalid'
  let url: URL
  try {
    url = new URL(src, origin)
  } catch {
    return null
  }
  if (url.origin !== origin) return null
  const path = url.pathname.replace(/['()]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
  return /^\/[A-Za-z0-9._~%/-]+$/.test(path) ? path : null
}

// --- Pilihan font & CSS

export type FontRole = 'body' | 'heading'
export type FontAsset = { src: string; format: FontFormat }

export type FontChoice =
  | { source: 'default' }
  | { source: 'google'; key: GoogleFontKey }
  | { source: 'upload'; asset: FontAsset }

export type SiteFonts = { body: FontChoice; heading: FontChoice }

export const DEFAULT_FONT: FontChoice = { source: 'default' }
export const DEFAULT_FONTS: SiteFonts = { body: DEFAULT_FONT, heading: DEFAULT_FONT }

/** Nama keluarga untuk @font-face font upload: tetap, tidak berasal dari input admin. */
export const UPLOAD_FAMILY: Record<FontRole, string> = { body: 'ApexBodyUpload', heading: 'ApexHeadingUpload' }

const SANS_FALLBACK = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF_FALLBACK = "Georgia, 'Times New Roman', serif"

/** Nilai font-family lengkap dengan fallback generik; null = pakai tampilan bawaan. */
export const fontStack = (choice: FontChoice, role: FontRole): string | null => {
  switch (choice.source) {
    case 'google': {
      const font = GOOGLE_FONTS[choice.key]
      return `"${font.family}", ${font.generic === 'serif' ? SERIF_FALLBACK : SANS_FALLBACK}`
    }
    case 'upload':
      return `"${UPLOAD_FAMILY[role]}", ${SANS_FALLBACK}`
    default:
      return null
  }
}

export const GOOGLE_FONTS_ORIGIN = 'https://fonts.googleapis.com'

/** URL stylesheet Google Fonts dari daftar di atas (bukan input bebas). Null kalau tidak ada font Google. */
export const buildGoogleFontsHref = (fonts: SiteFonts): string | null => {
  const weightsByKey = new Map<GoogleFontKey, readonly number[]>()
  for (const choice of [fonts.body, fonts.heading]) {
    if (choice.source === 'google') weightsByKey.set(choice.key, GOOGLE_FONTS[choice.key].weights)
  }
  if (weightsByKey.size === 0) return null

  const families = [...weightsByKey].map(([key, weights]) => {
    const family = GOOGLE_FONTS[key].family.replace(/ /g, '+')
    return `family=${family}:wght@${[...weights].sort((a, b) => a - b).join(';')}`
  })
  return `${GOOGLE_FONTS_ORIGIN}/css2?${families.join('&')}&display=swap`
}

export type FontHead = {
  /** Stylesheet Google Fonts, atau null. */
  googleHref: string | null
  /** File woff2 yang layak di-preload. */
  preloads: { href: string; type: string }[]
  /** @font-face + CSS variables. String kosong kalau semua font bawaan. */
  css: string
}

export const buildFontHead = (fonts: SiteFonts): FontHead => {
  const faces: string[] = []
  const preloads: FontHead['preloads'] = []
  const variables: string[] = []

  for (const role of ['body', 'heading'] as const) {
    const choice = fonts[role]
    const stack = fontStack(choice, role)
    if (!stack) continue

    if (choice.source === 'upload') {
      const href = safeFontUrl(choice.asset.src)
      if (!href) continue // URL tidak aman: lewati, tampilan bawaan tetap dipakai
      faces.push(
        `@font-face{font-family:"${UPLOAD_FAMILY[role]}";src:url("${href}") format("${choice.asset.format}");font-weight:100 900;font-style:normal;font-display:swap}`,
      )
      if (choice.asset.format === 'woff2' && !preloads.some((item) => item.href === href)) {
        preloads.push({ href, type: FONT_FORMATS.woff2.mime })
      }
    }
    variables.push(`--site-font-${role}:${stack}`)
  }

  const css = variables.length > 0 ? `${faces.join('')}:root{${variables.join(';')}}` : ''
  return { googleHref: buildGoogleFontsHref(fonts), preloads, css }
}
