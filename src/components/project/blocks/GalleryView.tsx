import type { CSSProperties } from 'react'
import Image from 'next/image'
import { LightboxLink } from '@/components/media/LightboxLink'
import type { GalleryBlockData, GalleryVariant, MediaAsset } from '@/content/types'
import { focalPosition } from '@/lib/focal'
import { packMosaic } from '@/lib/mosaic'

type ClassicVariant = Exclude<GalleryVariant, 'mosaic'>

const CONTAINER: Record<ClassicVariant, string> = {
  'grid-2': 'grid grid-cols-1 gap-1.5 md:grid-cols-2',
  'grid-3': 'grid grid-cols-1 gap-1.5 md:grid-cols-3',
  staggered: 'grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6',
  strip: 'flex snap-x gap-4 overflow-x-auto md:gap-6',
}

const SIZES: Record<ClassicVariant, string> = {
  'grid-2': '(min-width: 768px) 37vw, 100vw',
  'grid-3': '(min-width: 768px) 25vw, 100vw',
  staggered: '(min-width: 768px) 37vw, 100vw',
  strip: '80vw',
}

const MOSAIC_SIZES: Record<number, string> = {
  1: '(min-width: 768px) 75vw, 100vw',
  2: '(min-width: 768px) 40vw, 100vw',
  3: '(min-width: 768px) 28vw, 100vw',
}

function MosaicGallery({ images }: { images: MediaAsset[] }) {
  const { rowRatio, columns } = packMosaic(images.map((image) => image.width / image.height))
  const sizes = MOSAIC_SIZES[columns.length] ?? MOSAIC_SIZES[3]

  return (
    <div
      style={{ '--row-ar': rowRatio } as CSSProperties}
      className="flex flex-col gap-1.5 md:aspect-(--row-ar) md:flex-row"
    >
      {columns.map((column, c) => (
        <div
          key={c}
          style={{ '--g': column.grow } as CSSProperties}
          className="contents md:flex md:min-w-0 md:flex-(--g) md:flex-col md:gap-1.5"
        >
          {column.items.map(({ index, ratio, grow }) => {
            const image = images[index]
            return (
              <div
                key={`${image.src}-${index}`}
                style={{ '--ar': ratio, '--g': grow, order: index } as CSSProperties}
                className="relative aspect-(--ar) overflow-hidden md:aspect-auto md:min-h-0 md:flex-(--g)"
              >
                <LightboxLink media={image} cropped>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={sizes}
                    className="object-cover"
                    style={{ objectPosition: focalPosition(image) }}
                  />
                </LightboxLink>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function GalleryView({ block }: { block: GalleryBlockData }) {
  const { variant, images } = block

  if (variant === 'mosaic') return <MosaicGallery images={images} />

  if (variant === 'grid-2' || variant === 'grid-3') {
    return (
      <div className={CONTAINER[variant]}>
        {images.map((image, i) => (
          <div key={`${image.src}-${i}`} className="relative aspect-[10/7] overflow-hidden">
            <LightboxLink media={image} cropped>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={SIZES[variant]}
                className="object-cover"
                style={{ objectPosition: focalPosition(image) }}
              />
            </LightboxLink>
          </div>
        ))}
      </div>
    )
  }

  const isStrip = variant === 'strip'
  return (
    <div className={CONTAINER[variant]}>
      {images.map((image, i) => (
        <div
          key={`${image.src}-${i}`}
          className={[
            isStrip ? 'shrink-0 snap-start' : '',
            variant === 'staggered' && i % 2 === 1 ? 'md:mt-24' : '',
          ].join(' ')}
        >
          <LightboxLink media={image}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={SIZES[variant]}
              className={isStrip ? 'h-[60vh] w-auto max-w-none' : 'h-auto w-full'}
            />
          </LightboxLink>
        </div>
      ))}
    </div>
  )
}
