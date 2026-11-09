import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STORY_ANIMATIONS, type StoryAnimation } from '@/content/types'

/**
 * Animasi block "Cerita Scroll". Membaca atribut yang dirender server (ScrollStoryView):
 *   data-story / data-story-preset / data-story-anim   : root dan pilihan editor
 *   data-story-item                                    : teks yang muncul bertahap
 *   data-story-media / data-story-bg                   : pembungkus media dan lapisan yang bergerak
 *   data-story-stage-item / data-story-panel(-body)    : preset Showcase menempel
 *
 * Hanya dijalankan MotionProvider saat pengunjung TIDAK meminta reduced motion; selain itu (dan tanpa JS)
 * halaman tampil sebagai layout statis yang utuh. Yang dianimasikan hanya transform, opacity, dan
 * clip-path (sekali putar); tidak ada animasi yang mengubah layout, dan tidak ada pin yang berat.
 */

const STICKY_QUERY = '(min-width: 768px)'
/** Opasitas panel yang belum aktif di Showcase: cukup redup untuk memberi fokus, tetap terbaca. */
const DIM = 0.5

const all = (root: ParentNode, selector: string): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(selector))

const animationOf = (root: HTMLElement): StoryAnimation =>
  STORY_ANIMATIONS.find((value) => value === root.dataset.storyAnim) ?? 'none'

/** Teks dan media masuk saat blok terlihat (sekali), plus efek media sesuai pilihan editor. */
function setupIntro(root: HTMLElement, anim: StoryAnimation) {
  const items = all(root, '[data-story-item]')
  const media = root.querySelector<HTMLElement>('[data-story-media]')
  const bg = root.querySelector<HTMLElement>('[data-story-bg]')
  const split = root.dataset.storyPreset === 'split'
  const once = { trigger: root, start: 'top 78%', once: true }

  if (items.length > 0) {
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        delay: anim === 'reveal' ? 0.25 : 0,
        scrollTrigger: once,
      },
    )
  }

  if (anim === 'fade' && media && split) {
    gsap.fromTo(media, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: once })
  }

  if (anim === 'reveal' && media) {
    gsap.fromTo(
      media,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: once },
    )
    if (bg) gsap.fromTo(bg, { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'power3.out', scrollTrigger: once })
  }

  if (anim === 'zoom' && bg) {
    gsap.fromTo(
      bg,
      { scale: 1.18 },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'center center', scrub: true } },
    )
  }

  if (anim === 'parallax' && bg) {
    // scale 1.2 menutup tepi saat gambar bergeser.
    gsap.fromTo(
      bg,
      { yPercent: -10, scale: 1.2 },
      { yPercent: 10, scale: 1.2, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } },
    )
  }
}

/**
 * Showcase menempel (layar md ke atas): panggung visual menempel, gambar berganti sesuai panel yang sedang
 * di tengah layar. "Tanpa animasi" tetap berganti, tetapi seketika dan tanpa efek apa pun.
 * Mengembalikan fungsi pembersih (menghapus atribut yang dipasang; GSAP me-revert style-nya sendiri).
 */
function setupSticky(root: HTMLElement, anim: StoryAnimation): () => void {
  const stage = all(root, '[data-story-stage-item]')
  const panels = all(root, '[data-story-panel]')
  const bodies = panels.map((panel) => panel.querySelector<HTMLElement>('[data-story-panel-body]'))
  if (stage.length === 0 || stage.length !== panels.length) return () => {}

  const animated = anim !== 'none'
  let current = 0
  let layer = 1

  root.dataset.storyEnhanced = 'true'

  gsap.set(stage, { autoAlpha: 0 })
  gsap.set(stage[0]!, { autoAlpha: 1, zIndex: layer })
  if (animated) {
    gsap.set(
      bodies.filter((body): body is HTMLElement => body !== null),
      { opacity: DIM },
    )
    if (bodies[0]) gsap.set(bodies[0], { opacity: 1 })
  }

  const swap = (next: number) => {
    const incoming = stage[next]!
    const outgoing = stage[current]!
    layer += 1
    gsap.killTweensOf([incoming, outgoing])

    if (!animated) {
      gsap.set(outgoing, { autoAlpha: 0 })
      gsap.set(incoming, { autoAlpha: 1, zIndex: layer })
      return
    }

    // Tidak ada dua gambar yang menumpuk lama: yang bukan aktif selalu berakhir tersembunyi.
    const settle = () => {
      stage.forEach((item, i) => {
        if (i !== current) gsap.set(item, { autoAlpha: 0 })
      })
    }

    if (anim === 'reveal') {
      gsap.fromTo(
        incoming,
        { autoAlpha: 1, zIndex: layer, clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut', onComplete: settle },
      )
      return
    }

    const from =
      anim === 'zoom' ? { autoAlpha: 0, scale: 1.1 } : anim === 'parallax' ? { autoAlpha: 0, y: 48 } : { autoAlpha: 0 }
    gsap.set(incoming, { zIndex: layer })
    gsap.fromTo(incoming, from, { autoAlpha: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out', onComplete: settle })
    gsap.to(outgoing, { autoAlpha: 0, duration: 0.9, ease: 'power2.out' })
  }

  const activate = (next: number) => {
    if (next === current) return
    swap(next)
    current = next
    if (animated) {
      bodies.forEach((body, i) => {
        if (body) gsap.to(body, { opacity: i === next ? 1 : DIM, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
      })
    }
  }

  panels.forEach((panel, i) => {
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) activate(i)
      },
    })
  })

  return () => {
    delete root.dataset.storyEnhanced
  }
}

export function setupStoryMotion(): () => void {
  const roots = all(document, '[data-story]')
  if (roots.length === 0) return () => {}

  gsap.registerPlugin(ScrollTrigger)

  // Teks dan media: semua ukuran layar.
  const ctx = gsap.context(() => {
    for (const root of roots) {
      const anim = animationOf(root)
      if (anim !== 'none') setupIntro(root, anim)
      root.dataset.storyReady = 'true'
    }
  }, document.body)

  // Panggung menempel: hanya layar md ke atas. Di bawah itu tampilannya daftar biasa.
  const mm = gsap.matchMedia()
  mm.add(STICKY_QUERY, () => {
    const undo = roots
      .filter((root) => root.dataset.storyPreset === 'sticky')
      .map((root) => setupSticky(root, animationOf(root)))
    return () => undo.forEach((fn) => fn())
  })

  // Tinggi halaman bisa bergeser setelah font/gambar termuat; hitung ulang posisi pemicu sekali.
  const frame = requestAnimationFrame(() => ScrollTrigger.refresh())

  return () => {
    cancelAnimationFrame(frame)
    mm.revert()
    ctx.revert()
    for (const root of roots) {
      delete root.dataset.storyReady
      delete root.dataset.storyEnhanced
    }
  }
}
