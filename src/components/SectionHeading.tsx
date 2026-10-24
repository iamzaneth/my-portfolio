interface SectionHeadingProps {
  number: string
  label: string
  children: React.ReactNode
  aside?: string
}

export default function SectionHeading({ number, label, children, aside }: SectionHeadingProps) {
  return (
    <div className="section-heading" data-reveal>
      <div>
        <p className="eyebrow"><span>{number} /</span> {label}</p>
        <h2>{children}</h2>
      </div>
      {aside && <p className="section-aside">{aside}</p>}
    </div>
  )
}
