import type { LinkBlockData } from '@/content/types'

export function LinkView({ block }: { block: LinkBlockData }) {
  const external = /^https?:/i.test(block.href)
  return (
    <a
      href={block.href}
      className="inline-flex items-baseline gap-2 text-2xl md:text-4xl"
      {...(block.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="underline underline-offset-8">{block.label}</span>
      {external ? <span aria-hidden="true">↗</span> : null}
    </a>
  )
}