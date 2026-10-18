'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { setupBlockMotion } from './blockMotion'

/** true selama pengguna TIDAK meminta reduced motion; ikut berubah kalau setting OS diubah. */
function useMotionAllowed(): boolean {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const update = () => setAllowed(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return allowed
}

export function MotionProvider() {
  const allowed = useMotionAllowed()
  const pathname = usePathname()

  // Smooth scroll: Lenis digerakkan oleh ticker GSAP supaya satu sumber waktu dengan ScrollTrigger.
  useEffect(() => {
    if (!allowed) return

    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ autoRaf: false })
    const onTick = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', () => ScrollTrigger.update())
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [allowed])

  // Animasi block dibangun ulang tiap pindah halaman.
  useEffect(() => {
    if (!allowed) return
    return setupBlockMotion()
  }, [allowed, pathname])

  return null
}