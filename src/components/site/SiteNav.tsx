'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SiteSettings } from '@/content/site'


const isActive = (href: string, pathname: string): boolean => {
  if (href === '/') return pathname === '/' || pathname.startsWith('/work')
  if (!href.startsWith('/')) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNav({ items }: { items: SiteSettings['navigation'] }) {
  const pathname = usePathname()
  if (items.length === 0) return null

  return (
    <nav aria-label="Utama">
      <ul className="flex gap-5 text-xs md:gap-7 md:text-sm">
        {items.map((item, i) => {
          const active = isActive(item.href, pathname)
          const className = active ? 'underline underline-offset-[6px]' : undefined
          return (
            <li key={`${item.href}-${i}`}>
              {item.href.startsWith('/') ? (
                <Link href={item.href} className={className} aria-current={active ? 'page' : undefined}>
                  {item.label}
                </Link>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}