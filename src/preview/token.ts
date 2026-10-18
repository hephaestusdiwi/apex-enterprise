import { createHmac, timingSafeEqual } from 'crypto'
import { isDocId, isPreviewCollection, type PreviewCollection } from './urls'

/** Masa berlaku token preview */
export const PREVIEW_TTL_SECONDS = 30 * 60

export type PreviewClaims = {
    c: PreviewCollection
    id: string
    uid: string
    exp: number
}

export type VerifyResult = { ok: true; claims: PreviewClaims } | { ok: false; reason: 'invalid' | 'expired' }

const derivedKey = (secret: string): Buffer => createHmac('sha256', secret).update('apex:preview:v1').digest()

const sign = (body: string, secret: string): string =>
    createHmac('sha256', derivedKey(secret)).update(body).digest('base64url')

export function signPreviewToken(claims: PreviewClaims, secret: string): string {
    if (!secret) throw new Error('Secret kosong: token preview tidak boleh dibuat tanpa preview')
    const body = Buffer.from(JSON.stringify(claims)).toString('base64url')
    return `${body}.${sign(body, secret)}`
}

const parseClaims = (body: string): PreviewClaims | null => {
    try {
        const value = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as Partial<PreviewClaims>
        if (
            isPreviewCollection(value.c) &&
            isDocId(value.id) &&
            typeof value.uid === 'string' &&
            value.uid !== '' &&
            typeof value.exp === 'number' &&
            Number.isFinite(value.exp)
        ) {
            return { c: value.c, id: value.id, uid: value.uid, exp: value.exp }
        }
    } catch {
        // tidak valid
    }
    return null
}

export function verifyPreviewToken(token: unknown, secret: string, now = Date.now()): VerifyResult {
    if (!secret || typeof token !== 'string' || token.length > 1024) return { ok: false, reason: 'invalid' }

    const parts = token.split('.')
    if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, reason: 'invalid' }
    const [body, mac] = parts

    const expected = Buffer.from(sign(body, secret))
    const given = Buffer.from(mac)
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: 'invalid' }

    const claims = parseClaims(body)
    if (!claims) return { ok: false, reason: 'invalid' }
    if (claims.exp * 1000 <= now) return { ok: false, reason: 'expired' }

    return { ok: true, claims }
}