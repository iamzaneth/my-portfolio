import { ArrowUpRight, MapPin } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { profile } from '@/data/profile'

export default function About() {
  return (
    <section id="about" className="section container about-section">
      <SectionHeading number="01" label="THE PERSON BEHIND THE PIXELS">Curiosity is my<br /><span className="text-muted">starting point.</span></SectionHeading>
      <div className="about-grid">
        <div className="profile-card" data-reveal>
          <div className="profile-card-top"><span className="mono">a little about me</span><span className="pixel-cross" aria-hidden="true">✳</span></div>
          <div className="profile-person"><img src="/avatar.webp" width="80" height="80" loading="lazy" alt="Zaneth’s illustrated profile avatar" /><div><h3>{profile.name}</h3><span>AKA ZANETH</span></div></div>
          <p>I like understanding how things work.<br />Then figuring out how to make them better.</p>
          <div className="profile-location"><MapPin size={15} /> Ho Chi Minh City, Vietnam</div>
          <div className="profile-code"><span>const</span> mindset = <span className="code-string">'keep learning'</span>;</div>
        </div>
        <div className="about-copy" data-reveal>
          <p>I’m Phuc, a <strong>Data Engineering student</strong> drawn to the space where data, mathematics, and software meet.</p>
          <p>I enjoy following data from its raw beginnings to something useful: a reliable pipeline, a clear visualization, or an intelligent system. My focus is on <strong>AI Engineering and Data Engineering</strong>, with data analysis as a foundation for asking better questions.</p>
          <p>Right now, I’m building practical systems with Python, SQL, and streaming technologies while deepening my understanding of machine learning and applied mathematics.</p>
          <a className="text-link" href="#skills">Meet my toolkit <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </section>
  )
}
