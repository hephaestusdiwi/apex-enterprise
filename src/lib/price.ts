const idr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
export const formatIdr = (n: number) => idr.format(n)

export const priceLabel = (p: { priceType: string; price: number | null }) =>
    p.priceType === 'custom' || p.price === null
        ? 'Hubungi kami'
        : `${p.priceType === 'from' ? 'Mulai ' : ''}${formatIdr(p.price)}`