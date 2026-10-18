import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'
import { mapPage } from './mapper'
import type { PageData } from './types'

export const getPageBySlug = cache(async (slug: string): Promise<PageData | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  const doc = docs[0]
  return doc ? mapPage(doc) : null
})