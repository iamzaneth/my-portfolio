import { Constellation, OrbitalPath, Stars, PixelGlint } from '../primitives'
import { figures } from '../constellations'

export default function HomeCosmos({ mobile }: { mobile: boolean }) {
  return <>
    <Stars points={mobile ? [[22,85],[340,190],[30,400],[350,610],[75,805],[290,860]] : [[30,95],[75,125],[102,82],[460,30],[515,65],[950,330],[80,540],[145,665],[520,725],[1030,700],[875,765]]} />
    <Constellation figure={figures.home} x={mobile ? 260 : 525} y={mobile ? 10 : 0} size={mobile ? 135 : 230} />
    {!mobile && <OrbitalPath cx={mobile ? 200 : 260} cy={mobile ? 790 : 860} rx={mobile ? 460 : 490} ry={mobile ? 230 : 180} rotation={mobile ? 0 : -14} start={mobile ? 195 : 185} end={mobile ? 345 : 365} />}
    {!mobile && <OrbitalPath cx={380} cy={920} rx={600} ry={210} rotation={-8} start={205} end={325} variant="secondary" />}
    <PixelGlint x={mobile ? 30 : 120} y={mobile ? 690 : 675} size={1.2} />
  </>
}
