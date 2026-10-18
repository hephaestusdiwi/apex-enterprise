import Image from 'next/image'
import Link from 'next/link'
import type { HomeAlign, HomeSize, ProjectSummary } from '@/content/types'

const WIDTH: Record<HomeSize, string> = {
  small: 'md:w-[28%]',
  medium: 'md:w-[45%]',
  large: 'md:w-[70%]',
  full: 'md:w-full',
}

const SIZES: Record<HomeSize, string> = {
  small: '(min-width: 768px) 28vw, 100vw',
  medium: '(min-width: 768px) 45vw, 100vw',
  large: '(min-width: 768px) 70vw, 100vw',
  full: '100vw',
}

const ALIGN: Record<HomeAlign, string> = {
  left: 'md:mr-auto',
  center: 'md:mx-auto',
  right: 'md:ml-auto',
}

export function HomeIndex({ projects }: { projects: ProjectSummary[] }) {
  if (projects.length === 0) {
    return (
      <p className="mx-auto w-full max-w-7xl px-5 text-mute md:px-10">
        Belum ada project yang dipublikasikan.
      </p>
    )
  }

  return (
    <ul className="mx-auto w-full max-w-7xl px-5 pb-40 md:px-10">
      {projects.map((project, i) => (
        <li
          key={project.id}
          className={`w-full ${WIDTH[project.size]} ${ALIGN[project.align]} ${
            i === 0 ? '' : 'mt-20 md:mt-36'
          }`}
        >
          <Link href={`/work/${project.slug}`} className="block">
            {project.image ? (
              <>
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  width={project.image.width}
                  height={project.image.height}
                  sizes={SIZES[project.size]}
                  priority={i === 0}
                  className="h-auto w-full"
                />
                <span className="mt-3 block text-sm uppercase tracking-widest">{project.title}</span>
              </>
            ) : (
              <span className="block text-4xl font-medium leading-none tracking-tight md:text-7xl">
                {project.title}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}