import type { ProjectMetaItem } from '@/content/types'


export function ProjectMeta({ items }: { items: ProjectMetaItem[] }) {
  if (items.length === 0) return null
  return (
    <dl className="space-y-4 text-sm font-medium text-accent md:text-base">
      {items.map((item, i) => (
        <div key={`${item.label}-${i}`} className="flex flex-wrap gap-x-2">
          <dt>{item.label}:</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}