import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ArrowUpRight, Check, Copy, Github, MapPin, Phone } from 'lucide-react'
import { profile } from '@/data/profile'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setCopyError(false)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2500)
    } catch { setCopyError(true) }
  }
  return (
    <section id="contact" className="contact-section border-t border-line bg-bg-subtle pt-12 max-md:pt-10">
      <div className="page-container">
        <div className="contact-top flex flex-col items-start gap-5 max-md:gap-[18px] [&>.eyebrow]:m-0" data-reveal><p className="eyebrow"><span>04 /</span> THE NEXT CHAPTER</p><span className="availability flex items-center gap-2.5 font-mono text-[14px] leading-[1.6] text-[#c5cfe0]"><span className="status-dot" /> Open to opportunities</span></div>
        <div className="contact-heading mt-4 [&_h2]:text-[clamp(42px,5.7vw,79px)] [&_h2]:leading-[1.17] [&_h2]:font-[550]
          [&_h2]:tracking-[-3.6px] max-md:[&_h2]:text-[clamp(35px,7vw,54px)] max-md:[&_h2]:tracking-[-1.8px]
          max-tiny:[&_h2]:text-[32px]" data-reveal>
          <h2>Good things start<br />
            <span className="contact-last-line inline-flex max-w-full items-center gap-6 align-top max-md:gap-4">
              <span>with a <span className="text-accent">hello.</span></span>
              <a href={`mailto:${profile.email}`} className="contact-arrow grid size-16 shrink-0 place-items-center rounded-full border border-[#6b5a83] text-accent
                transition-[background,transform] duration-250 ease-[ease] hover:bg-surface-accent
                hover:[transform:rotate(8deg)] motion-reduce:hover:transform-none max-md:size-11 max-md:[&>svg]:size-6" aria-label="Send Phuc an email"><ArrowUpRight size={30} strokeWidth={1.4} /></a>
            </span>
          </h2>
        </div>
        <p className="contact-description my-[18px] text-[14px] leading-[1.9] text-muted max-md:text-[13px]" data-reveal>Have an interesting problem, an opportunity, or a shared curiosity?<br />I’d love to hear about it.</p>
        <div className="contact-email-row flex flex-wrap items-center gap-3.5 max-md:gap-[5px]" data-reveal><a className="contact-email min-w-0 border-b border-[#746287] py-[7px] text-[clamp(16px,calc(2.3vw+2px),27px)]
          font-[450] tracking-[-.5px] [overflow-wrap:anywhere] transition-colors duration-200 ease-[ease]
          hover:text-accent max-md:text-[clamp(15px,calc(3.7vw+2px),24px)] max-md:tracking-[-.3px]
          max-tiny:text-[15px]" href={`mailto:${profile.email}`}>{profile.email}</a><button type="button" className="icon-button copy-email border-0 max-md:w-[38px] max-md:min-w-[38px]" onClick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy email address'}>{copied ? <Check size={18} /> : <Copy size={18} />}</button><span className="copy-status font-mono text-[12px] text-cyan" role="status">{copied ? 'Copied!' : copyError ? 'Please use the email link.' : ''}</span></div>
        <div className="contact-details mt-5 mb-7 flex flex-wrap gap-x-7 gap-y-3.5 text-[12px] text-muted max-md:mt-[18px]
          max-md:mb-[22px] max-md:gap-x-[21px] max-md:gap-y-[5px] [&>a]:flex [&>a]:min-h-11 [&>a]:items-center
          [&>a]:gap-[7px] [&>span]:flex [&>span]:min-h-11 [&>span]:items-center [&>span]:gap-[7px]
          [&>a:hover]:text-accent max-md:[&>span]:basis-full" data-reveal><span><MapPin size={15} /> {profile.location}</span><a href={profile.phoneHref}><Phone size={15} /> {profile.phone}</a><a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a><a href={profile.facebook} target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={13} /></a>{profile.showResume && <a href={profile.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={13} /></a>}</div>
        <footer className="footer flex items-center gap-6 border-t border-line py-4 text-[11px] text-faint max-desktop:gap-[15px]
          max-md:flex-wrap max-md:gap-x-[15px] max-md:gap-y-[7px] max-md:py-3.5 max-md:[&>span]:text-[10px]"><a className="footer-brand mr-2 text-[19px] font-[750] tracking-[-.8px] text-foreground" href="#home">zaneth<span className="text-accent">.</span></a><span>© {new Date().getFullYear()} Tran Thien Phuc</span><span className="footer-built ml-auto font-mono text-[10px] max-desktop:text-[9px] max-tablet:hidden">Built with curiosity & a little cat energy.</span><a className="back-top ml-[22px] flex min-h-11 items-center gap-2 text-muted hover:text-accent max-tablet:ml-auto
          max-md:text-[10px] max-tiny:ml-0" href="#home">Back to top <ArrowUp size={15} /></a></footer>
      </div>
    </section>
  )
}
