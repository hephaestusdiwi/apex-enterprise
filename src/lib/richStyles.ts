export const TEXT_COLORS = {
    accent: { label: 'Oranye', preview: '#fc5c18' },
    muted: { label: 'Abu-abu', preview: '#9b9b9b' },
} as const

export const TEXT_SIZES = {
    small: { label: 'Kecil', preview: '0.85em' },
    large: { label: 'Besar', preview: '1.35em' },
    xlarge: { label: 'Sangat besar', preview: '1.8em' },
} as const

export type TextColor = keyof typeof TEXT_COLORS
export type TextSize = keyof typeof TEXT_SIZES

export const TEXT_COLOR_KEYS = Object.keys(TEXT_COLORS) as TextColor[]
export const TEXT_SIZE_KEYS = Object.keys(TEXT_SIZES) as TextSize[]