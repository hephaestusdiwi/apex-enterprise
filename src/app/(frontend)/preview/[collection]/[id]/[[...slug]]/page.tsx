import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { PreviewBanner } from '@/components/preview/PreviewBanner'
import { PreviewMessage } from '@/components/preview/PreviewMessage'
import { PageView } from '@/components/page/PageView'
import { ProjectPage } from '@/components/project/ProjectPage'
import { mapPage, mapProject } from '@/content/mapper'
import { getNeighbors } from '@/content/navigation'
import { getProjectList } from '@/content/projects'
import { resolvePreview } from '@/preview/resolve'
import { incompleteReason } from '@/preview/validate'
import { editorPath, isDocId, isPreviewCollection, loginPath, previewPath, publicPath } from '@/preview/urls'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Preview',
  robots: { index: false, follow: false, nocache: true },
}

type Props = {
  params: Promise<{ collection: string; id: string; slug?: string[] }>
  searchParams: Promise<{ token?: string | string[] }>
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const { collection, id, slug } = await params
  const { token: rawToken } = await searchParams
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken

  if (!isPreviewCollection(collection) || !isDocId(id)) notFound()

  const result = await resolvePreview({ collection, id, token, headers: await headers() })

  if (!result.ok) {
    const editorHref = editorPath(collection, id)
    switch (result.reason) {
      case 'unauthenticated': {
        // Kembali ke URL ini setelah login; akses tetap dicek ulang (token + izin) setelahnya.
        const back = `${previewPath(collection, id, slug?.[0])}${token ? `?token=${encodeURIComponent(token)}` : ''}`
        redirect(loginPath(back))
      }
      // eslint-disable-next-line no-fallthrough
      case 'not_found':
        notFound()
      // eslint-disable-next-line no-fallthrough
      default:
        return <PreviewMessage reason={result.reason} editorHref={result.reason === 'forbidden' ? undefined : editorHref} />
    }
  }

  // Slug bisa berubah setelah draft disimpan: ID tetap acuan, URL dirapikan ke slug terbaru.
  const canonicalSlug = result.doc.slug ?? null
  if ((slug?.[0] ?? null) !== canonicalSlug) {
    redirect(`${previewPath(collection, id, canonicalSlug)}?token=${encodeURIComponent(token ?? '')}`)
  }

  const editorHref = editorPath(collection, id)
  if (incompleteReason(result.doc)) return <PreviewMessage reason="incomplete" editorHref={editorHref} />

  let content: React.ReactNode
  try {
    if (result.collection === 'projects') {
      const project = mapProject(result.doc)
      const list = await getProjectList()
      content = <ProjectPage project={project} neighbors={getNeighbors(list, project.slug)} />
    } else {
      content = <PageView page={mapPage(result.doc)} />
    }
  } catch (err) {
    // Hanya nama error: isi draft tidak boleh ikut tercatat di log.
    console.error('[preview] gagal merender', collection, id, err instanceof Error ? err.name : 'error')
    return <PreviewMessage reason="render_error" editorHref={editorHref} />
  }

  return (
    <>
      {content}
      <PreviewBanner
        collection={collection}
        id={id}
        token={token ?? ''}
        status={result.status}
        hasPublished={result.hasPublished}
        updatedAt={result.updatedAt}
        publicHref={result.hasPublished ? publicPath(collection, result.publishedSlug) : null}
      />
    </>
  )
}
