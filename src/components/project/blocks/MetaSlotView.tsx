import type { MetaSlotBlockData } from '@/content/types'
import { ProjectMeta } from '../ProjectMeta'

export function MetaSlotView({ block }: { block: MetaSlotBlockData }) {
  return (
    <div className="md:max-w-[50%]">
      <ProjectMeta items={block.items} />
    </div>
  )
}