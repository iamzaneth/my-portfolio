import { useEffect, useState, type RefObject } from 'react'

// Ambient illustrations run only while they can actually be seen.
export function useActivity(ref: RefObject<HTMLElement | null>) {
  const [onscreen, setOnscreen] = useState(false)
  const [visible, setVisible] = useState(() => !document.hidden)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnscreen(entry.isIntersecting), { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    const visibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [ref])
  return onscreen && visible
}
