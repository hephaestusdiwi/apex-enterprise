import type { EmbedBlockData } from '@/content/types'
import { EmbedFrame } from './EmbedFrame'

export function EmbedView({ block }: { block: EmbedBlockData }) {
    return <EmbedFrame src={block.src} title={block.title} aspect={block.aspect} />
}