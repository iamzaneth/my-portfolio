import { ArrowDown, ArrowDownRight, ArrowUpRight, Github } from 'lucide-react'
import { profile } from '@/data/profile'
import SceneSlot from '@/features/universe/SceneSlot'

export default function Hero() {
  return <section id="home" className="hero" aria-labelledby="hero-title">
    <div className="hero-grid page-container">
      <div className="hero-text" role="region" aria-label="Introduction">
        <p className="hero-intro"><span className="tiny-orbit" aria-hidden="true" /> TRAN THIEN PHUC <span>/ ZANETH</span></p>
        <h1 id="hero-title">Engineering<br /><span>intelligence.</span></h1>
        <div className="hero-copy">
          <p className="hero-role">AI ENGINEERING <span>/</span> DATA ENGINEERING</p>
          <p className="hero-description">Turning raw data into connected systems.<br className="desktop-break" /> Exploring what happens at the intersection<br className="desktop-break" /> of intelligence, engineering, and curiosity.</p>
          <p className="hero-student">{profile.role} · {profile.location}</p>
        </div>
        <div className="hero-actions">
          <a className="button primary-button" href="#projects">Explore projects <ArrowDownRight size={17} /></a>
          <a className="button secondary-button" href="#contact">Get in touch <ArrowUpRight size={17} /></a>
        </div>
        <div className="hero-socials"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={12} /></a><span><i className="status-dot" /> Open to opportunities</span></div>
      </div>
      <div className="hero-universe">
        <SceneSlot mode="hero" />
        <a className="hero-universe-link" href="#projects"><span className="universe-link-glyph" aria-hidden="true">✧</span><span><small>EXPLORE THE CONNECTED SYSTEMS</small><strong>Every project. Its own world.</strong></span><ArrowDownRight size={17} /></a>
      </div>
    </div>
    <div className="hero-bottom page-container"><a href="#projects" className="scroll-cue"><ArrowDown size={14} /> SCROLL TO DISCOVER</a><span className="hero-bottom-note">ONE CONNECTED UNIVERSE. ALWAYS EXPANDING.</span><span className="hero-coordinate">HO CHI MINH CITY, VN</span></div>
  </section>
}
