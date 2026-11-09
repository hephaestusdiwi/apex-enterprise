'use client'

import { Link, NavGroup } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/** Ikon garis 24x24 (dekoratif). Dipetakan lewat nama karena fungsi tidak bisa dikirim dari server ke client. */
const ICONS = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 3 3 5-6" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
    </>
  ),
  article: <path d="M4 5h16M4 10h16M4 15h10M4 20h7" />,
  tag: (
    <>
      <path d="M3 12V4h8l10 10-8 8L3 12Z" />
      <circle cx="7.5" cy="8.5" r="1" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m21 16-5-5-8 8" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="13" height="14" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  bookingCheck: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18M9 16l2 2 4-4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  package: (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m5.6 5.6 12.8 12.8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  sliders: (
    <>
      <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  workflow: (
    <>
      <path d="m9 11 3 3 8-8" />
      <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="3" />,
} satisfies Record<string, ReactNode>

export type NavIcon = keyof typeof ICONS

export type NavItem = {
  href: string
  label: string
  icon: NavIcon
  /** true = aktif hanya bila path persis sama (Dashboard). Selain itu aktif untuk path turunannya juga. */
  exact?: boolean
  /** Jumlah yang perlu perhatian (pesan baru, booking pending). 0 tidak ditampilkan. */
  count?: number
  countTone?: 'alert' | 'neutral'
  /** Label kecil seperti "Baru". */
  tag?: string
}

export type NavSection = {
  /** Tanpa label = bagian atas yang tidak bisa dilipat. */
  label?: string
  /** Status buka/tutup tersimpan dari preferensi pengguna; kosong = terbuka. */
  isOpen?: boolean
  items: NavItem[]
}

function NavIconSvg({ name }: { name: NavIcon }) {
  return (
    <svg
      className="apex-nav__icon"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  )
}

function NavList({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <ul className="apex-nav__list">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              prefetch={false}
              className="apex-nav__link"
              aria-current={active ? 'page' : undefined}
            >
              <NavIconSvg name={item.icon} />
              <span className="apex-nav__label">{item.label}</span>
              {item.tag ? <span className="apex-nav__tag">{item.tag}</span> : null}
              {item.count && item.count > 0 ? (
                <span
                  className={`apex-nav__count apex-nav__count--${item.countTone ?? 'neutral'}`}
                  aria-label={`${item.count} perlu perhatian`}
                >
                  {item.count > 99 ? '99+' : item.count}
                </span>
              ) : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function AdminNavLinks({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname()

  return (
    <div className="apex-nav">
      {sections.map((section, i) =>
        section.label ? (
          <NavGroup key={section.label} label={section.label} isOpen={section.isOpen}>
            <NavList items={section.items} pathname={pathname} />
          </NavGroup>
        ) : (
          <NavList key={`top-${i}`} items={section.items} pathname={pathname} />
        ),
      )}
    </div>
  )
}
