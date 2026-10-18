import Image from 'next/image'
import type { HomeHeroData } from '@/content/site'
import { focalPosition } from '@/lib/focal'
import { AutoVideo } from '../media/AutoVideo'

export function HomeHero({ siteName, hero }: { siteName: string; hero: HomeHeroData }) {
  const { video, image, heading, tagline } = hero
  const hasMedia = Boolean(video || image)

  // Tanpa hero: cukup ruang kosong di bawah header, dengan h1 tersembunyi untuk aksesibilitas.
  if (!hasMedia && !heading && !tagline) {
    return (
      <div className="h-24 md:h-32">
        <h1 className="sr-only">{siteName}</h1>
      </div>
    )
  }

  return (
    <section className="relative h-[112vh] min-h-[26rem] w-full overflow-hidden">
      {video ? (
        <AutoVideo
          src={video.src}
          mimeType={video.mimeType}
          poster={image?.src}
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          style={image ? { objectPosition: focalPosition(image) } : undefined}
        />
      ) : image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: focalPosition(image) }}
        />
      ) : null}
      {hasMedia ? <div className="absolute inset-0 bg-black/35" /> : null}

      {heading ? (
        <h1 className="absolute left-[4%] top-[26%] max-w-[18ch] text-[clamp(1.9rem,3.7vw,4rem)] font-medium leading-[1.1] md:left-[12.5%]">
          {heading}
        </h1>
      ) : (
        <h1 className="sr-only">{siteName}</h1>
      )}
      {tagline ? (
        <p className="absolute bottom-8 left-[4%] right-[4%] max-w-sm text-sm leading-relaxed md:bottom-[14%] md:left-[56%] md:right-auto">
          {tagline}
        </p>
      ) : null}
    </section>
  )
}