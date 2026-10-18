import type { HeadingBlockData } from '@/content/types'

export function HeadingView({ block }: { block: HeadingBlockData }) {
  const Tag = block.level
  const size =
    block.level === 'h2'
      ? 'text-3xl md:text-5xl leading-[1.05] tracking-tight'
      : 'text-xl md:text-2xl leading-tight'
  return <Tag className={`font-medium ${size}`}>{block.text}</Tag>
}