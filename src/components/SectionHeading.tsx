interface SectionHeadingProps {
  number: string
  label: string
  children: React.ReactNode
  aside?: string
}

export default function SectionHeading({ number, label, children, aside }: SectionHeadingProps) {
  return (
    <div className="section-heading mb-7 flex items-end justify-between gap-6 max-md:mb-6 max-md:flex-col max-md:items-start
      max-md:gap-3.5 [&_h2]:mt-3.5 [&_h2]:text-[clamp(32px,3.7vw,51px)] [&_h2]:leading-[1.23] [&_h2]:font-[550]
      [&_h2]:tracking-[-2px] max-md:[&_h2]:mt-3 max-md:[&_h2]:text-[36px] max-md:[&_h2]:tracking-[-1.6px]
      max-phone:[&_h2]:text-[34px] max-tiny:[&_h2]:text-[31px]" data-reveal>
      <div>
        <p className="eyebrow"><span>{number} /</span> {label}</p>
        <h2>{children}</h2>
      </div>
      {aside && <p className="section-aside mb-[3px] max-w-[250px] text-[14px] leading-[1.9] text-muted max-md:max-w-[320px]">{aside}</p>}
    </div>
  )
}
