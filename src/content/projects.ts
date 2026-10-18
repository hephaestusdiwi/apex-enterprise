import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'
import { mapProject, mapSummary } from './mapper'
import type { ProjectData, ProjectSummary } from './types'


export const getProjectBySlug = cache(async (slug: string): Promise<ProjectData | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  const doc = docs[0]
  return doc ? mapProject(doc) : null
})


export const getProjectList = cache(async (): Promise<ProjectSummary[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    sort: '_order',
    depth: 1,
    pagination: false,
    overrideAccess: false,
    select: { title: true, slug: true, hero: true, home: true },
  })
  return docs.map(mapSummary).filter((project) => project.slug !== '')
})