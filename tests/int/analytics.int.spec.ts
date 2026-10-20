import { describe, expect, it } from 'vitest'
import { normalizePath } from '@/lib/analytics'

describe('normalizePath', () => {
    it('menggabungkan halaman status booking dan membuang query', () => {
        expect(normalizePath('/booking/BK-ABCD2345?token=rahasia')).toBe('/booking/[kode]')
        expect(normalizePath('/booking')).toBe('/booking')
        expect(normalizePath('/pricing')).toBe('/pricing')
    })
})