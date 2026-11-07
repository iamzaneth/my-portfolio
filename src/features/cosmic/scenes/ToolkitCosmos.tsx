import { OrbitalPath, Stars, PixelGlint } from '../primitives'

export default function ToolkitCosmos({ mobile }: { mobile: boolean }) {
  return <>
    <Stars points={mobile ? [[350,55],[315,90],[35,275],[365,525],[315,570],[60,800]] : [[765,25],[840,55],[890,35],[995,120],[400,290],[945,560],[1000,610],[655,755],[65,700],[35,430],[380,740]]} />
    {!mobile && <OrbitalPath cx={mobile ? 200 : 730} cy={mobile ? 720 : 225} rx={mobile ? 420 : 550} ry={mobile ? 180 : 75} rotation={0} start={mobile ? 195 : 30} end={mobile ? 345 : 150} />}
    <PixelGlint x={mobile ? 355 : 920} y={mobile ? 660 : 720} size={1.3} />
  </>
}
