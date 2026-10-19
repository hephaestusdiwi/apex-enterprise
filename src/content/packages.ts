import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'

export type PackageItem = {
    id: number
    title: string
    slug: string
    tagline: string
    description: string
    priceType: 'fixed' | 'from' | 'custom'
    price: number | null
    priceNote: string
    features: string[]
    highlighted: boolean
    bookable: boolean
}

export const getPackageList = cache(async (): Promise<PackageItem[]> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'service-packages',
        where: { _status: { equals: 'published' } },
        sort: '_order',
        depth: 0,
        pagination: false,
        overrideAccess: false,
    })
    return docs
        .filter((d) => d.slug)
        .map((d) => ({
        id: d.id,
        title: d.title,
        slug: d.slug as string,
        tagline: d.tagline ?? '',
        description: d.description ?? '',
        priceType: d.priceType,
        price: d.price ?? null,
        priceNote: d.priceNote ?? '',
        features: (d.features ?? []).map((f) => f.text),
        highlighted: !!d.highlighted,
        bookable: d.bookable !== false,
        }))
    })