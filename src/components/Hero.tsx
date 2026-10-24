import { ArrowDown, ArrowDownRight, ArrowUpRight, Github, MapPin } from 'lucide-react'
import { profile } from '@/data/profile'
import MascotScene from '@/features/mascot/MascotScene'

export default function Hero() {
  return (
    <section id="home" className="hero relative">
      <div className="page-container hero-grid grid grid-cols-[1.14fr_1fr] items-center gap-5 pt-11 pb-7 wide:gap-14 wide:pt-14
        wide:pb-8 max-desktop:gap-0 max-desktop:pt-9 max-desktop:pb-6 max-md:grid-cols-1 max-md:gap-2 max-md:pt-6
        max-md:pb-2">
        <div className="hero-text">
          <div className="hero-eyebrow flex items-center gap-[11px] font-mono text-[12px] text-muted max-tablet:gap-2
            max-tablet:text-[10px] max-md:gap-[9px] max-tiny:gap-[7px] max-tiny:text-[9px]"><span className="status-dot" /> Open to opportunities <span className="eyebrow-divider mx-1 h-3 w-px bg-line" /> Based in Vietnam</div>
          <p className="hero-intro mt-7 mb-[13px] tracking-[2.6px] max-tablet:tracking-[2px] max-md:mt-[22px] max-md:text-[11px]
            max-tiny:text-[10px] hero-eyebrow flex items-center gap-[11px] font-mono text-[12px] text-muted
            max-tablet:gap-2 max-tablet:text-[10px] max-md:gap-[9px] max-tiny:gap-[7px] max-tiny:text-[9px]">HELLO, WORLD. I’M</p>
          <h1 className="mb-5 -ml-1 text-[clamp(60px,6.6vw,96px)] leading-[1.09] font-[650] tracking-[-5.5px] wide:text-[108px]
            max-desktop:text-[76px] max-tablet:text-[65px] max-tablet:tracking-[-4px]
            max-md:text-[clamp(60px,11.8vw,88px)] max-md:tracking-[-3.8px] max-tiny:text-[55px]
            max-tiny:tracking-[-3.5px]"><span className="name-line block overflow-hidden pb-[5px] -mb-[5px] [&>span]:inline-block [&>span]:origin-bottom-left"><span>Tran Thien</span></span><span className="name-line block overflow-hidden pb-[5px] -mb-[5px] [&>span]:inline-block [&>span]:origin-bottom-left"><span>Phuc<span className="text-accent">.</span><span className="name-alias ml-[23px] align-middle font-mono text-[13px] font-normal tracking-[2px] text-faint
            max-desktop:ml-3.5 max-desktop:text-[11px] max-tablet:ml-2.5 max-tablet:text-[10px]
            max-tablet:tracking-[1px] max-md:ml-[17px] max-md:text-[11px] max-md:tracking-[1.5px] max-tiny:ml-[11px]
            max-tiny:text-[10px]"> / ZANETH</span></span></span></h1>
          <div className="hero-copy">
            <p className="hero-specialty mb-[15px] text-[22px] leading-[1.55] font-medium tracking-[-.4px] max-tablet:text-[20px]
              max-md:mb-3.5 max-md:text-[21px]">Engineering intelligence.<br />Connecting the <span className="text-accent">data dots.</span></p>
            <p className="hero-description max-w-[410px] text-[16px] leading-[1.9] text-muted wide:max-w-[435px]
              max-desktop:max-w-[340px] max-md:max-w-[370px] max-md:text-[14px]">A Data Engineering student exploring AI, building data systems, and turning curiosity into things that work.</p>
          </div>
          <div className="hero-actions mt-[22px] flex flex-wrap gap-3 max-md:mt-5 max-md:gap-2.5 [&>.button]:max-tablet:gap-2.5
            [&>.button]:max-tablet:px-[15px] [&>.button]:max-tablet:text-[12px] [&>.button]:max-md:gap-3
            [&>.button]:max-md:px-[18px] [&>.button]:max-md:text-[13px] [&>.button]:max-tiny:gap-[9px]
            [&>.button]:max-tiny:px-[13px] [&>.button]:max-tiny:text-[12px]">
            <a className="button bg-accent text-[#151024] hover:bg-[#c6afff]" href="#projects">Explore my work <ArrowDownRight size={18} /></a>
            {profile.showResume && <a className="button border-line bg-surface text-foreground hover:border-accent hover:bg-surface-raised" href={profile.resume} target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={17} /></a>}
          </div>
          <div className="hero-socials mt-3 flex items-center gap-4 text-[12px] text-faint max-tablet:gap-2.5
            max-tablet:text-[10px] max-md:gap-3 max-tiny:gap-[9px] max-tiny:text-[9px] [&>a]:flex [&>a]:min-h-11
            [&>a]:items-center [&>a]:gap-2 [&>a]:text-muted [&>a]:transition-colors [&>a]:duration-200
            [&>a]:ease-[ease] [&>a:hover]:text-foreground [&>span:last-child_.text-accent]:mx-[3px]"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={13} /></a><span className="tiny-divider h-[13px] w-px bg-line" /><span>AI Engineering <span className="text-accent">×</span> Data Engineering</span></div>
        </div>
        <MascotScene />
      </div>
      <div className="page-container hero-bottom flex items-center justify-between gap-5 pb-3 max-md:mt-2 max-md:pb-2.5">
        <a href="#about" className="scroll-cue inline-flex min-h-11 items-center gap-3 font-mono text-[11px] tracking-[1.1px] text-faint
          max-md:text-[10px] max-md:tracking-[.8px]"><span className="scroll-icon flex h-7 w-5 items-center justify-center rounded-[9px] border border-line text-accent"><ArrowDown size={14} /></span> A LITTLE SCROLL, A LOT TO DISCOVER</a>
        <span className="location-note flex items-center gap-2 font-mono text-[11px] text-faint max-md:hidden"><MapPin size={13} /> {profile.location}</span>
      </div>
      <div className="discipline-strip border-y border-line bg-bg-subtle py-3.5 [&>div]:flex [&>div]:items-center
        [&>div]:justify-between [&>div]:gap-5 [&_span]:font-mono [&_span]:text-[12px] [&_span]:tracking-[1.8px]
        [&_span]:whitespace-nowrap [&_span]:text-muted [&_i]:text-[17px] [&_i]:not-italic [&_i]:text-accent
        max-tablet:[&>div]:gap-2.5 max-tablet:[&_span]:text-[10px] max-tablet:[&_span]:tracking-[1px]
        max-md:[&>div]:flex-wrap max-md:[&>div]:justify-start max-md:[&>div]:gap-x-[17px]
        max-md:[&>div]:gap-y-2.5 max-md:[&_span]:text-[9px] max-md:[&_span]:tracking-[1.1px]
        max-md:[&_i]:text-[13px] max-md:[&_span:nth-of-type(n+3)]:hidden max-md:[&_i:nth-of-type(n+3)]:hidden" aria-label="Areas of interest"><div className="page-container"><span>DATA SYSTEMS</span><i>✳</i><span>APPLIED AI</span><i>✳</i><span>CURIOUS BY DEFAULT</span><i>✳</i><span>BUILT WITH INTENTION</span><i>✳</i></div></div>
    </section>
  )
}
