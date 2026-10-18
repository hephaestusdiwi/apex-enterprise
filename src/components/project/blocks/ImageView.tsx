import Image from 'next/image'
import { LightboxLink } from '@/components/media/LightboxLink'
import type { ImageBlockData } from '@/content/types'

export function ImageView({ block }: { block: ImageBlockData }) {
  const { media, caption } = block
  return (
    <figure>
      <LightboxLink media={media}>
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="h-auto w-full"
        />
      </LightboxLink>
      {caption ? <figcaption className="mt-3 text-sm text-mute">{caption}</figcaption> : null}
    </figure>
  )
}
