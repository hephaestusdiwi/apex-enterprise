'use client'

import { tr } from "payload/i18n/tr"

export function trackVirtualPageview(path: string): void {
    if (typeof window === 'undefined') return

    const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
    if (nav.doNotTrack === '1' || nav.globalPrivacyControl) return

    fetch('/api/visits/hit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, referrer: '' }),
        keepalive: true,
    }).catch(() => {})
}