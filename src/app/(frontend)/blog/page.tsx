import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { Pagination } from '@/components/blog/Pagination'
import { PostCard } from '@/components/blog/PostCard'
import { getPostCategories, getPostList } from '@/content/posts'
import { getSiteSettings } from '@/content/site'
import { blogHref } from '@/lib/postFormat'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type SearchParams = { kategori?: string | string[]; halaman?: string | string[] }
type Props = { searchParams: Promise<SearchParams> }

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

const parseKategori = (value: string | undefined): string | null =>
  value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : null

const parseHalaman = (value: string | undefined): number => {
  const n = Number(value)
  return Number.isInteger(n) && n >= 1 && n <= 10_000 ? n : 1
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const kategori = parseKategori(first(params.kategori))
  const halaman = parseHalaman(first(params.halaman))
  const [site, categories] = await Promise.all([getSiteSettings(), getPostCategories()])
  const category = categories.find((item) => item.slug === kategori)

  const meta = buildMetadata({
    title: category ? `Blog: ${category.title}` : 'Blog',
    path: blogHref({ kategori: category?.slug ?? null, halaman }),
    seo: { image: null, noIndex: false, description: category?.description },
    site,
  })
  return { ...meta, alternates: { ...meta.alternates, types: { 'application/rss+xml': '/blog/feed.xml' } } }
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams
  const kategori = parseKategori(first(params.kategori))
  const halaman = parseHalaman(first(params.halaman))

  const categories = await getPostCategories()
  
  if (kategori && !categories.some((category) => category.slug === kategori)) notFound()

  const list = await getPostList(halaman, kategori)
  if (halaman > 1 && list.posts.length === 0) notFound()

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-28 md:px-10 md:pt-36">
      <h1 className="text-[clamp(2rem,3.4vw,3.75rem)] font-medium leading-[1.1]">Blog</h1>

      <div className="mt-8 md:mt-10">
        <CategoryFilter categories={categories} active={kategori} />
      </div>

      {list.posts.length === 0 ? (
        <p className="mt-12 text-mute md:mt-16">Belum ada artikel yang dipublikasikan.</p>
      ) : (
        <ul className="mt-12 grid gap-x-8 gap-y-14 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {list.posts.map((post, index) => (
            <li key={post.id}>
              <PostCard post={post} priority={index < 3} />
            </li>
          ))}
        </ul>
      )}

      <Pagination page={list.page} totalPages={list.totalPages} kategori={kategori} />
    </section>
  )
}
