import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectPage } from '@/components/project/ProjectPage'
import { getNeighbors } from '@/content/navigation'
import { getProjectBySlug, getProjectList } from '@/content/projects'
import { getSiteSettings } from '@/content/site'
import { buildMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { projectJsonLd } from '@/lib/jsonLd'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [project, site] = await Promise.all([getProjectBySlug(slug), getSiteSettings()])
  if (!project) return { title: 'Not found' }
  return buildMetadata({ title: project.title, path: `/work/${project.slug}`, seo: project.seo, site, image: project.hero })
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params
  const [project, list, site] = await Promise.all([getProjectBySlug(slug), getProjectList(), getSiteSettings()])
  if (!project) notFound()
  return (
    <>
      <JsonLd data={projectJsonLd(project, site)} />
      <ProjectPage project={project} neighbors={getNeighbors(list, slug)} />
    </>
  )
}