import { Stars } from '../primitives'

export default function ContactCosmos({ mobile }: { mobile: boolean }) {
  return <>
    <Stars points={mobile ? [[35,40],[335,90],[210,35],[25,255],[370,370],[305,225],[90,140],[20,600],[365,610]] : [[45,70],[185,130],[360,42],[650,95],[890,40],[975,195],[70,390],[925,420],[490,150],[730,250],[290,220],[970,590],[20,550]]} />
    <g className="starlit-horizon">
      <ellipse cx={mobile ? 200 : 520} cy={mobile ? 1160 : 1210} rx={mobile ? 650 : 1320} ry={mobile ? 320 : 550} />
      <path fill="none" d={mobile ? 'M-100 886Q200 846 500 886M-100 894Q200 860 500 894' : 'M-100 755Q520 590 1100 755M-100 765Q520 610 1100 765'} />
    </g>
  </>
}
