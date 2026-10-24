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
      <a className="skip-link" href="#main">Skip to content</a>
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
