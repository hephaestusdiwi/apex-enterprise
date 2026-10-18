import type { TextBlockData } from '@/content/types'
import { RichText } from './RichText'

export function TextView({ block }: { block: TextBlockData }) {
  return <RichText blocks={block.content} />
}