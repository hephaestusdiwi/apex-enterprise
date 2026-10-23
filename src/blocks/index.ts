import type { Block } from 'payload'
import { withBlockUi } from './blockUi'
import { EmbedBlock } from './Embed'
import { GalleryBlock } from './Gallery'
import { HeadingBlock } from './Heading'
import { ImageBlock } from './Image'
import { ImageTextBlock } from './ImageText'
import { LinkBlock } from './Link'
import { ListBlock } from './List'
import { QuoteBlock } from './Quote'
import { MetaSlotBlock, TitleSlotBlock } from './Slots'
import { SpacerBlock } from './Spacer'
import { TextBlock } from './Text'
import { VideoBlock } from './Video'

export const projectBlocks: Block[] = [
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ImageTextBlock,
  GalleryBlock,
  VideoBlock,
  LinkBlock,
  QuoteBlock,
  EmbedBlock,
  ListBlock,
  SpacerBlock,
  TitleSlotBlock,
  MetaSlotBlock,
].map(withBlockUi)

/** Block untuk artikel blog: sama dengan project, tanpa penanda title/meta (judul dirender header artikel). */
const SLOT_BLOCKS: ReadonlySet<string> = new Set([TitleSlotBlock.slug, MetaSlotBlock.slug])
export const postBlocks: Block[] = projectBlocks.filter((block) => !SLOT_BLOCKS.has(block.slug))
