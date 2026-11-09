import Image from 'next/image'
import { AutoVideo } from '@/components/media/AutoVideo'
import type { ScrollStoryBlockData, StoryOverlay } from '@/content/types'
import { focalPosition } from '@/lib/focal'
import { RichText } from './RichText'
import { columnClass, StoryHeading } from './ScrollStoryShared'
import { StickyShowcase } from './ScrollStorySticky'

type Cinematic = Extract<ScrollStoryBlockData, { preset: 'cinematic' }>
type Split = Extract<ScrollStoryBlockData, { preset: 'split' }>

/** Gradasi gelap di atas media supaya teks putih tetap terbaca di gambar terang. */
const OVERLAY: Record<StoryOverlay, string> = {
  soft: 'from-black/60 via-black/20 to-black/10',
  medium: 'from-black/75 via-black/40 to-black/25',
  strong: 'from-black/90 via-black/60 to-black/40',
}

/** Sinematik: media layar penuh, judul besar di atasnya. */
function CinematicStory({ block }: { block: Cinematic }) {
  const { media, video, content, textPosition, overlay, eyebrow, title, animation } = block
  const objectPosition = focalPosition(media)

  return (
    <div
      data-story
      data-story-preset="cinematic"
      data-story-anim={animation}
      className={`relative isolate flex min-h-[85svh] overflow-hidden md:min-h-svh ${textPosition === 'center' ? 'items-center' : 'items-end'}`}
    >
      <div data-story-media className="absolute inset-0 -z-20">
        <div data-story-bg className="absolute inset-0">
          {video ? (
            <AutoVideo
              src={video.src}
              mimeType={video.mimeType}
              poster={media.src}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition }}
            />
          ) : (
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition }}
            />
          )}
        </div>
      </div>
      <div aria-hidden="true" className={`absolute inset-0 -z-10 bg-gradient-to-t ${OVERLAY[overlay]}`} />

      <div className="relative w-full px-5 py-16 md:mx-auto md:w-3/4 md:max-w-[96rem] md:px-0 md:py-24">
        <div className="max-w-4xl">
          <StoryHeading eyebrow={eyebrow} title={title} size="xl" />
          {content.length > 0 ? (
            <div data-story-item className="mt-6 max-w-2xl md:mt-8">
              <RichText blocks={content} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/** Terbagi: media dan teks berdampingan di desktop; media di atas teks di layar kecil. */
function SplitStory({ block }: { block: Split }) {
  const { media, content, mediaSide, eyebrow, title, animation } = block
  const mediaRight = mediaSide === 'right'

  return (
    <div data-story data-story-preset="split" data-story-anim={animation} className={columnClass(block)}>
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
        <div data-story-media className={`order-1 overflow-hidden ${mediaRight ? 'md:order-2' : 'md:order-1'}`}>
          <div data-story-bg>
            <Image
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
        <div className={`order-2 ${mediaRight ? 'md:order-1' : 'md:order-2'}`}>
          <StoryHeading eyebrow={eyebrow} title={title} />
          {content.length > 0 ? (
            <div data-story-item className="mt-6 md:mt-8">
              <RichText blocks={content} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/** Cerita Scroll: satu block, tiga tampilan. Animasinya dijalankan src/components/motion/storyMotion.ts. */
export function ScrollStoryView({ block }: { block: ScrollStoryBlockData }) {
  switch (block.preset) {
    case 'cinematic':
      return <CinematicStory block={block} />
    case 'split':
      return <SplitStory block={block} />
    case 'sticky':
      return <StickyShowcase block={block} />
  }
}
