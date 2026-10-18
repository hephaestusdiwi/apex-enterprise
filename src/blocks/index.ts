import type { Block } from 'payload'
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
]