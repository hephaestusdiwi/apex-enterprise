import Link from 'next/link'
import { blogHref } from '@/lib/postFormat'

type Props = {
  page: number
  totalPages: number
  kategori: string | null
}

export function Pagination({ page, totalPages, kategori }: Props) {
  if (totalPages <= 1) return null

  const linkClass = 'underline underline-offset-[6px] transition-colors can-hover:hover:text-accent'

  return (
    <nav aria-label="Halaman artikel" className="mt-16 flex items-center justify-between gap-6 text-sm md:mt-20">
      {page > 1 ? (
        <Link href={blogHref({ kategori, halaman: page - 1 })} rel="prev" className={linkClass}>
          ← Lebih baru
        </Link>
      ) : (
        <span aria-hidden />
      )}
      <p className="text-mute" aria-live="polite">
        Halaman {page} dari {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={blogHref({ kategori, halaman: page + 1 })} rel="next" className={linkClass}>
          Lebih lama →
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  )
}
