import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const payload = await getPayloadClient()
    const [projects, pages, posts] = await Promise.all([
        payload.find({
            collection: 'projects',
            where: { and: [{ _status: { equals: 'published' } }, { 'seo.noIndex': { not_equals: true } }] },
            pagination: false,
            depth: 0,
            overrideAccess: false,
            select: { slug: true, updatedAt: true },
        }),
        payload.find({
            collection: 'pages',
            where: { and: [{ _status: { equals: 'published' } }, { 'seo.noIndex': { not_equals: true } }] },
            pagination: false,
            depth: 0,
            overrideAccess: false,
            select: { slug: true, updatedAt: true },
        }),
        payload.find({
            collection: 'posts',
            where: { and: [{ _status: { equals: 'published' } }, { 'seo.noIndex': { not_equals: true } }] },
            pagination: false,
            depth: 0,
            overrideAccess: false,
            select: { slug: true, updatedAt: true },
        }),
    ])

    return [
        { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
        { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
        { url: `${SITE_URL}/pricing`, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${SITE_URL}/booking`, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
        ...projects.docs.filter((p) => p.slug).map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
        ...posts.docs.filter((p) => p.slug).map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
        ...pages.docs.filter((p) => p.slug).map((p) => ({ url: `${SITE_URL}/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
    ]
}
