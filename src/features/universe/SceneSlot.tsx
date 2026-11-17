export default function SceneSlot({ mode }: { mode:'hero'|'explorer' }) {
  return <div className={`scene-slot scene-slot-${mode}`} data-universe-viewport={mode}>
    <div className="scene-placeholder" aria-hidden="true">{mode==='hero'?<div className="placeholder-planet" />:<svg className="placeholder-constellation" viewBox="0 0 400 280"><path d="M200 130 80 70M200 130 310 58M200 130 330 170M200 130 110 220" /><circle cx="200" cy="130" r="34" />{[[80,70],[310,58],[330,170],[110,220]].map(([x,y])=><circle key={x} cx={x} cy={y} r="5" />)}</svg>}<span>{mode==='hero'?'ZANETH / A UNIVERSE OF ENGINEERING':'PROJECTS / THE SYSTEMS CONSTELLATION'}</span></div>
  </div>
}
