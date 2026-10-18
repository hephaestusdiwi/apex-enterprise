'use client'

import { useEffect } from 'react'
import 'photoswipe/dist/photoswipe.css'
import PhotoSwipeLightbox from 'photoswipe/lightbox'

export function Lightbox() {
    useEffect(() => {
        let disposed = false
        let destroy: (() => void) | undefined

        void import('photoswipe/lightbox').then(({ default: PhotoSwipeLightbox }) => {
            if (disposed) return
            const lightbox = new PhotoSwipeLightbox({
                gallery: 'main',
                children: 'a[data-pswp-width]',
                pswpModule: () => import('photoswipe'),
            })
            lightbox.on('afterInit', () => lightbox.pswp?.element?.setAttribute('data-lenis-prevent', ''))
            lightbox.init()
            destroy = () => lightbox.destroy()
        })

        return () => {
            disposed = true
            destroy?.()
        }
    }, [])

    return null
}