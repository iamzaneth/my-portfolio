import { PixelGlint, Stars } from '../primitives'

export default function ProjectsCosmos({ mobile }: { mobile: boolean }) {
  return <>
    <Stars points={mobile ? [[38,45],[280,25],[370,190],[30,390],[375,560],[65,810],[350,875]] : [[40,80],[190,30],[490,70],[750,25],[975,210],[960,540],[830,745],[430,760],[55,670],[15,390],[890,100],[935,135],[860,165]]} />
    <g className="event-horizon" fill="none">
      <ellipse cx={mobile ? 390 : 975} cy={mobile ? 375 : 145} rx={mobile ? 220 : 380} ry={mobile ? 105 : 155} transform={mobile ? 'rotate(-30 390 375)' : 'rotate(-26 975 145)'} />
      <ellipse className="horizon-inner" cx={mobile ? 390 : 975} cy={mobile ? 375 : 145} rx={mobile ? 200 : 344} ry={mobile ? 91 : 133} transform={mobile ? 'rotate(-30 390 375)' : 'rotate(-26 975 145)'} />
      <path d={mobile ? 'M275 20L365 0M320 50L400 20M0 745L105 685M0 785L65 748' : 'M700 38L880-35M780 60L1000-35M0 695L240 575M0 735L175 650'} />
    </g>
    <path className="distant-body" d={mobile ? 'M330-20A150 150 0 0 1 430 200L430-20Z' : 'M875-30A220 220 0 0 1 1030 250L1030-30Z'} />
    <PixelGlint x={mobile ? 345 : 885} y={mobile ? 120 : 200} size={2} />
    <PixelGlint x={mobile ? 35 : 125} y={mobile ? 790 : 700} size={1.5} />
  </>
}
