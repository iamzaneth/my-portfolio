import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ArrowUpRight, Check, Copy, Facebook, FileText, Github, Mail, MapPin, Phone } from 'lucide-react'
import { profile } from '@/data/profile'

const socialLink = 'group inline-flex min-h-11 items-center gap-2.5 text-[14px] leading-6 font-medium text-muted transition-colors hover:text-accent'

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
    <section id="contact" aria-labelledby="contact-title" className="contact-section">
      <div className="page-container">
        <div className="contact-top mb-10 flex flex-wrap items-center justify-between gap-4 max-md:mb-8" data-reveal>
          <p className="eyebrow"><span>04 /</span> THE NEXT CHAPTER</p>
          <span className="availability inline-flex items-center gap-2.5 text-[12px] leading-5 text-muted">
            <span className="status-dot" aria-hidden="true" /> Open to opportunities
          </span>
        </div>
        <div className="contact-panel mb-12 grid grid-cols-[1.1fr_1fr] items-center gap-20 max-desktop:gap-10 max-md:mb-8 max-md:grid-cols-1 max-md:gap-8" data-reveal>
          <div className="contact-heading flex min-w-0 flex-col items-start">
            <h2 id="contact-title" className="text-[clamp(34px,3.5vw,48px)] leading-[1.25] font-[550] tracking-[-1.8px] max-md:text-[36px] max-tiny:text-[32px]">
              Good things start<br />
              <span className="inline-flex items-center gap-5 max-md:gap-4">
                <span>with a <span className="text-accent">hello.</span></span>
                <a href={`mailto:${profile.email}`} aria-label="Send Phuc an email"
                  className="contact-arrow grid size-14 shrink-0 place-items-center rounded-full bg-accent text-bg transition-[background,transform] duration-200 hover:-rotate-12 hover:bg-cyan motion-reduce:hover:transform-none max-md:size-11">
                  <ArrowUpRight size={27} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </span>
            </h2>
            <p className="contact-description mt-5 max-w-[360px] text-[14px] leading-7 text-muted">
              Have an interesting problem, an opportunity, or a shared curiosity? I’d love to hear about it.
            </p>
            <div className="mt-6 flex items-start gap-2.5 text-[14px] leading-6 text-muted">
              <MapPin size={17} className="mt-1 text-accent" aria-hidden="true" />
              <span>{profile.location}</span>
            </div>
          </div>
          <div className="contact-details min-w-0">
            <div className="contact-email-row flex min-w-0 items-center gap-4 border-b border-line py-5 max-tiny:gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/10 text-accent" aria-hidden="true"><Mail size={20} strokeWidth={1.5} /></span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-x-3 text-[12px] leading-5">
                  <span className="text-muted">Email</span>
                  <span className="copy-status text-cyan" role="status">{copied ? 'Copied!' : copyError ? 'Please use the email link.' : ''}</span>
                </div>
                <a href={`mailto:${profile.email}`} className="contact-email inline-block py-1 text-[14px] leading-6 font-semibold [overflow-wrap:anywhere] transition-colors hover:text-accent">{profile.email}</a>
              </div>
              <button type="button" className="copy-email grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-accent/10 hover:text-accent" onClick={copyEmail}
                aria-label={copied ? 'Email copied' : 'Copy email address'} title={copied ? 'Email copied' : 'Copy email address'}>
                {copied ? <Check size={17} className="text-cyan" /> : <Copy size={17} />}
              </button>
            </div>
            <a href={profile.phoneHref} className="group flex items-center gap-4 border-b border-line py-5 max-tiny:gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/10 text-accent"><Phone size={20} strokeWidth={1.5} aria-hidden="true" /></span>
              <span className="flex min-w-0 flex-1 flex-col gap-1"><span className="text-[12px] leading-5 text-muted">Phone</span><span className="py-1 text-[14px] leading-6 font-semibold transition-colors group-hover:text-accent">{profile.phone}</span></span>
              <span className="grid size-11 shrink-0 place-items-center">
              <ArrowUpRight size={17} className="text-faint transition-colors group-hover:text-accent" aria-hidden="true" />
              </span>
            </a>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-1 pt-4">
              <a href={profile.github} target="_blank" rel="noreferrer" className={socialLink}>
                <Github size={18} strokeWidth={1.6} aria-hidden="true" />
                GitHub <ArrowUpRight size={15} className="text-faint group-hover:text-accent" aria-hidden="true" />
              </a>
              <a href={profile.facebook} target="_blank" rel="noreferrer" className={socialLink}>
                <Facebook size={18} strokeWidth={1.6} aria-hidden="true" />
                Facebook <ArrowUpRight size={15} className="text-faint group-hover:text-accent" aria-hidden="true" />
              </a>
              {profile.showResume && <a href={profile.resume} target="_blank" rel="noreferrer" className={socialLink}>
                <FileText size={18} aria-hidden="true" /> Résumé <ArrowUpRight size={15} aria-hidden="true" />
              </a>}
            </div>
          </div>
        </div>
        <footer className="footer flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line py-5 text-[12px] leading-5 text-faint max-md:gap-x-4">
          <a className="footer-brand mr-1 text-[19px] font-[750] tracking-[-.8px] text-foreground" href="#home">zaneth<span className="text-accent">.</span></a>
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="footer-built ml-auto max-desktop:hidden">Built with curiosity & a little cat energy.</span>
          <a className="back-top ml-auto flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-accent desktop:ml-0" href="#home">Back to top <ArrowUp size={15} aria-hidden="true" /></a>
        </footer>
      </div>
    </section>
  )
}
