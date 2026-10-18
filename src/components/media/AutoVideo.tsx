'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

type Props = {
    src: string
    mimeType: string
    poster?: string
    className?: string
    style?: CSSProperties
    preload?: 'none' | 'metadata' | 'auto'
}

export function AutoVideo({ src, mimeType, poster, className, style, preload = 'metadata' }: Props) {
    const ref = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = ref.current
        if (!video) return

        const motion = window.matchMedia('(prefers-reduced-motion: no-preference)')
        let visible = false

        const sync = () => {
            if (motion.matches && visible) video.play().catch(() => {})
            else video.pause()
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry?.isIntersecting ?? false
                sync()
            },
            { threshold: 0.25 },
        )
        observer.observe(video)
        motion.addEventListener('change', sync)

        return () => {
            observer.disconnect()
            motion.removeEventListener('change', sync)
        }
    }, [])

    return (
        <video
            ref={ref}
            muted
            loop
            playsInline
            preload={preload}
            poster={poster}
            aria-hidden="true"
            tabIndex={-1}
            className={className}
            style={style}
        >
            {/* #t=0.001 membuat browser menampilkan frame pertama kalau tidak ada poster */}
            <source src={`${src}#t=0.001`} type={mimeType} />
        </video>
    )
}