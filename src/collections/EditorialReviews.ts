import type { CollectionConfig } from 'payload'
import { staffOnly } from '../access'
import { EDITORIAL_COLLECTIONS, REVIEW_STATUSES, STATUS_LABEL } from '../editorial/constants'

/**
 * Satu baris per dokumen (Projects/Pages): status review dan reviewer.
 * Sengaja terpisah dari dokumennya supaya mengubah status review tidak membuat versi/draft baru.
 * Hanya diubah lewat endpoint /api/editorial/... (Local API), tidak lewat REST/GraphQL/admin.
 */
export const EditorialReviews: CollectionConfig = {
  slug: 'editorial-reviews',
  labels: { singular: 'Review Konten', plural: 'Review Konten' },
  admin: { hidden: true, useAsTitle: 'docId' },
  access: {
    create: () => false,
    read: staffOnly,
    update: () => false,
    delete: () => false,
  },
  indexes: [{ fields: ['docCollection', 'docId'], unique: true }],
  fields: [
    {
      name: 'docCollection',
      type: 'select',
      required: true,
      options: EDITORIAL_COLLECTIONS.map((value) => ({ label: value, value })),
    },
    { name: 'docId', type: 'number', required: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: REVIEW_STATUSES.map((value) => ({ label: STATUS_LABEL[value], value })),
    },
    { name: 'reviewers', type: 'relationship', relationTo: 'users', hasMany: true },
    { name: 'requestedBy', type: 'relationship', relationTo: 'users' },
    { name: 'requestedAt', type: 'date' },
    { name: 'decidedBy', type: 'relationship', relationTo: 'users' },
    { name: 'decidedAt', type: 'date' },
    {
      name: 'approvedFingerprint',
      type: 'text',
      admin: { description: 'Sidik jari isi konten saat disetujui; berubah berarti ada edit setelah persetujuan.' },
    },
  ],
}
