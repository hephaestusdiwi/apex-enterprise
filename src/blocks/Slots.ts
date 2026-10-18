import type { Block } from 'payload'
import { layoutField } from '../fields/layout'

/** Penanda posisi judul. Tanpa penanda ini, judul otomatis di paling atas. */
export const TitleSlotBlock: Block = {
  slug: 'titleSlot',
  interfaceName: 'TitleSlotBlock',
  labels: { singular: 'Title (slot)', plural: 'Title (slot)' },
  fields: [layoutField()],
}

/** Penanda posisi meta. Tanpa penanda ini, meta otomatis tepat setelah judul. */
export const MetaSlotBlock: Block = {
  slug: 'metaSlot',
  interfaceName: 'MetaSlotBlock',
  labels: { singular: 'Meta (slot)', plural: 'Meta (slot)' },
  fields: [layoutField()],
}

/** Maksimal satu slot per jenis. */
export const validateSlots = (value: unknown): true | string => {
  if (!Array.isArray(value)) return true
  const count = (type: string) =>
    value.filter((item) => (item as { blockType?: string } | null)?.blockType === type).length
  if (count('titleSlot') > 1) return 'Hanya boleh satu Title (slot).'
  if (count('metaSlot') > 1) return 'Hanya boleh satu Meta (slot).'
  return true
}