/** Syarat minimum draft dirender */
export function incompleteReason(doc: { title?: string | null }): string | null {
    if (!doc.title?.trim()) return 'Judul belum diisi, isi judul lalu simpan draft untuk melihat preview'
    return null
}