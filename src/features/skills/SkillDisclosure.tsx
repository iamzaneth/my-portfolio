import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

export default function SkillDisclosure({ title, practice, children }: { title: string; practice: string; children: ReactNode }) {
  return <>{children}<details className="skill-practice"><summary>In practice<span className="sr-only">: {title}</span><ChevronDown size={16} aria-hidden="true" /></summary><p>{practice}</p></details></>
}
