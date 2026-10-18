import type { SpacerBlockData } from '@/content/types'

const SIZE: Record<SpacerBlockData['size'], string> = {
  sm: 'h-8',
  md: 'h-16',
  lg: 'h-28',
  xl: 'h-44',
}

export function SpacerView({ block }: { block: SpacerBlockData }) {
  return <div aria-hidden="true" className={SIZE[block.size]} />
}