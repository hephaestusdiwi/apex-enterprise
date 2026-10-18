import Image from 'next/image'
import type { MediaAsset } from '@/content/types'
import { focalPosition } from '@/lib/focal'
import { ProjectHeader } from './ProjectHeader'

type Props = {
  hero: MediaAsset | null
  /** Judul yang ditumpuk di atas hero (kiri bawah, sejajar kolom konten). null = tidak ada. */
  title: string | null
}

export function ProjectHero({ hero, title }: Props) {
  if (!hero) return null

  return (
    <div className="relative h-[58vh] min-h-[22rem] w-full overflow-hidden">
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: focalPosition(hero) }}
      />
      {title ? <div className="absolute inset-0 bg-black/15" /> : null}
      {title ? (
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full px-5 pb-[7%] md:w-3/4 md:max-w-[96rem] md:px-0 md:pb-[5%]">
          <ProjectHeader title={title} />
        </div>
      ) : null}
    </div>
  )
}