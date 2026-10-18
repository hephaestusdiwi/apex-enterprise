import type { HomeAlign, MediaAsset } from '@/content/types'

export const focalPosition = (asset: MediaAsset): string =>
    `${asset.focalX ?? 50}% ${asset.focalY ?? 50}%`

export const cropPosition = (asset: MediaAsset,  align: HomeAlign): string => {
    const y = asset.focalY ?? 50
    if (align === 'left') return `0% ${y}%`
    if (align === 'right') return `100% ${y}%`
    return focalPosition(asset)
}