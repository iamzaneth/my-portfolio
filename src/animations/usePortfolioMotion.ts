import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function usePortfolioMotion() {
  const scope = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add({ allowMotion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, (context) => {
      if (!context.conditions?.allowMotion) return
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro.from('.hero-eyebrow', { y: 14, opacity: 0, duration: 0.55 })
        .from('.name-line > span', { yPercent: 110, rotate: 3, stagger: 0.13, duration: 0.95 }, '-=0.3')
        .from('.hero-copy, .hero-actions, .hero-socials', { y: 22, opacity: 0, stagger: 0.12, duration: 0.65 }, '-=0.6')
        .from('.mascot-scene', { scale: 0.88, opacity: 0, rotate: -4, duration: 1.1 }, 0.25)
        .from('.scene-note, .scene-tag', { y: 12, opacity: 0, stagger: 0.14, duration: 0.65 }, '-=0.4')
        .from('.hero-bottom', { opacity: 0, duration: 0.5 }, '-=0.3')

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 32, opacity: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 92%', once: true },
        })
      })
      gsap.utils.toArray<HTMLElement>('.skill-card').forEach((element, index) => {
        gsap.from(element, {
          y: 40, opacity: 0, duration: 0.75, delay: (index % 2) * 0.1,
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        })
      })
      gsap.utils.toArray<HTMLElement>('.project-visual').forEach((element) => {
        gsap.from(element, {
          clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.inOut',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        })
      })
      // Follow the scene's visible scroll range, including below the text on mobile.
      gsap.to('.scene-orbit', {
        rotate: 240, y: -24, ease: 'none',
        scrollTrigger: {
          trigger: '.mascot-scene', start: 'clamp(top bottom)', end: 'bottom top',
          scrub: 0.15, invalidateOnRefresh: true,
        },
      })
      if (context.conditions.desktop) {
        gsap.to('.pipeline-progress', {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: '#projects', start: 'top 85%', end: 'center 45%', scrub: 0.7 },
        })
      }
    })
    return () => media.revert()
  }, { scope })
  return scope
}
