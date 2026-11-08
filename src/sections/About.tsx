import MobileOrbit from '@/features/cosmic/MobileOrbit'
import FeaturedConstellation from '@/features/cosmic/FeaturedConstellation'
import CosmicBackground from '@/features/cosmic/CosmicBackground'
import { ArrowDownRight } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import IdentityCard3D from '@/features/identity/IdentityCard3D'
import { profile } from '@/data/profile'

export default function About() {
  return (
    <section id="about" className="section-space about-section">
      <CosmicBackground world="about" />
      <div className="page-container">
        <div className="atlas-intro">
        <SectionHeading number="02" label="THE PERSON BEHIND THE PIXELS">Curiosity is my<br /><span className="text-faint">starting point.</span></SectionHeading>
        <FeaturedConstellation world="about" />
        <MobileOrbit world="about" />
        </div>
        <div className="about-grid">
          <div className="identity-reveal" data-reveal><IdentityCard3D /></div>
          <div className="about-copy" data-reveal>
            <p className="about-lead">I’m Phuc, a <strong>{profile.role}</strong> at <strong>{profile.university}</strong>, drawn to the space where data, mathematics, and software meet.</p>
            <p>I enjoy following data from its raw beginnings to something useful: a reliable pipeline, a clear visualization, or an intelligent system. My focus is on <strong>AI Engineering and Data Engineering</strong>, with data analysis as a foundation for asking better questions.</p>
            <div className="about-current"><span>Currently exploring</span><p>Right now, I’m building practical systems with Python, SQL, and streaming technologies while deepening my understanding of machine learning and applied mathematics.</p></div>
            <a className="text-link [&:hover>svg]:[transform:translate(3px,3px)]" href="#skills">Meet my toolkit <ArrowDownRight size={17} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
