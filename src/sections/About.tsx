import { ArrowDownRight, MapPin } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { profile } from '@/data/profile'

export default function About() {
  return (
    <section id="about" className="section-space page-container about-section">
      <SectionHeading number="01" label="THE PERSON BEHIND THE PIXELS">Curiosity is my<br /><span className="text-faint">starting point.</span></SectionHeading>
      <div className="about-grid">
        <div className="profile-card" data-reveal>
          <div className="profile-card-top"><span>Developer field card</span>
            <svg className="profile-spark" width="36" height="36" viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
              <path d="M16 4h4v8h4v4h8v4h-8v4h-4v8h-4v-8h-4v-4H4v-4h8v-4h4V4Z" />
              <path d="M29 2h3v3h3v3h-3v3h-3V8h-3V5h3V2Z" className="text-cyan" />
            </svg>
          </div>
          <div className="profile-person">
            <img src="/avatar.webp" width="96" height="96" loading="lazy" alt="Portrait of Tran Thien Phuc" />
            <div><h3>{profile.name}</h3><span>aka {profile.alias}</span></div>
          </div>
          <p className="profile-mindset">I like understanding how things work.<br />Then figuring out how to make them better.</p>
          <div className="profile-location"><MapPin size={16} aria-hidden="true" /> {profile.location}</div>
          <dl className="profile-fields">
            <div className="profile-focus"><dt>Focus</dt><dd>AI & data systems</dd></div>
            <div><dt>Approach</dt><dd>Learn. Build.<br />Understand.</dd></div>
            <div><dt>Exploring</dt><dd>Streaming infrastructure<br />& intelligent applications</dd></div>
          </dl>
          <p className="profile-code"><span>const</span> mindset = <span className="code-string">'keep learning'</span>;</p>
        </div>
        <div className="about-copy" data-reveal>
          <p className="about-lead">I’m Phuc, a <strong>Data Engineering student</strong> drawn to the space where data, mathematics, and software meet.</p>
          <p>I enjoy following data from its raw beginnings to something useful: a reliable pipeline, a clear visualization, or an intelligent system. My focus is on <strong>AI Engineering and Data Engineering</strong>, with data analysis as a foundation for asking better questions.</p>
          <div className="about-current"><span>Currently exploring</span><p>Right now, I’m building practical systems with Python, SQL, and streaming technologies while deepening my understanding of machine learning and applied mathematics.</p></div>
          <a className="text-link [&:hover>svg]:[transform:translate(3px,3px)]" href="#skills">Meet my toolkit <ArrowDownRight size={17} /></a>
        </div>
      </div>
    </section>
  )
}
