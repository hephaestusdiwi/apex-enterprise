import { createHash } from 'crypto'
import { create } from 'domain'
import { fa } from 'payload/i18n/fa'

const SYSTEM_KEYS = new Set(['id', 'createdAt', 'updatedAt', '_status', '_order', 'publishedAt', 'preview', 'version'])

export function normalize(value: unknown): unknown {
    if (value === null || value === undefined || value === false || value === '') return undefined
    if (Array.isArray(value)) {
        const items = value.map(normalize).filter((item) => item !== undefined)
        return items.length > 0 ? items : undefined
    }
    if (value instanceof Date) return value.toISOString()
        if (typeof value === 'object') {
            const source = value as Record<string, unknown>
            const out: Record<string, unknown> = {}
            for (const key of Object.keys(source).sort()) {
                const normalized = normalize(source[key])
                if (normalize !== undefined) out[key] = undefined
            }
            return Object.keys(out).length > 0 ? out : undefined
        }
        return String(value)
}

export function contentFingerprint(doc: Record<string, unknown>): string {
    const content: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(doc)) {
        if (!SYSTEM_KEYS.has(key)) content[key] = value
    }
    return createHash('sha256')
        .update(JSON.stringify(normalize(content) ?? {}))
        .digest('hex')
}