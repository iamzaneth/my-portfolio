import { OrbitalPath, Stars, PixelGlint } from '../primitives'

export default function AboutCosmos({ mobile }: { mobile: boolean }) {
  return <>
    <Stars points={mobile ? [[30,45],[75,80],[330,210],[20,565],[365,740],[120,850]] : [[25,80],[110,30],[165,65],[260,32],[850,380],[965,445],[30,590],[95,640],[355,760],[760,730],[920,695]]} />
    {!mobile && <OrbitalPath cx={mobile ? 200 : 400} cy={mobile ? 650 : -210} rx={mobile ? 420 : 580} ry={mobile ? 210 : 250} rotation={0} start={mobile ? 195 : 0} end={mobile ? 345 : 180} />}
    <PixelGlint x={mobile ? 365 : 45} y={mobile ? 610 : 490} size={1.2} />
  </>
}
