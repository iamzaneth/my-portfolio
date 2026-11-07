import { Constellation, OrbitalPath, Stars, PixelGlint } from '../primitives'
import { figures } from '../constellations'

export default function ProjectsCosmos({ mobile }: { mobile: boolean }) {
 const figure = figures.projects
 return <>
 <Stars points={mobile ? [[25,35],[350,120],[38,390],[365,610],[90,830]] : [[45,70],[330,35],[640,80],[970,410],[60,650],[780,750],[510,740]]} />
 <Constellation figure={figure} x={mobile ? 275 : 805 } y={mobile ? 12 : 30} size={mobile ? 120 : 150} />
 <OrbitalPath cx={mobile ? 390 : 980 } cy={mobile ? 440 : 350 } rx={390 } ry={170 } rotation={-26 } start={20} end={305 } />
 <OrbitalPath cx={mobile ? -60 : 870 } cy={mobile ? 730 : 520 } rx={mobile ? 190 : 260} ry={80} rotation={-12 } start={80} end={245} variant="secondary" />
 <PixelGlint x={mobile ? 365 : 930} y={mobile ? 210 : 330} size={1.2} />
 </>
}
