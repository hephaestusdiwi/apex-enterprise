import type { ReactNode } from 'react'
import { getSiteSettings } from '@/content/site'
import type { MediaAsset } from '@/content/types'
import { a } from 'node_modules/vitest/dist/chunks/suite.d.BJWk38HB'

const MAX_WIDTH = 1920

type Props = { media: MediaAsset; cropped?: boolean; children: ReactNode }

export async function LightboxLink({ media, cropped = false, children }: Props) {
    const { photoSwipe } = await getSiteSettings()
    if (!photoSwipe) return <>{children}</>

    const scale = Math.min(1,  MAX_WIDTH / media.width)
    return (
        <a 
            href={`/_next/image?url=${encodeURIComponent(media.src)}&w=${MAX_WIDTH}&q=75`}
            data-pswp-width={Math.round(media.width * scale)}
            data-pswp-height={Math.round(media.height * scale)}
            data-cropped={cropped ? 'true' : undefined}
            className="block cursor-zoom-in"
        >
            {children}
        </a>
    )
}