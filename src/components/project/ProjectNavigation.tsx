import Link from 'next/link'
import type { ProjectNeighbors } from '@/content/types'

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={flip ? 'rotate-180' : undefined}
    >
      <path d="M9 4l8 8-8 8" />
    </svg>
  )
}

export function ProjectNavigation({ neighbors }: { neighbors: ProjectNeighbors }) {
  const { previous, next } = neighbors
  return (
    <nav
      aria-label="Project"
      className="mt-28 flex items-center justify-between gap-6 px-[4%] text-base font-medium md:mt-40 md:text-xl"
    >
      <Link href={`/work/${previous.slug}`} rel="prev" className="flex items-center gap-3">
        <Chevron flip />
        <span>
          <span className="sr-only">Project sebelumnya: </span>
          {previous.title}
        </span>
      </Link>
      <Link href={`/work/${next.slug}`} rel="next" className="flex items-center gap-3 text-right">
        <span>
          <span className="sr-only">Project berikutnya: </span>
          {next.title}
        </span>
        <Chevron />
      </Link>
    </nav>
  )
}