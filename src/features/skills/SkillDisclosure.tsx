import { useId, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { motion } from '@/animations/motion'

export default function SkillDisclosure({ title, children }: { title: string; children: string }) {
  const details = useRef<HTMLDetailsElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const playback = useRef<Animation | null>(null)
  const desired = useRef(false)
  const [expanded, setExpanded] = useState(false)
  const reducedMotion = useMotionPreference()
  const id = useId()

  useLayoutEffect(() => {
    if (reducedMotion && playback.current && details.current && body.current) {
      playback.current.cancel()
      playback.current = null
      details.current.open = desired.current
      body.current.style.height = ''
    }
    return () => { playback.current?.cancel() }
  }, [reducedMotion])

  function toggle(event: MouseEvent<HTMLElement>) {
    event.preventDefault()
    const element = details.current
    const content = body.current
    if (!element || !content) return
    const next = !desired.current
    desired.current = next
    setExpanded(next)
    // Capture the painted height before canceling a prior interaction.
    const from = content.getBoundingClientRect().height
    playback.current?.cancel()
    element.open = true
    if (reducedMotion) {
      element.open = next
      content.style.height = ''
      playback.current = null
      return
    }
    content.style.height = `${from}px`
    const to = next ? content.scrollHeight : 0
    const animation = content.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: motion.component * 1000,
      easing: getComputedStyle(element).getPropertyValue('--ease-out').trim() || 'ease-out',
    })
    playback.current = animation
    animation.onfinish = () => {
      if (playback.current !== animation) return
      element.open = next
      content.style.height = ''
      playback.current = null
    }
  }

  return <details className="skill-practice" ref={details}>
    <summary aria-expanded={expanded} aria-controls={id} onClick={toggle}>In practice<span className="sr-only">: {title}</span><ChevronDown size={16} aria-hidden="true" /></summary>
    <div className="skill-practice-body" ref={body} id={id}><p>{children}</p></div>
  </details>
}
