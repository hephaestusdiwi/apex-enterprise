import type { CollectionConfig } from 'payload'
import { staffOnly } from '../access'
import { EDITORIAL_COLLECTIONS, NOTE_KINDS, NOTE_MAX_LENGTH } from '../editorial/constants'

/**
 * Catatan/komentar pada draft (dan jejak kejadian workflow). Hanya staff yang bisa membaca;
 * penulisan lewat endpoint /api/editorial/... supaya penulis dan aturan izin selalu dipaksakan server.
 */
export const EditorialNotes: CollectionConfig = {
  slug: 'editorial-notes',
  labels: { singular: 'Catatan Editorial', plural: 'Catatan Editorial' },
  admin: { hidden: true, useAsTitle: 'body' },
  access: {
    create: () => false,
    read: staffOnly,
    update: () => false,
    delete: () => false,
  },
  indexes: [{ fields: ['docCollection', 'docId'] }],
  fields: [
    {
      name: 'docCollection',
      type: 'select',
      required: true,
      options: EDITORIAL_COLLECTIONS.map((value) => ({ label: value, value })),
    },
    { name: 'docId', type: 'number', required: true },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'comment',
      options: NOTE_KINDS.map((value) => ({ label: value, value })),
    },
    { name: 'body', type: 'textarea', required: true, maxLength: NOTE_MAX_LENGTH },
    { name: 'resolved', type: 'checkbox', defaultValue: false },
    { name: 'resolvedBy', type: 'relationship', relationTo: 'users' },
    { name: 'resolvedAt', type: 'date' },
  ],
}
