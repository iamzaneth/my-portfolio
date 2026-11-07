import { Connections, PixelGlint, Stars, type Point } from '../primitives'

export default function ToolkitCosmos({ mobile }: { mobile: boolean }) {
  const points: Point[] = mobile ? [[8,90],[18,135],[8,190],[392,285],[382,330],[395,390],[5,520],[16,575],[8,635],[395,740],[382,790],[392,850]] : [[25,95],[62,150],[25,240],[955,80],[945,160],[980,240],[25,480],[62,550],[20,680],[970,510],[940,590],[980,725]]
  return <>
    <Stars points={mobile ? [[290,32],[25,260],[370,475],[32,710],[250,880]] : [[260,45],[670,28],[985,400],[15,365],[730,770],[170,750],[430,780]]} />
    <g className="data-circuits" fill="none">
      <path d={mobile ? 'M250 12h60v14h65m-60-14V4M0 35h15v35h3M0 115h12v40H4v60h14M400 245h-16v35h8v70h-10v65h18M0 470h16v35H8v80h10v75H0M400 685h-16v40h8v75h-10v60h18' : 'M0 40h75v40h5M0 160h45v75h-20v85h50M1000 30h-50v60h25v105h-30v80h55M0 440h60v70h-30v100h80v145H0M1000 460h-70v50h35v120h-60v135h95'} />
      <path className="cosmic-grid-fragment" d={mobile ? 'M4 40v35m5-35v35m5-35v35M2 48h15M2 62h15M385 450v40m5-40v40m5-40v40M382 460h18M382 477h18' : 'M25 55v50m20-50v50m20-50v50M15 65h65M15 85h65M930 360v60m20-60v60m20-60v60M915 375h70M915 400h70'} />
    </g>
    <Connections points={points} links={[[0,1],[1,2],[3,4],[4,5],[6,7],[7,8],[9,10],[10,11]]} />
    <PixelGlint x={mobile ? 375 : 945} y={mobile ? 460 : 350} size={1.5} />
  </>
}
