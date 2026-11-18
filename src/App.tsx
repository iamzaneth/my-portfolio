import Navbar from '@/components/Navbar'
import { useChapterNavigation } from '@/features/chapters/useChapterNavigation'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Skills from '@/sections/Skills'
import Projects from '@/sections/Projects'
import Contact from '@/sections/Contact'
import { usePortfolioMotion } from '@/animations/usePortfolioMotion'
import UniverseProvider from '@/features/universe/UniverseProvider'
import UniverseViewport from '@/features/universe/UniverseViewport'
import { projects } from '@/data/projects'
import CometCursor from '@/features/cursor/CometCursor'

export default function App() {
  const activeChapter = useChapterNavigation()
  const scope = usePortfolioMotion()
  return (
    <UniverseProvider projects={projects}>
      <div ref={scope} className="portfolio">
        <a className="skip-link fixed top-3 left-4 z-100 -translate-y-[160%] bg-accent px-[18px] py-3 text-bg
          [clip-path:inset(100%)] focus:translate-y-0 focus:[clip-path:none]" href="#main">Skip to content</a>
        <Navbar active={activeChapter} />
        <CometCursor />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <UniverseViewport chapter={activeChapter} />
      </div>
    </UniverseProvider>
  )
}
