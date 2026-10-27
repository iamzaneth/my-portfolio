import { useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Skills from '@/sections/Skills'
import Projects from '@/sections/Projects'
import Contact from '@/sections/Contact'
import { usePortfolioMotion } from '@/animations/usePortfolioMotion'
import { CompanionContext } from '@/features/mascot/companionContext'

export default function App() {
  const scope = usePortfolioMotion()
  const [discovery, discover] = useState('')
  const companion = useMemo(() => ({ discovery, discover }), [discovery])
  return (
    <CompanionContext value={companion}>
      <div ref={scope} className="portfolio">
        <a className="skip-link fixed top-3 left-4 z-100 -translate-y-[160%] bg-accent px-[18px] py-3 text-bg
          [clip-path:inset(100%)] focus:translate-y-0 focus:[clip-path:none]" href="#main">Skip to content</a>
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
      </div>
    </CompanionContext>
  )
}
