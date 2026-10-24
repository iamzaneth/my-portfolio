import { ArrowUpRight, MapPin } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { profile } from '@/data/profile'

export default function About() {
  return (
    <section id="about" className="section-space page-container about-section">
      <SectionHeading number="01" label="THE PERSON BEHIND THE PIXELS">Curiosity is my<br /><span className="text-faint">starting point.</span></SectionHeading>
      <div className="about-grid grid grid-cols-[.88fr_1.12fr] items-center gap-12 max-desktop:gap-9 max-tablet:grid-cols-2
        max-tablet:gap-7 max-md:grid-cols-1 max-md:gap-6">
        <div className="profile-card relative overflow-hidden rounded-[7px] border border-line bg-surface px-7 pt-[25px]
          max-tablet:px-[22px] max-md:w-full max-md:max-w-[470px] max-md:px-6 max-md:pt-[23px] [&>p]:mt-[18px]
          [&>p]:mb-3.5 [&>p]:text-[14px] [&>p]:leading-[1.9] [&>p]:text-muted" data-reveal>
          <div className="profile-card-top flex items-center justify-between text-[11px] text-faint"><span className="font-mono">a little about me</span><span className="pixel-cross text-[23px] text-accent" aria-hidden="true">✳</span></div>
          <div className="profile-person mt-[18px] flex items-center gap-[17px] max-tablet:gap-3 [&>img]:size-[67px]
            [&>img]:rounded-[7px] [&>img]:border [&>img]:border-[#534360] [&>img]:object-cover
            max-tablet:[&>img]:size-[53px] max-md:[&>img]:size-[62px] [&_h3]:mb-1.5 [&_h3]:text-[17px]
            [&_h3]:font-semibold [&_h3]:tracking-[-.4px] max-tablet:[&_h3]:text-[16px] max-md:[&_h3]:text-[17px]
            max-tiny:[&_h3]:text-[15px] [&_span]:font-mono [&_span]:text-[11px] [&_span]:tracking-[1px]
            [&_span]:text-accent"><img src="/avatar.webp" width="80" height="80" loading="lazy" alt="Zaneth’s illustrated profile avatar" /><div><h3>{profile.name}</h3><span>AKA ZANETH</span></div></div>
          <p>I like understanding how things work.<br />Then figuring out how to make them better.</p>
          <div className="profile-location mb-[18px] flex items-center gap-2 text-[12px] text-faint"><MapPin size={15} /> Ho Chi Minh City, Vietnam</div>
          <div className="profile-code -mx-7 border-t border-line bg-bg-subtle px-7 py-3.5 font-mono text-[12px] text-muted
            max-tablet:-mx-[22px] max-tablet:px-[22px] max-tablet:text-[10px] max-md:-mx-6 max-md:px-6
            max-md:text-[12px] max-tiny:text-[10px] [&>span:first-child]:text-accent [&>.code-string]:text-cyan"><span>const</span> mindset = <span className="code-string">'keep learning'</span>;</div>
        </div>
        <div className="about-copy max-md:max-w-[550px] [&>p]:mb-3.5 [&>p]:text-[16px] [&>p]:leading-[1.85] [&>p]:text-muted
          [&>p:first-child]:text-[19px] [&>p:first-child]:leading-[1.75] [&>p:first-child]:tracking-[-.3px]
          [&>p:first-child]:text-[#c4cbd8] max-tablet:[&>p]:text-[14px] max-tablet:[&>p:first-child]:text-[16px]
          max-md:[&>p:first-child]:text-[18px] [&_strong]:font-medium [&_strong]:text-foreground" data-reveal>
          <p>I’m Phuc, a <strong>Data Engineering student</strong> drawn to the space where data, mathematics, and software meet.</p>
          <p>I enjoy following data from its raw beginnings to something useful: a reliable pipeline, a clear visualization, or an intelligent system. My focus is on <strong>AI Engineering and Data Engineering</strong>, with data analysis as a foundation for asking better questions.</p>
          <p>Right now, I’m building practical systems with Python, SQL, and streaming technologies while deepening my understanding of machine learning and applied mathematics.</p>
          <a className="text-link" href="#skills">Meet my toolkit <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </section>
  )
}
