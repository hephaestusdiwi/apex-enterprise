import type { PostData, ProjectData } from '@/content/types'
import type { SiteSettings } from '@/content/site'
import { absoluteUrl, resolveSeo, SITE_URL } from './seo'

export const siteJsonLd = (site: SiteSettings) => {
  const { description, share } = resolveSeo({ title: site.siteName, seo: site.seo, site })
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: site.siteName, description },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: site.siteName,
        url: SITE_URL,
        image: share ? absoluteUrl(share.src) : undefined,
        sameAs: site.instagramUrl ? [site.instagramUrl] : undefined,
      },
    ],
  }
}

export const projectJsonLd = (project: ProjectData, site: SiteSettings) => {
  const url = absoluteUrl(`/work/${project.slug}`)
  const { title, description, share } = resolveSeo({ title: project.title, seo: project.seo, site, image: project.hero })
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        url,
        name: title,
        description,
        image: share ? absoluteUrl(share.src) : undefined,
        publisher: { '@type': 'Organization', name: site.siteName, url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: project.title, item: url },
        ],
      },
    ],
  }
}

export const postJsonLd = (post: PostData, site: SiteSettings) => {
  const url = absoluteUrl(`/blog/${post.slug}`)
  const { title, description, share } = resolveSeo({
    title: post.title,
    seo: { ...post.seo, description: post.seo.description ?? (post.excerpt || undefined) },
    site,
    image: post.cover,
  })
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: title,
        description,
        image: share ? absoluteUrl(share.src) : undefined,
        datePublished: post.publishedAt ?? undefined,
        dateModified: post.updatedAt,
        articleSection: post.category?.title,
        author: post.authorName
          ? { '@type': 'Person', name: post.authorName }
          : { '@type': 'Organization', name: site.siteName, url: SITE_URL },
        publisher: { '@type': 'Organization', name: site.siteName, url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  }
}
