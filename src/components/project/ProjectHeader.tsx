import Image from 'next/image'
import type { MediaAsset } from '@/content/types'

type Props = {
  title: string
  hero: MediaAsset | null
}

export function ProjectHeader({ title }: { title: string }) {
  return (
    <h1 className="text-[clamp(2rem,3.4vw,3.75rem)] font-medium leading-[1.1] tracking-tight">
      {title}
    </h1>
  )
}