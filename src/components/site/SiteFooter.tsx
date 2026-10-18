import Link from 'next/link'
import type { SiteSettings } from '@/content/site'

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function SiteFooter({ navigation, instagramUrl }: Pick<SiteSettings, 'navigation' | 'instagramUrl'>) {
  const links = navigation.filter((item) => item.href !== '/')
  if (links.length === 0 && !instagramUrl) return null

  return (
    <footer className="mt-28 pb-12 md:mt-40 md:pb-16">
      <div className="flex items-center justify-between px-[4%] text-xs md:px-[19%]">
        <ul className="flex gap-4 underline underline-offset-4">
          {links.map((item, i) => (
            <li key={`${item.href}-${i}`}>
              {item.href.startsWith('/') ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </li>
          ))}
        </ul>
        {instagramUrl ? (
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
        ) : null}
      </div>
    </footer>
  )
}