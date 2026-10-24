import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import { usePortfolioMotion } from '@/animations/usePortfolioMotion'

export default function App() {
  const scope = usePortfolioMotion()
  return (
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
  )
}
