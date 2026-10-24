import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { navigation, profile } from '@/data/profile'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const toggle = useRef<HTMLButtonElement>(null)
  const container = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
    }, { rootMargin: '-15% 0px -55% 0px' })
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() }
    }
    function outside(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    const close = () => setOpen(false)
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    desktop.addEventListener('change', close)
    return () => {
      document.removeEventListener('keydown', escape)
      document.removeEventListener('pointerdown', outside)
      desktop.removeEventListener('change', close)
    }
  }, [open])

  return (
    <header className="site-header" ref={container}>
      <div className="container nav-inner">
        <a href="#home" className="wordmark" aria-label="Zaneth, back to home" onClick={() => setOpen(false)}>
          <svg width="25" height="24" viewBox="0 0 25 24" fill="currentColor" aria-hidden="true">
            <path d="M2 3h5v3h11V3h5v17H2V3Zm5 8v4h3v-4H7Zm9 0v4h3v-4h-3Zm-6 6v2h6v-2h-6Z" />
          </svg>
          zaneth<span className="wordmark-dot">.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.slice(0, 3).map((link) => <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined}>{link.label}</a>)}
        </nav>
        <a href="#contact" className="nav-contact">Let’s talk <ArrowUpRight size={16} /></a>
        <button ref={toggle} className="menu-toggle icon-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>
          <span className="menu-glyph" aria-hidden="true"><span /><span /><span /></span>
        </button>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        {navigation.map((link) => <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={17} /></a>)}
        <a href={profile.resume} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>View résumé<ArrowUpRight size={17} /></a>
      </nav>
    </header>
  )
}
