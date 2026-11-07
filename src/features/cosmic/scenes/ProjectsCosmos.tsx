import { Constellation, OrbitalPath, Stars, PixelGlint } from '../primitives'
import { figures } from '../constellations'

export default function ProjectsCosmos({ mobile }: { mobile: boolean }) {
  const x = mobile ? 245 : 460, y = mobile ? 0 : -8, size = mobile ? 150 : 240
  return <>
    <Stars points={mobile ? [[25,80],[50,135],[350,315],[370,660],[35,750],[90,810]] : [[20,60],[120,30],[290,100],[1015,170],[970,220],[70,410],[125,470],[40,740],[790,755],[885,700],[1010,740]]} />
    <g transform={`rotate(25 ${x + size / 2} ${y + size / 2})`}>
      <Constellation figure={figures.projects} x={x} y={y} size={size} />
    </g>
    {!mobile && <OrbitalPath cx={mobile ? 200 : 500} cy={mobile ? 540 : 1035} rx={mobile ? 440 : 650} ry={mobile ? 290 : 260} rotation={mobile ? 0 : -8} start={195} end={345} />}
    {!mobile && <OrbitalPath cx={480} cy={750} rx={650} ry={240} rotation={-12} start={190} end={350} variant="secondary" />}
    <PixelGlint x={mobile ? 340 : 100} y={mobile ? 690 : 650} size={1.5} />
  </>
}
