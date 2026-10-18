import type { VideoBlockData } from '@/content/types'
import { EmbedFrame } from './EmbedFrame'

export function VideoView({ block }: { block: VideoBlockData }) {
  const { source, caption } = block
  return (
    <figure>
      {source.kind === 'embed' ? (
        <EmbedFrame src={source.src} title={caption ?? `Video (${source.provider})`} aspect="16-9" />
      ) : (
        <video controls playsInline preload="metadata" className="h-auto w-full">
          <source src={source.src} type={source.mimeType} />
        </video>
      )}
      {caption ? <figcaption className="mt-3 text-sm text-mute">{caption}</figcaption> : null}
    </figure>
  )
}