import type { BlockData, ProjectData } from './types'

type Content = Pick<ProjectData, 'title' | 'meta' | 'blocks'>

type Options = {
  /** Judul sudah dirender di atas hero, jadi tidak perlu slot judul bawaan. */
  titleInHero?: boolean
}

/**
 * Title dan meta dirender lewat block penanda (slot). Kalau editor tidak menaruh slot,
 * sisipkan di paling atas: title dulu, lalu meta. Block Image + Text dengan "sertakan meta"
 * dianggap sudah memegang meta, jadi slot meta bawaan tidak ditambahkan.
 */
export const withDefaultSlots = (content: Content, options: Options = {}): BlockData[] => {
  const hasTitleSlot = content.blocks.some((block) => block.type === 'titleSlot')
  const hasMetaSlot = content.blocks.some(
    (block) => block.type === 'metaSlot' || (block.type === 'imageText' && block.includeMeta),
  )

  const lead: BlockData[] = []
  if (!hasTitleSlot && !options.titleInHero) {
    lead.push({ type: 'titleSlot', id: 'default-title', layout: {}, title: content.title })
  }
  if (!hasMetaSlot && content.meta.length > 0) {
    lead.push({ type: 'metaSlot', id: 'default-meta', layout: {}, items: content.meta })
  }
  return [...lead, ...content.blocks]
}