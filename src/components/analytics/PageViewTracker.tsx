'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function PageViewTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (lastPath.current === pathname) return

    // Referrer hanya relevan untuk halaman pertama; navigasi berikutnya internal.
    const referrer = lastPath.current === null ? document.referrer : ''
    lastPath.current = pathname

    const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
    if (nav.doNotTrack === '1' || nav.globalPrivacyControl) return

    fetch('/api/visits/hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
