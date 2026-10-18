import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MEDIA = 'img, video, iframe'

/**
 * Membaca atribut `data-motion` yang dirender BlockShell:
 * - reveal   : gambar/video/iframe di block itu dibuka dengan clip-path saat masuk viewport
 * - parallax : isi block bergeser halus relatif terhadap scroll
 * - none     : tidak disentuh
 * Mengembalikan fungsi cleanup (mengembalikan style ke semula dan mematikan ScrollTrigger).
 */
export function setupBlockMotion(): () => void {
  gsap.registerPlugin(ScrollTrigger)

  const ctx = gsap.context(() => {
    document.querySelectorAll<HTMLElement>('[data-motion="reveal"]').forEach((block) => {
      const targets = block.querySelectorAll<HTMLElement>(MEDIA)
      if (targets.length === 0) return

      gsap.fromTo(
        targets,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    document.querySelectorAll<HTMLElement>('[data-motion="parallax"]').forEach((block) => {
      const inner = block.firstElementChild
      if (!inner) return

      gsap.fromTo(
        inner,
        { y: 24 },
        {
          y: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: block,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })
  }, document.body)

  return () => ctx.revert()
}