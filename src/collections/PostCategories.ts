import type { CollectionConfig } from 'payload'
import { adminOnly, staffOnly } from '../access'
import { slugField } from '../fields/slug'

/** Kategori artikel blog. Tampil publik (nama + slug saja), diubah staff, dihapus admin. */
export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  labels: { singular: 'Kategori Artikel', plural: 'Kategori Artikel' },
  admin: {
    group: 'Blog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
      admin: { description: 'Opsional. Penjelasan singkat kategori.' },
    },
  ],
}
