/** Helper URL yang aman dipakai di server maupun client (tanpa dependensi Node). */

export const PREVIEW_COLLECTIONS = ['projects', 'pages', 'posts'] as const
export type PreviewCollection = (typeof PREVIEW_COLLECTIONS)[number]

export const isPreviewCollection = (value: unknown): value is PreviewCollection =>
  typeof value === 'string' && (PREVIEW_COLLECTIONS as readonly string[]).includes(value)

/** ID dokumen di Postgres berupa angka. Tolak apa pun selain itu sebelum menyentuh database. */
export const isDocId = (value: unknown): value is string => typeof value === 'string' && /^\d{1,12}$/.test(value)

export const previewPath = (collection: PreviewCollection, id: string | number, slug?: string | null): string =>
  `/preview/${collection}/${id}${slug ? `/${encodeURIComponent(slug)}` : ''}`

export const editorPath = (collection: PreviewCollection, id: string | number): string =>
  `/admin/collections/${collection}/${id}`

export const loginPath = (redirectTo: string): string => `/admin/login?redirect=${encodeURIComponent(redirectTo)}`

/** Halaman publik untuk dokumen yang sudah published (null bila tidak ada). */
export const publicPath = (collection: PreviewCollection, slug?: string | null): string | null => {
  if (!slug) return null
  if (collection === 'projects') return `/work/${encodeURIComponent(slug)}`
  if (collection === 'posts') return `/blog/${encodeURIComponent(slug)}`
  return `/${encodeURIComponent(slug)}`
}
