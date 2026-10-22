const TZ = process.env.ANALYTICS_TZ || 'Asia/Jakarta'

const formatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ })

export const formatPostDate = (iso: string | null | undefined): string => {
    if (!iso) return ''
    const date = new Date(iso)
    return Number.isNaN(date.getTime()) ? '' : formatter.format(date)
}

type Query = { kategori?: string | null; halaman?: number | null }

export const blogHref = ({ kategori, halaman }: Query = {}): string => {
    const params = new URLSearchParams()
    if (kategori) params.set('kategori', kategori)
    if (halaman && halaman > 1) params.set('halaman', String(halaman))
        const query = params.toString()
    return query ? `/blog?${query}` : '/blog'
}