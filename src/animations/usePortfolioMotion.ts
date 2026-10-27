import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from './motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function usePortfolioMotion() {
  const scope = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({ defaults: { ease: motion.ease } })
      intro.from('.scene-sky', { opacity: 0, duration: motion.entrance }, 0)
        .from('.hero-eyebrow', { y: 10, opacity: 0, stagger: 0.08, duration: motion.component }, 0.08)
        .from('.name-line > span', { yPercent: 105, rotate: 2, stagger: 0.1, duration: motion.entrance }, 0.18)
        .from('.hero-copy', { y: 18, opacity: 0, duration: motion.reveal }, 0.45)
        .from('.hero-actions, .hero-socials', { y: 14, opacity: 0, stagger: 0.1, duration: motion.component }, 0.65)
        .from('.cat-stage', { y: 18, opacity: 0, duration: motion.reveal }, 0.7)
        .from('.scene-note, .scene-tag, .cat-bubble', { y: 8, opacity: 0, stagger: 0.06, duration: motion.component }, 0.9)
        .from('.hero-bottom', { opacity: 0, duration: motion.component }, 1.05)

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        if (element.closest('.about-grid')) return
        gsap.from(element, {
          y: 26, opacity: 0, duration: motion.reveal, ease: motion.ease,
          scrollTrigger: { trigger: element, start: 'top 92%', once: true },
        })
      })
      gsap.from('.about-grid > [data-reveal]', {
        y: 26, opacity: 0, duration: motion.reveal, stagger: 0.08,
        scrollTrigger: { trigger: '.about-grid', start: 'top 92%', once: true },
      })
      gsap.utils.toArray<HTMLElement>('.skill-card').forEach((element, index) => {
        gsap.from(element, {
          y: 28, opacity: 0, duration: motion.reveal, delay: (index % 2) * 0.08,
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        })
      })
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((element) => {
        gsap.from(element, {
          y: 22, opacity: 0, duration: motion.reveal,
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
    })
    return () => media.revert()
  }, { scope })
  return scope
}
