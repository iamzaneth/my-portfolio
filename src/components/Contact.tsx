import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ArrowUpRight, Check, Copy, Github, Mail, MapPin, Phone } from 'lucide-react'
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
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-top" data-reveal><p className="eyebrow"><span>04 /</span> THE NEXT CHAPTER</p><span className="availability"><span className="status-dot" /> Open to opportunities</span></div>
        <div className="contact-heading" data-reveal>
          <h2>Good things start<br />
            <span className="contact-last-line">
              <span>with a <span className="accent">hello.</span></span>
              <a href={`mailto:${profile.email}`} className="contact-arrow" aria-label="Send Phuc an email"><ArrowUpRight size={30} strokeWidth={1.4} /></a>
            </span>
          </h2>
        </div>
        <p className="contact-description" data-reveal>Have an interesting problem, an opportunity, or a shared curiosity?<br />I’d love to hear about it.</p>
        <div className="contact-email-row" data-reveal><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a><button type="button" className="icon-button copy-email" onClick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy email address'}>{copied ? <Check size={18} /> : <Copy size={18} />}</button><span className="copy-status" role="status">{copied ? 'Copied!' : copyError ? 'Please use the email link.' : ''}</span></div>
        <div className="contact-details" data-reveal><span><MapPin size={15} /> {profile.location}</span><a href={profile.phoneHref}><Phone size={15} /> {profile.phone}</a><a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a><a href={profile.facebook} target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={13} /></a><a href={profile.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={13} /></a></div>
        <footer className="footer"><a className="footer-brand" href="#home">zaneth<span className="accent">.</span></a><span>© {new Date().getFullYear()} Tran Thien Phuc</span><span className="footer-built">Built with curiosity & a little cat energy.</span><a className="back-top" href="#home">Back to top <ArrowUp size={15} /></a><a href={`mailto:${profile.email}`} className="footer-mail" aria-label="Email Phuc"><Mail size={18} /></a></footer>
      </div>
    </section>
  )
}
