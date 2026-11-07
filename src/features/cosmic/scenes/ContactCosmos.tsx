import { Constellation, OrbitalPath, Stars } from '../primitives'
import { figures } from '../constellations'

export default function ContactCosmos({ mobile }: { mobile: boolean }) {
  return <>
    <Stars points={mobile ? [[330,45],[360,120],[25,340],[345,580],[50,750]] : [[860,40],[925,85],[990,60],[30,310],[990,450],[110,655],[245,705],[750,740],[935,675]]} />
    <g className="contact-figure"><Constellation figure={figures.contact} x={mobile ? 150 : 10} y={mobile ? 0 : 610} size={mobile ? 185 : 210} /></g>
    {!mobile && <OrbitalPath cx={mobile ? 200 : 590} cy={mobile ? 1030 : 1010} rx={mobile ? 440 : 680} ry={mobile ? 310 : 350} rotation={6} start={195} end={345} />}
  </>
}
