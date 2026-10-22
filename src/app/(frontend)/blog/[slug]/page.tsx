import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostPage } from '@/components/blog/PostPage'
import { JsonLd } from '@/components/seo/JsonLd'
import { getPostBySlug, getRelatedPosts } from '@/content/posts'
import { getSiteSettings } from '@/content/site'
import { postJsonLd } from '@/lib/jsonLd'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [post, site] = await Promise.all([getPostBySlug(slug), getSiteSettings()])
  if (!post) return { title: 'Not found' }

  const meta = buildMetadata({
    title: post.title,
    path: `/blog/${post.slug}`,
    // Ringkasan artikel jadi deskripsi bawaan bila kolom SEO kosong.
    seo: { ...post.seo, description: post.seo.description ?? (post.excerpt || undefined) },
    site,
    image: post.cover,
  })
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: post.authorName ? [post.authorName] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const [related, site] = await Promise.all([getRelatedPosts(post.id, post.category?.id ?? null), getSiteSettings()])

  return (
    <>
      <JsonLd data={postJsonLd(post, site)} />
      <PostPage post={post} related={related} />
    </>
  )
}
