import { cache } from 'react'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { mapPost, mapPostSummary, toPostCategory } from './mapper'
import type { PostCategoryWithCount, PostData, PostListPage, PostSummary } from './types'

export const POSTS_PER_PAGE = 9
export const RELATED_POSTS = 3
export const FEED_POSTS = 20

const SUMMARY_SELECT = {
  title: true,
  slug: true,
  excerpt: true,
  cover: true,
  category: true,
  authorName: true,
  publishedAt: true,
} as const

const published: Where = { _status: { equals: 'published' } }

/** Terbaru dulu; createdAt jadi penentu bila tanggal terbit sama atau kosong. */
const NEWEST = ['-publishedAt', '-createdAt']

export const getPostBySlug = cache(async (slug: string): Promise<PostData | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, published] },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  const doc = docs[0]
  return doc ? mapPost(doc) : null
})

export const getPostList = cache(async (page: number, categorySlug: string | null): Promise<PostListPage> => {
  const payload = await getPayloadClient()
  const where: Where = categorySlug
    ? { and: [published, { 'category.slug': { equals: categorySlug } }] }
    : published
  const result = await payload.find({
    collection: 'posts',
    where,
    sort: NEWEST,
    page,
    limit: POSTS_PER_PAGE,
    depth: 1,
    overrideAccess: false,
    select: SUMMARY_SELECT,
  })
  return {
    posts: result.docs.map(mapPostSummary).filter((post) => post.slug !== ''),
    page: result.page ?? page,
    totalPages: Math.max(1, result.totalPages),
    totalDocs: result.totalDocs,
  }
})

/** Kategori yang punya minimal satu artikel terbit, urut abjad. */
export const getPostCategories = cache(async (): Promise<PostCategoryWithCount[]> => {
  const payload = await getPayloadClient()
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: published,
    pagination: false,
    depth: 0,
    overrideAccess: false,
    select: { category: true },
  })

  const counts = new Map<number, number>()
  for (const post of posts) {
    const id = typeof post.category === 'number' ? post.category : post.category?.id
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  if (counts.size === 0) return []

  const { docs: categories } = await payload.find({
    collection: 'post-categories',
    where: { id: { in: [...counts.keys()] } },
    sort: 'title',
    pagination: false,
    depth: 0,
    overrideAccess: false,
  })

  return categories.flatMap((category) => {
    const data = toPostCategory(category)
    return data ? [{ ...data, count: counts.get(category.id) ?? 0 }] : []
  })
})

/**
 * Artikel lain untuk dibaca berikutnya: sekategori dulu, sisanya dilengkapi artikel terbaru.
 * `excludeId` = artikel yang sedang dibuka.
 */
export const getRelatedPosts = cache(
  async (excludeId: number, categoryId: number | null, limit = RELATED_POSTS): Promise<PostSummary[]> => {
    const payload = await getPayloadClient()

    const fetchPosts = async (where: Where, max: number) => {
      const { docs } = await payload.find({
        collection: 'posts',
        where,
        sort: NEWEST,
        limit: max,
        pagination: false,
        depth: 1,
        overrideAccess: false,
        select: SUMMARY_SELECT,
      })
      return docs.map(mapPostSummary).filter((post) => post.slug !== '')
    }

    const notSelf: Where = { id: { not_equals: excludeId } }
    const same = categoryId
      ? await fetchPosts({ and: [published, notSelf, { category: { equals: categoryId } }] }, limit)
      : []
    if (same.length >= limit) return same

    const skip = [excludeId, ...same.map((post) => post.id)]
    const rest = await fetchPosts({ and: [published, { id: { not_in: skip } }] }, limit - same.length)
    return [...same, ...rest]
  },
)

export const getFeedPosts = cache(async (): Promise<PostSummary[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: published,
    sort: NEWEST,
    limit: FEED_POSTS,
    pagination: false,
    depth: 1,
    overrideAccess: false,
    select: SUMMARY_SELECT,
  })
  return docs.map(mapPostSummary).filter((post) => post.slug !== '')
})
