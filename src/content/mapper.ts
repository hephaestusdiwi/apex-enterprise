import type { Media, Page, Post, PostCategory, Project, SiteSetting, Video } from '@/payload-types'
import { isAllowedEmbedUrl } from '@/lib/embed'
import { DEFAULT_FONT, fontFormatOfMedia, isGoogleFontKey, safeFontUrl, type FontAsset, type FontChoice } from '@/lib/fonts'
import { isSafeHref } from '@/lib/href'
import { TEXT_COLOR_KEYS, TEXT_SIZE_KEYS } from '@/lib/richStyles'
import { parseVideoUrl } from '@/lib/video'
import {
  EMBED_ASPECTS,
  GALLERY_VARIANTS,
  HOME_ALIGNS,
  HOME_SIZES,
  MOTIONS,
  SPACES,
  WIDTHS,
  SeoData,
  type BlockData,
  type BlockLayout,
  type MediaAsset,
  type PageData,
  type PostCategoryData,
  type PostData,
  type PostSummary,
  type ProjectData,
  type ProjectMetaItem,
  type ProjectSummary,
  type RichAlign,
  type RichBlock,
  type RichInline,
  type RichList,
  type RichListItem,
  type VideoAsset,
  type VideoSource,
} from './types'

type PayloadBlock = NonNullable<Project['blocks']>[number]

/** Data induk yang dibutuhkan block penanda (slot). */
type BlockContext = { title: string; meta: ProjectMetaItem[] }

/** Ambil nilai hanya kalau ada di daftar yang diizinkan ('default' otomatis jadi undefined). */
const pick = <T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
): T | undefined => allowed.find((item) => item === value)

const toLayout = (layout: PayloadBlock['layout']): BlockLayout => ({
  width: pick(layout?.width, WIDTHS),
  spaceBefore: pick(layout?.spaceBefore, SPACES),
  spaceAfter: pick(layout?.spaceAfter, SPACES),
  motion: pick(layout?.motion, MOTIONS),
})

export const toSeo = (seo: Project['seo']): SeoData => ({
  title: seo?.title?.trim() || undefined,
  description: seo?.description?.trim() || undefined,
  image: toMedia(seo?.image),
  noIndex: Boolean(seo?.noIndex),
})

export const toMedia = (value: number | Media | null | undefined): MediaAsset | null => {
  if (!value || typeof value !== 'object') return null
  if (!value.url || !value.width || !value.height) return null
  return {
    src: value.url,
    alt: value.alt,
    width: value.width,
    height: value.height,
    focalX: value.focalX ?? undefined,
    focalY: value.focalY ?? undefined,
    og:
      value.sizes?.og?.url && value.sizes.og.width && value.sizes.og.height
      ? { src: value.sizes.og.url, width: value.sizes.og.width, height: value.sizes.og.height }
      : undefined,
  }
}

const toMeta = (doc: Project): ProjectMetaItem[] =>
  (doc.meta ?? []).map(({ label, value }) => ({ label, value }))

// --- Lexical -> node sederhana 

type LexNode = {
  type: string
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  children?: LexNode[]
  fields?: { url?: string; newTab?: boolean }
  /** State teks (TextStateFeature): { color: 'accent', size: 'large' }. */
  $?: Record<string, unknown>
}

const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKE = 4
const IS_UNDERLINE = 8

const asString = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined)

const toInlines = (nodes: LexNode[] | undefined): RichInline[] =>
  (nodes ?? []).flatMap((node): RichInline[] => {
    switch (node.type) {
      case 'text': {
        if (!node.text) return []
        const format = typeof node.format === 'number' ? node.format : 0
        return [
          {
            type: 'text',
            text: node.text,
            bold: (format & IS_BOLD) !== 0,
            italic: (format & IS_ITALIC) !== 0,
            underline: (format & IS_UNDERLINE) !== 0,
            strike: (format & IS_STRIKE) !== 0,
            color: pick(asString(node.$?.color), TEXT_COLOR_KEYS),
            size: pick(asString(node.$?.size), TEXT_SIZE_KEYS),
          },
        ]
      }
      case 'linebreak':
        return [{ type: 'break' }]
      case 'link': {
        const children = toInlines(node.children)
        const href = node.fields?.url
        if (!href || !isSafeHref(href)) return children
        return [{ type: 'link', href, newTab: Boolean(node.fields?.newTab), children }]
      }
      default:
        return []
    }
  })

const ALIGNS = ['left', 'center', 'right', 'justify'] as const

const toAlign = (format: LexNode['format']): RichAlign | undefined =>
  pick(asString(format), ALIGNS)

const toList = (node: LexNode): RichList | null => {
  const items: RichListItem[] = []
  for (const item of node.children ?? []) {
    if (item.type !== 'listitem') continue
    const nodes = item.children ?? []
    const nested = nodes
      .filter((child) => child.type === 'list')
      .map(toList)
      .filter((list): list is RichList => list !== null)
    const children = toInlines(nodes.filter((child) => child.type !== 'list'))

    if (children.length > 0) {
      items.push({ children, nested })
    } else if (nested.length > 0 && items.length > 0) {
      // Lexical menaruh sub-list di list item tersendiri; tempelkan ke item sebelumnya.
      items[items.length - 1]!.nested.push(...nested)
    }
  }
  return items.length > 0 ? { type: 'list', ordered: node.listType === 'number', items } : null
}

const toRichBlocks = (body: unknown): RichBlock[] => {
  const root = (body as { root?: { children?: LexNode[] } } | null | undefined)?.root
  return (root?.children ?? []).flatMap((node): RichBlock[] => {
    const align = toAlign(node.format)
    switch (node.type) {
      case 'paragraph': {
        const children = toInlines(node.children)
        return children.length > 0 ? [{ type: 'paragraph', align, children }] : []
      }
      case 'heading': {
        const children = toInlines(node.children)
        const level = node.tag === 'h4' ? 4 : node.tag === 'h3' ? 3 : 2
        return children.length > 0 ? [{ type: 'heading', level, align, children }] : []
      }
      case 'quote': {
        const children = toInlines(node.children)
        return children.length > 0 ? [{ type: 'quote', align, children }] : []
      }
      case 'list': {
        const list = toList(node)
        return list ? [list] : []
      }
      default:
        return []
    }
  })
}

// --- Video

export const toVideoAsset = (value: number | Video | null | undefined): VideoAsset | null => {
  if (!value || typeof value !== 'object' || !value.url) return null
  if (!value.mimeType?.startsWith('video/')) return null
  return { src: value.url, mimeType: value.mimeType }
}

const toVideoSource = (block: Extract<PayloadBlock, { blockType: 'video' }>): VideoSource | null => {
  if (block.provider === 'file') {
    const file = toVideoAsset(block.file)
    return file ? { kind: 'file', ...file } : null
  }
  const parsed = block.url ? parseVideoUrl(block.url) : null
  return parsed ? { kind: 'embed', provider: parsed.provider, src: parsed.src } : null
}

// --- Font

/** Hanya file font .woff2/.woff yang konsisten (ekstensi + MIME) dan ber-URL lokal yang aman. */
export const toFontAsset = (value: number | Media | null | undefined): FontAsset | null => {
  if (!value || typeof value !== 'object') return null
  const format = fontFormatOfMedia(value)
  const src = safeFontUrl(value.url)
  return format && src ? { src, format } : null
}

type FontGroup = NonNullable<NonNullable<SiteSetting['typography']>['body']>

/** Pilihan admin -> font yang dipakai. Kosong, tidak lengkap, atau tidak valid = tampilan bawaan. */
export const toFontChoice = (group: FontGroup | null | undefined): FontChoice => {
  if (group?.source === 'google') {
    return isGoogleFontKey(group.googleFamily) ? { source: 'google', key: group.googleFamily } : DEFAULT_FONT
  }
  if (group?.source === 'upload') {
    const asset = toFontAsset(group.file)
    return asset ? { source: 'upload', asset } : DEFAULT_FONT
  }
  return DEFAULT_FONT
}

// --- Block

const mapBlock = (block: PayloadBlock, index: number, ctx: BlockContext): BlockData | null => {
  const id = block.id ?? `${block.blockType}-${index}`
  const layout = toLayout(block.layout)

  switch (block.blockType) {
    case 'heading':
      return { type: 'heading', id, layout, text: block.text, level: block.level === 'h3' ? 'h3' : 'h2' }
    case 'text': {
      const content = toRichBlocks(block.body)
      return content.length > 0 ? { type: 'text', id, layout, content } : null
    }
    case 'image': {
      const media = toMedia(block.media)
      return media ? { type: 'image', id, layout, media, caption: block.caption || undefined } : null
    }
    case 'imageText': {
      const media = toMedia(block.media)
      const content = toRichBlocks(block.body)
      if (!media || content.length === 0) return null
      return {
        type: 'imageText',
        id,
        layout,
        media,
        content,
        imageSide: block.imageSide === 'left' ? 'left' : 'right',
        includeMeta: Boolean(block.includeMeta),
        meta: block.includeMeta ? ctx.meta : [],
      }
    }
    case 'gallery': {
      const images = (block.images ?? [])
        .map((image) => toMedia(image))
        .filter((image): image is MediaAsset => image !== null)
      return images.length > 0
        ? { type: 'gallery', id, layout, variant: pick(block.variant, GALLERY_VARIANTS) ?? 'grid-2', images }
        : null
    }
    case 'video': {
      const source = toVideoSource(block)
      return source ? { type: 'video', id, layout, source, caption: block.caption || undefined } : null
    }
    case 'link':
      return isSafeHref(block.url)
        ? { type: 'link', id, layout, label: block.label, href: block.url, newTab: Boolean(block.newTab) }
        : null
    case 'quote':
      return { type: 'quote', id, layout, text: block.text, attribution: block.attribution || undefined }
    case 'embed':
      // Cek allowlist diulang saat render: data lama/draft tidak boleh lolos hanya karena validasi admin.
      return isAllowedEmbedUrl(block.url)
        ? {
            type: 'embed',
            id,
            layout,
            src: block.url.trim(),
            title: block.title || 'Embedded content',
            aspect: pick(block.aspect, EMBED_ASPECTS) ?? '16-9',
          }
        : null
    case 'list': {
      const items = (block.items ?? []).map((item) => item.text).filter((text) => text.trim() !== '')
      return items.length > 0
        ? { type: 'list', id, layout, ordered: block.style === 'ordered', items }
        : null
    }
    case 'spacer':
      return { type: 'spacer', id, layout, size: pick(block.size, ['sm', 'md', 'lg', 'xl'] as const) ?? 'md' }
    case 'titleSlot':
      return { type: 'titleSlot', id, layout, title: ctx.title }
    case 'metaSlot': {
      return ctx.meta.length > 0 ? { type: 'metaSlot', id, layout, items: ctx.meta } : null
    }
    default: {
      // Error compile di sini = ada block baru di Payload yang belum dipetakan.
      const unmapped: never = block
      return unmapped
    }
  }
}

const mapBlocks = (blocks: Project['blocks'], ctx: BlockContext): BlockData[] =>
  (blocks ?? [])
    .map((block, index) => mapBlock(block, index, ctx))
    .filter((block): block is BlockData => block !== null)

export const mapProject = (doc: Project): ProjectData => {
  const meta = toMeta(doc)
  return {
    id: doc.id,
    slug: doc.slug ?? '',
    title: doc.title,
    hero: toMedia(doc.hero),
    seo: toSeo(doc.seo),
    meta,
    blocks: mapBlocks(doc.blocks, { title: doc.title, meta }),
  }
}

export const mapPage = (doc: Page): PageData => ({
  id: doc.id,
  slug: doc.slug ?? '',
  title: doc.title,
  seo: toSeo(doc.seo),
  blocks: mapBlocks(doc.blocks, { title: doc.title, meta: [] }),
})

type SummaryDoc = Pick<Project, 'id' | 'title' | 'slug' | 'hero' | 'home'>

export const mapSummary = (doc: SummaryDoc): ProjectSummary => ({
  id: doc.id,
  slug: doc.slug ?? '',
  title: doc.title,
  image: toMedia(doc.home?.cover) ?? toMedia(doc.hero),
  video: toVideoAsset(doc.home?.coverVideo),
  size: pick(doc.home?.size, HOME_SIZES) ?? 'medium',
  align: pick(doc.home?.align, HOME_ALIGNS) ?? 'center',
})

// --- Blog

export const toPostCategory = (value: number | PostCategory | null | undefined): PostCategoryData | null => {
  if (!value || typeof value !== 'object' || !value.slug) return null
  return {
    id: value.id,
    slug: value.slug,
    title: value.title,
    description: value.description?.trim() || undefined,
  }
}

type PostSummaryDoc = Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'cover' | 'category' | 'authorName' | 'publishedAt'>

export const mapPostSummary = (doc: PostSummaryDoc): PostSummary => ({
  id: doc.id,
  slug: doc.slug ?? '',
  title: doc.title,
  excerpt: doc.excerpt?.trim() ?? '',
  cover: toMedia(doc.cover),
  category: toPostCategory(doc.category),
  authorName: doc.authorName?.trim() || null,
  publishedAt: doc.publishedAt ?? null,
})

export const mapPost = (doc: Post): PostData => ({
  ...mapPostSummary(doc),
  seo: toSeo(doc.seo),
  updatedAt: doc.updatedAt,
  blocks: mapBlocks(doc.blocks, { title: doc.title, meta: [] }),
})
