import type { ScrollStoryBlockData } from '@/content/types'

/**
 * Kolom konten situs (sama dengan BlockShell: 75% lebar di desktop). Dipasang sendiri oleh preset Terbagi dan
 * Showcase karena block ini default-nya full-bleed. Kalau editor menimpa lebar di Layout, BlockShell yang
 * memasang kolom dan block ini tidak menambah kolom kedua.
 */
export const columnClass = (block: ScrollStoryBlockData): string =>
  block.layout.width === undefined ? 'mx-auto w-full px-5 md:w-3/4 md:max-w-[96rem] md:px-0' : ''

type HeadingProps = {
  eyebrow?: string
  title: string
  /** `xl` untuk judul sinematik, `lg` untuk Terbagi dan Showcase. */
  size?: 'xl' | 'lg'
}

const TITLE_SIZE = {
  xl: 'text-5xl md:text-7xl lg:text-8xl',
  lg: 'text-4xl md:text-5xl lg:text-6xl',
} as const

/** Label kecil + judul. Tiap bagian bertanda data-story-item supaya bisa dianimasikan bergantian. */
export function StoryHeading({ eyebrow, title, size = 'lg' }: HeadingProps) {
  return (
    <>
      {eyebrow ? (
        <p data-story-item className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-accent md:mb-5 md:text-sm">
          {eyebrow}
        </p>
      ) : null}
      <h2 data-story-item className={`text-balance font-light leading-[1.04] tracking-tight ${TITLE_SIZE[size]}`}>
        {title}
      </h2>
    </>
  )
}
