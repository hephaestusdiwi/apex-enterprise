import type { TitleSlotBlockData } from '@/content/types'
import { ProjectHeader } from '../ProjectHeader'

export function TitleSlotView({ block }: { block: TitleSlotBlockData }) {
  return <ProjectHeader title={block.title} />
}