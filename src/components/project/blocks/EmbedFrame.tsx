import type { EmbedAspect } from '@/content/types'

const ASPECT: Record<EmbedAspect, string> = {
  '16-9': 'aspect-video',
  '4-3': 'aspect-[4/3]',
  '1-1': 'aspect-square',
  '21-9': 'aspect-[21/9]',
}

type Props = {
  src: string
  title: string
  aspect: EmbedAspect
}

export function EmbedFrame({ src, title, aspect }: Props) {
  return (
    <div className={`relative w-full ${ASPECT[aspect]}`}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="fullscreen; picture-in-picture; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  )
}