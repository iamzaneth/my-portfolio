import MobileOrbit from '@/features/cosmic/MobileOrbit'
import CosmicBackground from '@/features/cosmic/CosmicBackground'
import { ArrowDown, ArrowDownRight, ArrowUpRight, Github } from 'lucide-react'
import { profile } from '@/data/profile'
import MascotScene from '@/features/mascot/MascotScene'

export default function Hero() {
  return <section id="home" className="hero relative">
      <CosmicBackground world="home" />
    <div className="page-container hero-grid">
      <div className="hero-text">
        <div className="hero-eyebrow"><span className="status-dot" /> Open to opportunities <span className="eyebrow-divider" /> Based in Vietnam</div>
        <p className="hero-intro hero-eyebrow">TRAN THIEN PHUC <span className="text-accent">/ ZANETH</span></p>
        <h1><span className="name-line"><span>Engineering</span></span>{' '}<span className="name-line"><span className="text-accent">intelligence.</span></span></h1>
        <div className="hero-copy">
          <p className="hero-role">AI ENGINEERING <span aria-hidden="true">/</span> DATA ENGINEERING</p>
          <p className="hero-specialty">Connecting the data dots.</p>
          <p className="hero-description">I’m Phuc, a Software Engineering student exploring reliable data pipelines, intelligent systems, and the software that connects them.</p>
        </div>
        <div className="hero-actions">
          <a className="button bg-accent text-accent-ink hover:bg-accent-hover" href="#projects">Explore my work <ArrowDownRight size={18} /></a>
          <a className="button hero-contact border-line text-foreground hover:border-accent" href="#contact">Get in touch <ArrowUpRight size={17} /></a>
          {profile.showResume && <a className="button border-line" href={profile.resume} target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={17} /></a>}
        </div>
        <div className="hero-socials"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={13} /></a><span>Curiosity → code → understanding.</span></div>
        <MobileOrbit world="home" />
      </div>
      <MascotScene />
    </div>
    <div className="page-container hero-bottom"><a href="#about" className="scroll-cue"><ArrowDown size={16} /> SCROLL TO EXPLORE</a><span className="hero-index">01 / HOME <span aria-hidden="true">✳</span> EST. IN CURIOSITY</span></div>
  </section>
}
