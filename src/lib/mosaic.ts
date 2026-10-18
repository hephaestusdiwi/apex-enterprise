import { Column } from "@payloadcms/db-postgres/drizzle"
import { he } from "payload/i18n/he"

export type MosaicItem = {
    index: number
    ratio: number
    grow: number
}

export type MosaicColumn = {
    grow: number
    items: MosaicItem[]
}

export type MosaicLayout = {
    rowRatio: number
    columns: MosaicColumn[]
}

export const mosaicColumCount = (count: number): number => (count <= 1 ? 1 : count <= 4 ? 2 : 3)

const safeRatio = (value: number): number => (Number.isFinite(value) && value > 0 ? value : 1)

export function packMosaic(ratios: number[], columnCount = mosaicColumCount(ratios.length)): MosaicLayout {
    const count = Math.max(1, Math.min(columnCount, ratios.length))
    const heights = Array.from({ length: count }, () => 0)
    const buckets: MosaicItem[][] = Array.from({ length: count }, () => [])
    
    const  items: MosaicItem[] = ratios.map((value, index) => {
        const ratio = safeRatio(value)
        return { index, ratio, grow: 1 / ratio }
    })

    for (const item of [...items].sort((a, b) => b.grow || a.grow || a.index - b.index)) {
        const target = heights.indexOf(Math.min(...heights))
        heights[target] += item.grow
        buckets[target].push(item)
    }

    const columns = buckets
        .map((bucket, i) => ({ grow: 1 / heights[i], items: bucket.sort((a, b) => a.index - b.index) }))
        .filter((column) => column.items.length > 0)
        .sort((a, b) => a.items[0].index - b.items[0].index)

    return { rowRatio: columns.reduce((sum, column) => sum + column.grow, 0), columns}
}