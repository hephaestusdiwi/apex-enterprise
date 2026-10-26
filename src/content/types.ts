import type { TextColor, TextSize } from '@/lib/richStyles'
import type { SocialPlatform } from '@/lib/socials'

export const WIDTHS = ['narrow', 'content', 'wide', 'full'] as const
export const SPACES = ['none', 'sm', 'md', 'lg', 'xl'] as const
export const MOTIONS = ['none', 'reveal', 'parallax'] as const
export const GALLERY_VARIANTS = ['grid-2', 'grid-3', 'staggered', 'strip', 'mosaic'] as const
export const EMBED_ASPECTS = ['16-9', '4-3', '1-1', '21-9'] as const

export type Width = (typeof WIDTHS)[number]
export type Space = (typeof SPACES)[number]
export type Motion = (typeof MOTIONS)[number]
export type GalleryVariant = (typeof GALLERY_VARIANTS)[number]
export type EmbedAspect = (typeof EMBED_ASPECTS)[number]

/** Override dari admin. Properti kosong = pakai default milik tipe block. */
export type BlockLayout = {
  width?: Width
  spaceBefore?: Space
  spaceAfter?: Space
  motion?: Motion
}
export type ResolvedLayout = Required<BlockLayout>

export type MediaAsset = {
  src: string
  alt: string
  width: number
  height: number
  focalX?: number
  focalY?: number
  og?: { src: string; width: number; height: number }
}

export type RichInline =
  | {
    type: 'text'
    text: string
    bold: boolean
    italic: boolean
    underline: boolean
    strike: boolean
    color?: TextColor
    size?: TextSize
  }
  | { type: 'break'  }
  | { type: 'link'; href: string; newTab: boolean; children: RichInline[] }

export type RichAlign = 'left' | 'center' | 'right' | 'justify'

export type RichListItem = { children: RichInline[]; nested: RichList[] }
export type RichList = { type: 'list'; ordered: boolean; items: RichListItem[] }

export type RichBlock =
  | { type: 'paragraph'; align?: RichAlign; children: RichInline[] }
  | { type: 'heading'; level: 2 | 3 | 4; align?: RichAlign; children: RichInline[] }
  | { type: 'quote'; align?: RichAlign; children: RichInline[] }
  | RichList

export type VideoAsset = { src: string; mimeType: string }

export type VideoSource =
  | { kind: 'embed'; provider: 'vimeo' | 'youtube'; src: string }
  | { kind: 'file'; src: string; mimeType: string }

export type ProjectMetaItem = { label: string; value: string }

type BlockBase = { id: string; layout: BlockLayout }

export type HeadingBlockData = BlockBase & {
  type: 'heading'
  text: string
  level: 'h2' | 'h3'
}
export type TextBlockData = BlockBase & {
  type: 'text'
  content: RichBlock[]
}
export type ImageBlockData = BlockBase & {
  type: 'image'
  media: MediaAsset
  caption?: string
}
export type ImageTextBlockData = BlockBase & {
  type: 'imageText'
  media: MediaAsset
  content: RichBlock[]
  imageSide: 'left' | 'right'
  includeMeta: boolean
  meta: ProjectMetaItem[]
}
export type GalleryBlockData = BlockBase & {
  type: 'gallery'
  variant: GalleryVariant
  images: MediaAsset[]
}
export type VideoBlockData = BlockBase & {
  type: 'video'
  source: VideoSource
  caption?: string
}
export type LinkBlockData = BlockBase & {
  type: 'link'
  label: string
  href: string
  newTab: boolean
}
export type QuoteBlockData = BlockBase & {
  type: 'quote'
  text: string
  attribution?: string
}
export type EmbedBlockData = BlockBase & {
  type: 'embed'
  src: string
  title: string
  aspect: EmbedAspect
}
export type ListBlockData = BlockBase & {
  type: 'list'
  ordered: boolean
  items: string[]
}
export type SpacerBlockData = BlockBase & {
  type: 'spacer'
  size: Exclude<Space, 'none'>
}
export type TeamSocialLink = { platform: SocialPlatform; label: string; href: string }
export type TeamMemberData = {
  id: string
  photo: MediaAsset
  name: string
  role: string
  bio: string
  socials: TeamSocialLink[]
}
export type TeamBlockData = BlockBase & {
  type: 'team'
  title?: string
  subtitle?: string
  members: TeamMemberData[]
}
export type TitleSlotBlockData = BlockBase & {
  type: 'titleSlot'
  title: string
}
export type MetaSlotBlockData = BlockBase & {
  type: 'metaSlot'
  items: ProjectMetaItem[]
}

export type BlockData =
  | HeadingBlockData
  | TextBlockData
  | ImageBlockData
  | ImageTextBlockData
  | GalleryBlockData
  | VideoBlockData
  | LinkBlockData
  | QuoteBlockData
  | EmbedBlockData
  | ListBlockData
  | SpacerBlockData
  | TeamBlockData
  | TitleSlotBlockData
  | MetaSlotBlockData
export type BlockType = BlockData['type']

export type ProjectData = {
  id: number
  slug: string
  title: string
  hero: MediaAsset | null
  meta: ProjectMetaItem[]
  blocks: BlockData[]
  seo: SeoData
}

export const HOME_SIZES = ['small', 'medium', 'large', 'full'] as const
export const HOME_ALIGNS = ['left', 'center', 'right'] as const

export type HomeSize = (typeof HOME_SIZES)[number]
export type HomeAlign = (typeof HOME_ALIGNS)[number]

export type SeoData = {
  title?: string
  description?: string
  image: MediaAsset | null
  noIndex: boolean
}

export type ProjectSummary = {
  id: number
  slug: string
  title: string
  image: MediaAsset | null
  video: VideoAsset | null
  size: HomeSize
  align: HomeAlign
}

export type ProjectLink = { slug: string; title: string }
export type ProjectNeighbors = { previous: ProjectLink; next: ProjectLink }

export type PageData = {
  id: number
  slug: string
  title: string
  blocks: BlockData[]
  seo: SeoData
}

export type PostCategoryData = {
  id: number
  slug: string
  title: string
  description?: string
}

export type PostSummary = {
  id: number
  slug: string
  title: string
  excerpt: string
  cover: MediaAsset | null
  category: PostCategoryData | null
  authorName: string | null
  /** ISO 8601; null bila belum pernah dipublikasikan (hanya mungkin di preview). */
  publishedAt: string | null
}

export type PostData = PostSummary & {
  blocks: BlockData[]
  seo: SeoData
  updatedAt: string
}

export type PostListPage = {
  posts: PostSummary[]
  page: number
  totalPages: number
  totalDocs: number
}

export type PostCategoryWithCount = PostCategoryData & { count: number }
