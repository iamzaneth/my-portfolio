import { PixelGlint, Stars } from '../primitives'

export default function HomeCosmos({ mobile }: { mobile: boolean }) {
  return <>
    <Stars points={mobile ? [[22,55],[348,35],[320,150],[365,330],[20,410],[354,570],[28,760],[370,850],[278,450]] : [[40,100],[570,65],[740,38],[920,120],[960,365],[820,680],[570,740],[90,690],[650,240],[940,580],[710,90],[845,140],[760,630],[625,560],[980,750],[585,345]]} />
    <g className="observatory-arcs" fill="none">
      <path d={mobile ? 'M265 115C490 145 520 490 320 640M320 95C550 145 535 540 355 685' : 'M680-60C1100 70 1200 510 840 830M742-60C1210 115 1200 590 905 825'} />
      <path className="cosmic-dashed" d={mobile ? 'M270 145C455 205 475 455 350 605' : 'M780 30C1040 140 1090 510 910 695'} />
    </g>
    <PixelGlint x={mobile ? 344 : 945} y={mobile ? 230 : 170} size={2} />
    <PixelGlint x={mobile ? 30 : 645} y={mobile ? 680 : 670} size={1.5} />
  </>
}
