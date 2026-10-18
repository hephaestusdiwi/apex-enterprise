import Image from 'next/image'
import Link from 'next/link'
import type { HomeSize, ProjectSummary } from '@/content/types'
import { cropPosition } from '@/lib/focal'
import { AutoVideo } from '../media/AutoVideo'

/** Grid 6 kolom: lebar tile dari data project. */
const SPAN: Record<HomeSize, string> = {
  small: 'md-col-span-2',
  medium: 'md:col-span-3',
  large: 'md:col-span-4',
  full: 'md:col-span-6',
}

const SIZES: Record<HomeSize, string> = {
  small: '(min-width: 768px) 31vw, 100vw',
  medium: '(min-width: 768px) 46vw, 100vw',
  large: '(min-width: 768px) 61vw, 100vw',
  full: '92vw',
}

export function HomeGrid({ projects }: { projects: ProjectSummary[] }) {
  if (projects.length === 0) {
    return <p className="px-[4%] pt-10 text-mute">Belum ada project yang dipublikasikan.</p>
  }

  return (
    <ul className="grid grid-cols-1 px-[4%] pt-[3.3vw] md:auto-rows-[30.67vw] md:grid-cols-6">
      {projects.map((project, i) => (
        <li
          key={project.id}
          className={`group relative aspect-[3/2] overflow-hidden md:aspect-auto ${SPAN[project.size]}`}
        >
          <Link
            href={`/work/${project.slug}`}
            className="block h-full w-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
          >
            {project.image || project.video ? (
              <>
                {project.video ? (
                  <AutoVideo
                    src={project.video.src}
                    mimeType={project.video.mimeType}
                    poster={project.image?.src}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={project.image ? { objectPosition: cropPosition(project.image, project.align) } : undefined}
                  />
                ) : project.image ? (
                  <Image
                    src={project.image.src}
                    alt=""
                    fill
                    priority={i < 2}
                    sizes={SIZES[project.size]}
                    className="object-cover"
                    style={{ objectPosition: cropPosition(project.image, project.align) }}
                  />
                ) : null}
                <span className="absolute inset-0 flex items-end bg-black/40 p-4 text-sm font-medium transition-opacity duration-300 motion-reduce:transition-none md:p-6 md:text-base can-hover:opacity-0 can-hover:group-focus-within:opacity-100 can-hover:group-hover:opacity-100">
                  {project.title}
                </span>
              </>
            ) : (
              // Tanpa gambar: judul selalu terlihat, karena tidak ada visual yang bisa menggantikannya.
              <span className="absolute inset-0 flex items-end bg-white/5 p-4 text-2xl font-medium leading-tight tracking-tight md:p-6 md:text-4xl">
                {project.title}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}