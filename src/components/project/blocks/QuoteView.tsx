import type { QuoteBlockData } from '@/content/types'

export function QuoteView({ block }: { block: QuoteBlockData }) {
  return (
    <figure>
      <blockquote className="text-2xl leading-tight tracking-tight md:text-5xl">
        <p>{block.text}</p>
      </blockquote>
      {block.attribution ? (
        <figcaption className="mt-5 text-xs uppercase tracking-widest text-mute">
          {block.attribution}
        </figcaption>
      ) : null}
    </figure>
  )
}