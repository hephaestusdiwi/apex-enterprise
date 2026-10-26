import type { ComponentType } from 'react'
import type { BlockData, BlockType, ResolvedLayout } from '@/content/types'
import { EmbedView } from './EmbedView'
import { GalleryView } from './GalleryView'
import { HeadingView } from './HeadingView'
import { ImageTextView } from './ImageTextView'
import { ImageView } from './ImageView'
import { LinkView } from './LinkView'
import { ListView } from './ListView'
import { MetaSlotView } from './MetaSlotView'
import { QuoteView } from './QuoteView'
import { SpacerView } from './SpacerView'
import { TeamView } from './TeamView'
import { TextView } from './TextView'
import { TitleSlotView } from './TitleSlotView'
import { VideoView } from './VideoView'

export type BlockOf<T extends BlockType> = Extract<BlockData, { type: T }>

export type BlockEntry<T extends BlockType> = {
  Component: ComponentType<{ block: BlockOf<T> }>
  /** Layout bawaan tipe ini; override dari admin menimpa per properti. */
  defaults: ResolvedLayout
}

const layout = (
  width: ResolvedLayout['width'],
  spaceBefore: ResolvedLayout['spaceBefore'],
  motion: ResolvedLayout['motion'] = 'none',
): ResolvedLayout => ({ width, spaceBefore, spaceAfter: 'none', motion })

/** Kunci wajib lengkap: tipe block baru di BlockData tanpa entri di sini = error compile. */
export const blockRegistry: { [T in BlockType]: BlockEntry<T> } = {
  heading: { Component: HeadingView, defaults: layout('content', 'lg') },
  text: { Component: TextView, defaults: layout('content', 'sm') },
  image: { Component: ImageView, defaults: layout('wide', 'md', 'reveal') },
  imageText: { Component: ImageTextView, defaults: layout('wide', 'md', 'reveal') },
  gallery: { Component: GalleryView, defaults: layout('wide', 'md', 'reveal') },
  video: { Component: VideoView, defaults: layout('wide', 'md') },
  link: { Component: LinkView, defaults: layout('content', 'md') },
  quote: { Component: QuoteView, defaults: layout('content', 'lg') },
  embed: { Component: EmbedView, defaults: layout('wide', 'md') },
  list: { Component: ListView, defaults: layout('content', 'sm') },
  spacer: { Component: SpacerView, defaults: layout('content', 'none') },
  team: { Component: TeamView, defaults: layout('wide', 'lg', 'reveal') },
  titleSlot: { Component: TitleSlotView, defaults: layout('wide', 'md') },
  metaSlot: { Component: MetaSlotView, defaults: layout('wide', 'sm') },
}