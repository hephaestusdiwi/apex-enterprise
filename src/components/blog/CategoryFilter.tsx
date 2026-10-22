import Link from 'next/link'
import type { PostCategoryWithCount } from '@/content/types'
import { blogHref } from '@/lib/postFormat'

type Props = {
  categories: PostCategoryWithCount[]
  /** Slug kategori yang aktif; null = semua. */
  active: string | null
}

export function CategoryFilter({ categories, active }: Props) {
  if (categories.length === 0) return null

  const item = (href: string, label: string, isActive: boolean) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={`transition-colors can-hover:hover:text-accent ${
          isActive ? 'underline underline-offset-[6px]' : 'text-mute'
        }`}
      >
        {label}
      </Link>
    </li>
  )

  return (
    <nav aria-label="Kategori artikel">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {item(blogHref(), 'Semua', active === null)}
        {categories.map((category) => item(blogHref({ kategori: category.slug }), category.title, active === category.slug))}
      </ul>
    </nav>
  )
}
