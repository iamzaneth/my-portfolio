import { Constellation, OrbitalPath, Stars, PixelGlint } from '../primitives'
import { figures } from '../constellations'

export default function HomeCosmos({ mobile }: { mobile: boolean }) {
 const figure = figures.home
 return <>
 <Stars points={mobile ? [[25,35],[350,120],[38,390],[365,610],[90,830]] : [[45,70],[330,35],[640,80],[970,410],[60,650],[780,750],[510,740]]} />
 <Constellation figure={figure} x={mobile ? 275 : 650 } y={mobile ? 12 : 30} size={mobile ? 120 : 200} />
 <OrbitalPath cx={mobile ? 390 : 940 } cy={mobile ? 530 : 450 } rx={310 } ry={190 } rotation={-35 } start={20} end={272 } />
 <OrbitalPath cx={mobile ? -60 : 850 } cy={mobile ? 730 : 550 } rx={mobile ? 190 : 260} ry={80} rotation={20 } start={80} end={245} variant="secondary" />
 <PixelGlint x={mobile ? 365 : 930} y={mobile ? 210 : 330} size={1.2} />
 </>
}
