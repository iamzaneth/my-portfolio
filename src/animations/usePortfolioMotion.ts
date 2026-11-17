import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function usePortfolioMotion() {
  const scope = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add({ allowed:'(prefers-reduced-motion: no-preference)', chapters:'(min-width:1024px) and (min-height:600px)' }, context => {
      if(!context.conditions?.allowed)return
      const chapters=Boolean(context.conditions.chapters)
      gsap.from('.hero-intro, .hero h1, .hero-copy, .hero-actions, .hero-socials', {
        y: 18, opacity: 0, stagger: .08, duration: .8, ease: 'power3.out', clearProps: 'transform,opacity',
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
        gsap.from(element, {
          y: chapters ? 0 : 22, opacity: 0, duration: .7, ease: 'power3.out', clearProps: 'transform,opacity',
          scrollTrigger: { trigger: chapters ? element.closest('section') : element, start: 'top 94%', once: true },
        })
      })
    })
    return () => media.revert()
  }, { scope })
  return scope
}
