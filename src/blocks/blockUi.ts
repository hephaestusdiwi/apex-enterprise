import type { Block } from 'payload'

/**
 * Tampilan pemilih blok di editor. Hanya memengaruhi admin (tidak mengubah data atau database):
 * blok dikelompokkan per fungsi dan diberi thumbnail ikon supaya mudah dikenali.
 */
const GROUPS: Record<string, string> = {
  heading: 'Teks',
  text: 'Teks',
  quote: 'Teks',
  list: 'Teks',
  image: 'Gambar & video',
  imageText: 'Gambar & video',
  gallery: 'Gambar & video',
  video: 'Gambar & video',
  link: 'Lainnya',
  embed: 'Lainnya',
  spacer: 'Lainnya',
  titleSlot: 'Penanda posisi',
  metaSlot: 'Penanda posisi',
}

const A = '#ff8a3d'
const dashed = `<rect x="18" y="14" width="84" height="52" rx="10" fill="none" stroke="${A}" stroke-width="2" stroke-dasharray="5 5" opacity=".55"/>`

/** Gambar tiap blok di kanvas 120x80. */
const GLYPHS: Record<string, string> = {
  heading: `<rect x="28" y="26" width="64" height="10" rx="5" fill="${A}"/><rect x="28" y="44" width="40" height="6" rx="3" fill="${A}" opacity=".45"/>`,
  text: `<rect x="26" y="22" width="68" height="6" rx="3" fill="${A}"/><rect x="26" y="35" width="68" height="6" rx="3" fill="${A}" opacity=".6"/><rect x="26" y="48" width="44" height="6" rx="3" fill="${A}" opacity=".4"/>`,
  image: `<rect x="30" y="18" width="60" height="44" rx="8" fill="none" stroke="${A}" stroke-width="4"/><circle cx="46" cy="32" r="5" fill="${A}"/><path d="M34 56L50 42L62 52L72 44L86 56" fill="none" stroke="${A}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`,
  imageText: `<rect x="24" y="22" width="34" height="36" rx="6" fill="${A}" opacity=".55"/><rect x="66" y="24" width="30" height="6" rx="3" fill="${A}"/><rect x="66" y="36" width="30" height="6" rx="3" fill="${A}" opacity=".6"/><rect x="66" y="48" width="20" height="6" rx="3" fill="${A}" opacity=".4"/>`,
  gallery: `<rect x="26" y="18" width="32" height="20" rx="5" fill="${A}"/><rect x="62" y="18" width="32" height="20" rx="5" fill="${A}" opacity=".55"/><rect x="26" y="42" width="32" height="20" rx="5" fill="${A}" opacity=".55"/><rect x="62" y="42" width="32" height="20" rx="5" fill="${A}" opacity=".8"/>`,
  video: `<rect x="26" y="18" width="68" height="44" rx="9" fill="none" stroke="${A}" stroke-width="4"/><polygon points="53,30 53,50 70,40" fill="${A}"/>`,
  link: `<rect x="24" y="30" width="72" height="20" rx="10" fill="none" stroke="${A}" stroke-width="4"/><path d="M50 40h20m-7-7l7 7-7 7" fill="none" stroke="${A}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  quote: `<rect x="26" y="20" width="6" height="40" rx="3" fill="${A}"/><rect x="42" y="22" width="52" height="6" rx="3" fill="${A}"/><rect x="42" y="36" width="52" height="6" rx="3" fill="${A}" opacity=".6"/><rect x="42" y="50" width="30" height="6" rx="3" fill="${A}" opacity=".4"/>`,
  embed: `<polyline points="50,28 36,40 50,52" fill="none" stroke="${A}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="70,28 84,40 70,52" fill="none" stroke="${A}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><line x1="64" y1="26" x2="56" y2="54" stroke="${A}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`,
  list: `<circle cx="32" cy="26" r="4" fill="${A}"/><rect x="44" y="23" width="48" height="6" rx="3" fill="${A}"/><circle cx="32" cy="40" r="4" fill="${A}" opacity=".7"/><rect x="44" y="37" width="40" height="6" rx="3" fill="${A}" opacity=".7"/><circle cx="32" cy="54" r="4" fill="${A}" opacity=".45"/><rect x="44" y="51" width="46" height="6" rx="3" fill="${A}" opacity=".45"/>`,
  spacer: `<path d="M52 30l8-8 8 8M52 50l8 8 8-8" fill="none" stroke="${A}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><line x1="60" y1="24" x2="60" y2="56" stroke="${A}" stroke-width="3" stroke-dasharray="3 5" opacity=".6"/>`,
  titleSlot: `${dashed}<rect x="28" y="26" width="64" height="12" rx="6" fill="${A}"/><rect x="28" y="46" width="34" height="6" rx="3" fill="${A}" opacity=".4"/>`,
  metaSlot: `${dashed}<rect x="28" y="24" width="18" height="6" rx="3" fill="${A}" opacity=".5"/><rect x="52" y="24" width="40" height="6" rx="3" fill="${A}"/><rect x="28" y="38" width="18" height="6" rx="3" fill="${A}" opacity=".5"/><rect x="52" y="38" width="32" height="6" rx="3" fill="${A}"/><rect x="28" y="52" width="18" height="6" rx="3" fill="${A}" opacity=".5"/><rect x="52" y="52" width="36" height="6" rx="3" fill="${A}"/>`,
}

const thumbnail = (slug: string): string | undefined => {
  const glyph = GLYPHS[slug]
  if (!glyph) return undefined
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><rect width="120" height="80" rx="10" fill="#8a8f9a" fill-opacity=".14"/>${glyph}</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const blockAdmin = (slug: string): NonNullable<Block['admin']> => {
  const group = GROUPS[slug]
  const image = thumbnail(slug)
  return {
    ...(group ? { group } : {}),
    ...(image ? { images: { thumbnail: image } } : {}),
  }
}

/** Menambahkan grup dan thumbnail ke sebuah blok. Pengaturan `admin` milik blok itu sendiri tetap menang. */
export const withBlockUi = (block: Block): Block => ({
  ...block,
  admin: { ...blockAdmin(block.slug), ...block.admin },
})
