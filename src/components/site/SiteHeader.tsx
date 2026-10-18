import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettings } from '@/content/site'
import { SiteNav } from './SiteNav'

export function SiteHeader({ siteName, logo, navigation }: Pick<SiteSettings, 'siteName' | 'logo' | 'navigation'>) {
  return (
    <header className={`absolute inset-x-0 top-0 z-20 flex justify-between gap-6 px-[4%] pt-5 md:pt-8 ${
        logo ? 'items-center' : 'items-baseline'
      }`}
      >
        <Link href="/" className="text-lg font-medium md:text-2xl">
          {logo ? (
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              priority
              className="h-8 w-auto md:h-10"
            />
          ) : (
            siteName
          )}
        </Link>
        <SiteNav items={navigation}  />
      </header>
  )
}