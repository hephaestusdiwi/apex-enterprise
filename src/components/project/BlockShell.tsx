import type { ReactNode } from 'react'
import type { BlockType, ResolvedLayout, Space, Width } from '@/content/types'

/** Kolom konten: 75% lebar layar di desktop, rata kiri dengan judul hero. `full` = tanpa batas. */
const CONTAINER: Record<Width, string> = {
  narrow: 'px-5 md:w-3/4 md:max-w-[96rem] md:px-0',
  content: 'px-5 md:w-3/4 md:max-w-[96rem] md:px-0',
  wide: 'px-5 md:w-3/4 md:max-w-[96rem] md:px-0',
  full: 'px-0',
}

/** Batas lebar isi di dalam kolom (block teks tetap enak dibaca). */
const INNER: Record<Width, string> = {
  narrow: 'max-w-xl',
  content: 'max-w-3xl',
  wide: '',
  full: '',
}

const BEFORE: Record<Space, string> = {
  none: 'mt-0',
  sm: 'mt-8',
  md: 'mt-16',
  lg: 'mt-28',
  xl: 'mt-44',
}

const AFTER: Record<Space, string> = {
  none: 'mb-0',
  sm: 'mb-8',
  md: 'mb-16',
  lg: 'mb-28',
  xl: 'mb-44',
}

type Props = {
  type: BlockType
  layout: ResolvedLayout
  children: ReactNode
}

export function BlockShell({ type, layout, children }: Props) {
  return (
    <section
      data-block={type}
      data-motion={layout.motion}
      className={`${BEFORE[layout.spaceBefore]} ${AFTER[layout.spaceAfter]}`}
    >
      <div className={`mx-auto w-full ${CONTAINER[layout.width]}`}>
        <div className={INNER[layout.width]}>{children}</div>
      </div>
    </section>
  )
}