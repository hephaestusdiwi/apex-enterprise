import Image from 'next/image'
import type { ScrollStoryBlockData } from '@/content/types'
import { focalPosition } from '@/lib/focal'
import { RichText } from './RichText'
import { columnClass, StoryHeading } from './ScrollStoryShared'

type Sticky = Extract<ScrollStoryBlockData, { preset: 'sticky' }>

/** Ukuran gambar sama untuk gambar di panel dan di panggung, supaya browser hanya mengunduh satu berkas. */
const SIZES = '(min-width: 768px) 45vw, 100vw'

/**
 * Showcase menempel. Tanpa JavaScript, dengan "kurangi gerakan", dan di layar kecil, tampilannya adalah
 * daftar biasa: tiap panel memuat gambarnya sendiri di atas teks. Saat animasi aktif di layar md ke atas,
 * storyMotion.ts memasang atribut data-story-enhanced pada root, lalu varian `group-data-[story-enhanced=true]`
 * di bawah ini menampilkan panggung menempel dan menyembunyikan gambar di dalam panel (tetap dibaca pembaca layar).
 */
export function StickyShowcase({ block }: { block: Sticky }) {
  const { panels, side, eyebrow, title, animation } = block
  const visualRight = side === 'right'
  const total = String(panels.length).padStart(2, '0')

  return (
    <div
      data-story
      data-story-preset="sticky"
      data-story-anim={animation}
      className={`group/story ${columnClass(block)}`}
    >
      <header className="mb-12 max-w-4xl md:mb-20">
        <StoryHeading eyebrow={eyebrow} title={title} />
      </header>

      <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
        {/* Panggung visual: tersembunyi sampai versi animasi aktif. Dekoratif; gambar yang sama ada di tiap panel. */}
        <div
          aria-hidden="true"
          data-story-stage
          className={`hidden group-data-[story-enhanced=true]/story:block ${visualRight ? 'md:order-2' : 'md:order-1'}`}
        >
          <div className="sticky top-0 flex h-svh items-center">
            <div className="relative h-[72svh] w-full overflow-hidden">
              {panels.map((panel, i) => (
                <figure
                  key={panel.id}
                  data-story-stage-item
                  className={`absolute inset-0 ${i === 0 ? '' : 'opacity-0'}`}
                >
                  <Image
                    src={panel.media.src}
                    alt=""
                    fill
                    sizes={SIZES}
                    className="object-cover"
                    style={{ objectPosition: focalPosition(panel.media) }}
                  />
                </figure>
              ))}
            </div>
          </div>
        </div>

        <ol className={`list-none space-y-20 md:space-y-0 ${visualRight ? 'md:order-1' : 'md:order-2'}`}>
          {panels.map((panel, i) => (
            <li
              key={panel.id}
              data-story-panel
              className="group-data-[story-enhanced=true]/story:flex group-data-[story-enhanced=true]/story:min-h-svh group-data-[story-enhanced=true]/story:items-center"
            >
              <div data-story-panel-body className="max-w-xl">
                <figure className="mb-6 group-data-[story-enhanced=true]/story:sr-only md:mb-8">
                  <Image
                    src={panel.media.src}
                    alt={panel.media.alt}
                    width={panel.media.width}
                    height={panel.media.height}
                    sizes={SIZES}
                    className="h-auto w-full"
                  />
                </figure>
                <p aria-hidden="true" className="mb-3 text-sm tabular-nums text-mute">
                  {String(i + 1).padStart(2, '0')} / {total}
                </p>
                <h3 className="text-balance text-2xl font-light leading-tight tracking-tight md:text-4xl">
                  {panel.title}
                </h3>
                {panel.content.length > 0 ? (
                  <div className="mt-4 md:mt-6">
                    <RichText blocks={panel.content} />
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
