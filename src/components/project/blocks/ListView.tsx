import type { ListBlockData } from '@/content/types'

export function ListView({ block }: { block: ListBlockData }) {
  const Tag = block.ordered ? 'ol' : 'ul'
  return (
    <Tag
      className={`space-y-2 pl-6 text-lg leading-relaxed md:text-xl ${
        block.ordered ? 'list-decimal' : 'list-disc'
      }`}
    >
      {block.items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  )
}