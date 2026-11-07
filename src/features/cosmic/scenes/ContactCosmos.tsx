import { Constellation, OrbitalPath, Stars, PixelGlint } from '../primitives'
import { figures } from '../constellations'

export default function ContactCosmos({ mobile }: { mobile: boolean }) {
 const figure = figures.contact
 return <>
 <Stars points={mobile ? [[25,35],[350,120],[38,390],[365,610],[90,830]] : [[45,70],[330,35],[640,80],[970,410],[60,650],[780,750],[510,740]]} />
 <Constellation figure={figure} x={mobile ? 275 : 620 } y={mobile ? 12 : 30} size={mobile ? 120 : 200} />
 <OrbitalPath cx={mobile ? 390 : 520 } cy={mobile ? 1020 : 1050 } rx={750 } ry={390 } rotation={-8 } start={200} end={340} />

 <PixelGlint x={mobile ? 365 : 930} y={mobile ? 210 : 330} size={1.2} />
 </>
}
