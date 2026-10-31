import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { navigation, profile } from '@/data/profile'

const mobileLinkClass = `group/link flex min-h-12 items-center justify-between rounded px-2.5 text-[16px] text-muted
          transition-[background,color,transform,box-shadow] duration-200 ease-[ease]
          aria-[current]:bg-surface-accent aria-[current]:text-accent hover:bg-surface-accent-hover
          hover:text-accent hover:shadow-[inset_3px_0_var(--accent)] hover:[transform:translateX(3px)]
          focus-visible:bg-surface-accent-hover focus-visible:text-accent
          focus-visible:shadow-[inset_3px_0_var(--accent)] focus-visible:[transform:translateX(3px)]
          active:bg-surface-accent-pressed active:text-foreground active:[transform:translateX(3px)_scale(.985)]
          [&>svg]:text-accent [&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-[ease]
          hover:[&>svg]:[transform:translate(2px,-2px)] focus-visible:[&>svg]:[transform:translate(2px,-2px)]`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const sentinel = useRef<HTMLSpanElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const container = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    if (sentinel.current) observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [])

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
    <><span ref={sentinel} className="nav-sentinel" aria-hidden="true" />
    <header className="site-header sticky top-0 z-50 h-[87px] max-md:h-[72px]" data-scrolled={scrolled} data-menu-open={open} ref={container}>
      <div className="page-container nav-inner flex h-full items-center justify-between gap-[25px]">
        <a href="#home" className="wordmark inline-flex items-center text-[25px] font-extrabold tracking-[-1px] max-md:text-[23px]
          [&>svg]:mr-3 [&>svg]:w-[22px] [&>svg]:text-accent max-md:[&>svg]:mr-2.5 max-md:[&>svg]:w-5" aria-label="Zaneth, back to home" onClick={() => setOpen(false)}>
          <svg width="25" height="24" viewBox="0 0 25 24" fill="currentColor" aria-hidden="true">
            <path d="M2 3h5v3h11V3h5v17H2V3Zm5 8v4h3v-4H7Zm9 0v4h3v-4h-3Zm-6 6v2h6v-2h-6Z" />
          </svg>
          zaneth<span className="text-accent">.</span>
        </a>
        <nav className="desktop-nav ml-auto mr-[11px] flex items-center gap-8 max-md:hidden" aria-label="Main navigation">
          {navigation.slice(0, 3).map((link) => <a className="relative py-[15px] text-[14px] text-muted transition-colors duration-200 ease-[ease]
            hover:text-foreground aria-[current]:text-foreground after:absolute after:bottom-[3px]
            after:left-[calc(50%-2px)] after:size-1 after:rounded-full after:bg-accent after:opacity-0
            after:transition-opacity after:duration-200 after:ease-[ease] aria-[current]:after:opacity-100" key={link.id} href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined}>{link.label}</a>)}
        </nav>
        <a href="#contact" className="nav-contact flex items-center gap-[21px] rounded border border-line px-4 py-[11px] text-[13px]
          transition-[border-color] duration-200 ease-[ease] hover:border-accent max-md:hidden [&>svg]:text-accent">Let’s talk <ArrowUpRight size={16} /></a>
        <button ref={toggle} className="menu-toggle group/menu ml-auto hidden max-md:flex max-md:border-0 icon-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>
          <span className="menu-glyph" aria-hidden="true"><span /><span /><span /></span>
        </button>
      </div>
      <nav id="mobile-navigation" className="mobile-nav absolute inset-x-0 top-[71px] hidden border-b border-line bg-surface px-[22px] pt-4 pb-5
        shadow-[0_20px_30px_#00000025] max-md:grid" aria-label="Mobile navigation" hidden={!open}>
        {navigation.map((link) => <a className={mobileLinkClass} key={link.id} href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={17} /></a>)}
        {profile.showResume && <a className={mobileLinkClass} href={profile.resume} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>View résumé<ArrowUpRight size={17} /></a>}
      </nav>
    </header></>
  )
}
