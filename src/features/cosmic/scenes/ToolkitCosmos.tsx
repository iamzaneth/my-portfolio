import { Constellation, OrbitalPath, Stars, PixelGlint } from '../primitives'
import { figures } from '../constellations'

export default function ToolkitCosmos({ mobile }: { mobile: boolean }) {
 const figure = figures.toolkit
 return <>
 <Stars points={mobile ? [[25,35],[350,120],[38,390],[365,610],[90,830]] : [[45,70],[330,35],[640,80],[970,410],[60,650],[780,750],[510,740]]} />
 <Constellation figure={figure} x={mobile ? 275 : 735 } y={mobile ? 12 : 30} size={mobile ? 120 : 200} />
 <OrbitalPath cx={mobile ? 390 : 990 } cy={mobile ? 550 : 470 } rx={290 } ry={140 } rotation={-44 } start={20} end={260 } />
 <OrbitalPath cx={mobile ? -60 : 930 } cy={mobile ? 730 : 650 } rx={mobile ? 190 : 260} ry={80} rotation={18 } start={80} end={245} variant="secondary" />
 <PixelGlint x={mobile ? 365 : 930} y={mobile ? 210 : 330} size={1.2} />
 </>
}
