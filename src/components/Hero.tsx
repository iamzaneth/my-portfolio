import { ArrowDown, ArrowDownRight, ArrowUpRight, Github, MapPin } from 'lucide-react'
import { profile } from '@/data/profile'
import MascotScene from '@/features/mascot/MascotScene'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-text">
          <div className="hero-eyebrow"><span className="status-dot" /> Open to opportunities <span className="eyebrow-divider" /> Based in Vietnam</div>
          <p className="hero-intro hero-eyebrow">HELLO, WORLD. I’M</p>
          <h1><span className="name-line"><span>Tran Thien</span></span><span className="name-line"><span>Phuc<span className="accent">.</span><span className="name-alias"> / ZANETH</span></span></span></h1>
          <div className="hero-copy">
            <p className="hero-specialty">Engineering intelligence.<br />Connecting the <span className="accent">data dots.</span></p>
            <p className="hero-description">A Data Engineering student exploring AI, building data systems, and turning curiosity into things that work.</p>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">Explore my work <ArrowDownRight size={18} /></a>
            <a className="button button-secondary" href={profile.resume} target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={17} /></a>
          </div>
          <div className="hero-socials"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={13} /></a><span className="tiny-divider" /><span>AI Engineering <span className="accent">×</span> Data Engineering</span></div>
        </div>
        <MascotScene />
      </div>
      <div className="container hero-bottom">
        <a href="#about" className="scroll-cue"><span className="scroll-icon"><ArrowDown size={14} /></span> A LITTLE SCROLL, A LOT TO DISCOVER</a>
        <span className="location-note"><MapPin size={13} /> {profile.location}</span>
      </div>
      <div className="discipline-strip" aria-label="Areas of interest"><div className="container"><span>DATA SYSTEMS</span><i>✳</i><span>APPLIED AI</span><i>✳</i><span>CURIOUS BY DEFAULT</span><i>✳</i><span>BUILT WITH INTENTION</span><i>✳</i></div></div>
    </section>
  )
}
