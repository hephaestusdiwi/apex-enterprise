import { createHmac, timingSafeEqual } from 'node:crypto'

export const SPAM_THRESHOLD = 3

const MIN_FILL_MS = 3000

const OLD_TOKEN_MS = 24 * 60 * 60 * 1000

const secret = (): string => process.env.PAYLOAD_SECRET || ''

const sign = (timestamp: string): string =>
    createHmac('sha256', `contact-form:${secret()}`).update(timestamp).digest('base64url')

export function issueFormToken(): string {
    const timestamp = String(Date.now())
    return `${timestamp}.${sign(timestamp)}`
}

export type TokenCheck = { valid: boolean; ageMs: number }

export function readFormToken(token: string): TokenCheck {
    const [timestamp, signature] = token.split('.')
    if (!timestamp || !signature || !/^\d{10,16}$/.test(timestamp)) return { valid: false, ageMs: 0 }

    const expected = Buffer.from(sign(timestamp))
    const given = Buffer.from(signature)
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { valid: false, ageMs: 0 }

    return { valid: true, ageMs: Date.now() - Number(timestamp) }
}

export function hashIp(ip: string): string {
    return createHmac('sha256', `contact-ip:${secret()}`).update(ip).digest('hex').slice(0, 32)
}

const URL_PATTERN = /(?:https?:\/\/|www\.)\S+/gi
const HAS_URL = /(?:https?:\/\/|www\.)\S+/i

const SPAM_PHRASES: RegExp[] = [
    /\bbacklinks?\b/i,
    /\bguest post(?:ing)?\b/i,
    /\bseo (?:service|services|expert|package|packages|ranking|audit)\b/i,
    /\bjasa (?:seo|backlink)\b/i,
    /\bfirst page of google\b/i,
    /\brank(?:ing)? (?:your|on) (?:website|site|google)\b/i,
    /\bcasino\b/i,
    /\bkasino\b/i,
    /\bslot (?:gacor|online)\b/i,
    /\btogel\b/i,
    /\bjudi online\b/i,
    /\bviagra\b/i,
    /\bcialis\b/i,
    /\bforex\b/i,
    /\bmake money online\b/i,
    /\bwork from home\b/i,
    /\bpinjaman online\b/i,
    /\bbuy (?:followers|likes|traffic)\b/i,
]

export type SpamInput = {
    name: string
    email: string
    subject: string
    message: string
}

export type SpamSignals = {
    honeypot: string
    token: TokenCheck | null
}

export type SpamVerdict = {
    score: number
    reasons: string[]
    isSpam: boolean
}

export function scoreSubmission(input: SpamInput, signals: SpamSignals): SpamVerdict {
    let score = 0
    const reasons: string[] = []
    const add = (points: number, reason: string) => {
        score += points
        reasons.push(`${reason} (+${points})`)
    }

    if (signals.honeypot) add(10, 'honeypot terisi')
    
    if (!signals.token || !signals.token.valid) add(3, 'token form tidak valid')
        else if (signals.token.ageMs < MIN_FILL_MS) add(3, 'terkirim terlalu cepat')
    else if (signals.token.ageMs > OLD_TOKEN_MS) add(1, 'token form sudah lama')

    const { name, subject, message } = input
    const body = `${subject}\n${message}`

    const links = body.match(URL_PATTERN)?.length ?? 0
    if (links >= 3) add(3, `${links} tautan`)
    else if (links === 2) add(1, '2 tautan')

    if (HAS_URL.test(name)) add(3, 'tautan di kolom nama')

    if (links > 0 && message.replace(URL_PATTERN, '').trim().length < 5) add(2, 'pesan hanya berisi tautan')

    if (/<a\s[^>]*href|\[url=/i.test(body)) add(2, 'tag tautan HTML/BBCode')

    const phraseHits = SPAM_PHRASES.filter((pattern) => pattern.test(body)).length
    if (phraseHits > 0) add(Math.min(phraseHits * 2, 4), `${phraseHits} frasa spam`)

    if (/(.)\1{7,}/.test(body)) add(1, 'karakter berulang')
    if (message.length < 10) add(1, 'pesan sangat pendek')

        return { score, reasons, isSpam: score >= SPAM_THRESHOLD }
}
