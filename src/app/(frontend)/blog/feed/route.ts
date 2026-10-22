import { getFeedPosts } from '@/content/posts'
import { getSiteSettings } from '@/content/site'
import { absoluteUrl, resolveSeo, SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const xml = (value: string): string =>
  value

    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    
export async function GET() {
  const [site, posts] = await Promise.all([getSiteSettings(), getFeedPosts()])
  const { description } = resolveSeo({ title: site.siteName, seo: site.seo, site })
  const feedUrl = absoluteUrl('/blog/feed.xml')

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`)
      const pubDate = post.publishedAt ? new Date(post.publishedAt) : null
      return [
        '    <item>',
        `      <title>${xml(post.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        `      <guid isPermaLink="true">${xml(url)}</guid>`,
        pubDate && !Number.isNaN(pubDate.getTime()) ? `      <pubDate>${pubDate.toUTCString()}</pubDate>` : null,
        post.category ? `      <category>${xml(post.category.title)}</category>` : null,
        post.excerpt ? `      <description>${xml(post.excerpt)}</description>` : null,
        '    </item>',
      ]
        .filter((line): line is string => line !== null)
        .join('\n')
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${site.siteName} - Blog`)}</title>
    <link>${xml(`${SITE_URL}/blog`)}</link>
    <description>${xml(description ?? `Artikel terbaru dari ${site.siteName}`)}</description>
    <language>id</language>
    <atom:link href="${xml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
