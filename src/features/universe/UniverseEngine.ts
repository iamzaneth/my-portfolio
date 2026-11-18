import * as THREE from 'three'
import { createPlanet } from './Planet'
import { createGlobalEnvironment } from './GlobalEnvironment'
import { createGraphScene } from './GraphScene'
import { createGraphCamera } from './GraphCamera'
import { SceneClock, type TechnologyTarget, type UniverseState } from './universeState'
import type { KnowledgeGraph } from './knowledgeGraph'
import { createLabelProjector } from './ProjectedLabels'
import { disposeSceneTree } from './sceneResources'
import { createSkyActivity } from './SkyActivity'

export interface SceneSettings {state:UniverseState;graph:KnowledgeGraph;reduced:boolean;visible:boolean;mode:'hero'|'explorer';chapter:string;touchRotate:boolean}
interface Callbacks {hover:(id:string|null)=>void;hoverTechnology:(target:TechnologyTarget|null)=>void;inspectTechnology:(target:TechnologyTarget)=>void;select:(id:string)=>void;overview:()=>void;failure:()=>void;ready:()=>void}

/** One fixed renderer: global atmosphere and open hero, with a scoped project viewport. */
export function createUniverseEngine(canvas:HTMLCanvasElement,host:HTMLElement,initial:SceneSettings,callbacks:Callbacks) {
  const mobile=matchMedia('(max-width:767px)').matches
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile,powerPreference:mobile?'low-power':'high-performance'})
  renderer.info.autoReset=false
  renderer.autoClear=false;renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15
  renderer.debug.onShaderError=()=>callbacks.failure()
  const environment=createGlobalEnvironment(mobile),local=new THREE.Scene(),hero=new THREE.Group(),planet=createPlanet(mobile)
  planet.group.scale.setScalar(1.48);hero.add(planet.group);local.add(hero)
  const heroCamera=new THREE.PerspectiveCamera(38,1,.1,160),graphCamera=createGraphCamera()
  const light=new THREE.DirectionalLight('#d9eaff',3.6);light.position.set(-3,5,6)
  const rim=new THREE.DirectionalLight('#a47bff',3.8);rim.position.set(3,1,-3);local.add(new THREE.HemisphereLight('#9fbaff','#131126',1.8),light,rim)
  const orbits: {plane:THREE.Group;light:THREE.Mesh;radius:number;material:THREE.LineBasicMaterial}[]=[]
  for(let i=0;i<3;i++) {
    const radius=3.3+i*.42,plane=new THREE.Group()
    const points=Array.from({length:192},(_,j)=>new THREE.Vector3(Math.cos(j/192*Math.PI*2)*radius,Math.sin(j/192*Math.PI*2)*radius*.88,0))
    const material=new THREE.LineBasicMaterial({color:i%2?'#ba98ef':'#82d8ed',transparent:true,opacity:.32,depthWrite:false})
    const line=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),material)
    plane.rotation.set(.9+i*.32,.18+i*.24,-.35+i*.42)
    const light=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),new THREE.MeshBasicMaterial({color:'#b9efff'}))
    plane.add(line,light);hero.add(plane);orbits.push({plane,light,radius,material})
  }

  let settings=initial,graph:ReturnType<typeof createGraphScene>|null=null,signature=''
  const projector=createLabelProjector(host),globalClock=new SceneClock(),localClock=new SceneClock()
  let width=innerWidth,height=innerHeight,frame=0,last=0,disposed=false,lost=false,awakeUntil=performance.now()+1600,lastLabels=0,lastStats=0,frames=0,slow=0,sampleTime=0,samples=0
  let ratio=Math.min(devicePixelRatio||1,mobile?1.15:1.5),dragging=false,moved=false,downPoint:{x:number;y:number}|null=null,hoverKey=''
  let heroHover=0,heroHovered=false,heroAge=0
  const pointer=new THREE.Vector2(),parallax=new THREE.Vector2(),smoothParallax=new THREE.Vector2(),raycaster=new THREE.Raycaster(),localPointer=new THREE.Vector2()
  let bounds=host.getBoundingClientRect(),boundsDirty=true
  let pointerBusyUntil=0,pointerTime=0,pointerX=0,pointerY=0
  const sky=createSkyActivity(invalidate)
  function synchronize(){
    host.style.touchAction=settings.touchRotate?'none':'pan-y'
    host.dataset.mode=settings.mode;host.dataset.phase=settings.state.phase;host.dataset.theme=settings.chapter
    hero.visible=settings.mode==='hero';if(graph)graph.group.visible=settings.mode==='explorer'
    projector.refresh();boundsDirty=true;lastLabels=0
    if(settings.mode==='explorer') {
      const next=JSON.stringify(settings.graph.nodes.map(node=>node.id))
      if(next!==signature){if(graph){local.remove(graph.group);graph.dispose()}graph=createGraphScene(settings.graph);local.add(graph.group);signature=next}
      graph!.group.visible=true
    }
  }
  function resize(){if(disposed)return;width=innerWidth;height=innerHeight;renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);boundsDirty=true;projector.refresh();lastLabels=0;invalidate()}
  function render(now:number){
    frame=0;if(disposed||lost||document.hidden){last=0;return}
    const raw=last?now-last:16.7,dt=last?Math.min(raw/1000,.05):0;last=now
    const still=settings.reduced||settings.state.paused
    globalClock.advance(dt,still?0:1,still);if(settings.visible)localClock.advance(dt,still?0:1,still)
    if(boundsDirty){bounds=host.getBoundingClientRect();boundsDirty=false}
    renderer.info.reset();renderer.setScissorTest(false);renderer.setViewport(0,0,width,height);renderer.clear(true,true,true)
    environment.update(settings.chapter,globalClock.time,dt,settings.reduced,pointer,width/height,sky.snapshot,settings.state.paused,ratio<1,now<pointerBusyUntil);renderer.render(environment.scene,environment.camera)
    if(settings.visible&&bounds.width>0&&bounds.height>0&&bounds.bottom>0&&bounds.top<height) {
      const aspect=bounds.width/bounds.height
      let camera:THREE.PerspectiveCamera
      if(settings.mode==='hero') {
        planet.surface.rotation.y=localClock.time*Math.PI*2/120
        hero.position.x=width>=1024?2.35:width>=768?1.7:0
        heroAge+=dt
        const entrance=settings.reduced?1:THREE.MathUtils.smoothstep(heroAge,0,2.2)
        const travel=THREE.MathUtils.clamp(-bounds.top/Math.max(1,bounds.height),0,1)
        smoothParallax.lerp(parallax,1-Math.exp(-3*dt))
        heroHover=THREE.MathUtils.damp(heroHover,heroHovered?1:0,5,dt)
        planet.update(.3+entrance*.7,heroHover)
        orbits.forEach((orbit,index)=>{const angle=localClock.time*(.12+index*.025)+index*2.1;orbit.light.position.set(Math.cos(angle)*orbit.radius,Math.sin(angle)*orbit.radius*.88,0);orbit.plane.rotation.z=-.35+index*.42+Math.sin(localClock.time*.06+index)*.06;orbit.material.opacity=(.16+entrance*.18+heroHover*.16)})
        // Expand the slot's original projection onto the entire shared canvas.
        // This preserves the planet's size/anchor while allowing rings and atmosphere
        // to continue beyond the DOM slot instead of hitting its scissor rectangle.
        heroCamera.setViewOffset(bounds.width,bounds.height,-bounds.left,-bounds.top,width,height)
        heroCamera.position.set(settings.reduced?0:smoothParallax.x*.22,1.55+(settings.reduced?0:smoothParallax.y*.14),Math.max(8.6,6.4/aspect)+(width>=768&&width<1024?1.8:0)+(1-entrance)*1.4+travel*3)
        heroCamera.lookAt(0,0,0);camera=heroCamera

      } else {
        graph!.update(localClock.time,dt,settings.state)
        const pose=graphCamera.update(graph!.nodes,settings.state.focusedId,aspect,dt,settings.reduced)
        Object.assign(host.dataset,{yaw:pose.yaw.toFixed(3),polar:pose.polar.toFixed(3),zoom:pose.zoom.toFixed(3),graphNodes:String(graph!.nodes.length)})
        camera=graphCamera.camera
        if(now-lastLabels>=32){projector.update(camera,graph!.nodes,settings.state,bounds.width,bounds.height);lastLabels=now}
      }
      if(settings.mode==='hero') {
        // Keep the full-window viewport from the environment pass. Only the browser
        // edge limits this scene; there is no local rectangular clipping boundary.
        renderer.setViewport(0,0,width,height)
      } else {
        renderer.setViewport(bounds.left,height-bounds.bottom,bounds.width,bounds.height)
        renderer.setScissor(Math.max(0,bounds.left),Math.max(0,height-bounds.bottom),Math.min(width,bounds.right)-Math.max(0,bounds.left),Math.min(height,bounds.bottom)-Math.max(0,bounds.top))
        renderer.setScissorTest(true)
      }
      renderer.clearDepth();renderer.render(local,camera);renderer.setScissorTest(false)
    }
    frames++;if(!still&&now>awakeUntil){sampleTime+=raw;samples++}
    if(samples>=90){slow=sampleTime/samples>30?slow+1:0;sampleTime=0;samples=0;if(slow>=2&&ratio>.8){ratio=Math.max(.8,ratio-.2);slow=0;resize()}}
    if(now-lastStats>600){Object.assign(host.dataset,{dpr:ratio.toFixed(2),frames:String(frames),sceneTime:localClock.time.toFixed(3),globalTime:globalClock.time.toFixed(3),drawCalls:String(renderer.info.render.calls),triangles:String(renderer.info.render.triangles),geometries:String(renderer.info.memory.geometries)});canvas.dataset.theme=settings.chapter;if(import.meta.env.DEV)Object.assign(canvas.dataset,{meteorPhase:environment.meteorStats.phase,showers:String(environment.meteorStats.showers),meteors:String(environment.meteorStats.meteors),liveMeteors:String(environment.meteorStats.live),meteorSignature:environment.meteorStats.signature,nextShower:String(environment.meteorStats.nextAt),constellations:environment.constellationStats.names,skyPlacements:environment.constellationStats.placements,skyAppearances:String(environment.constellationStats.appearances),skyZones:JSON.stringify(sky.snapshot.zones),skyModal:String(sky.snapshot.modal)});lastStats=now}
    if(!still||now<awakeUntil)frame=requestAnimationFrame(render);else last=0
  }
  function invalidate(){awakeUntil=performance.now()+1100;if(!frame&&!disposed&&!lost&&!document.hidden)frame=requestAnimationFrame(render)}
  function pick(event:PointerEvent){
    if(settings.mode!=='explorer'||!graph)return undefined
    const rect=host.getBoundingClientRect();localPointer.set((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height)*2+1)
    raycaster.setFromCamera(localPointer,graphCamera.camera);local.updateMatrixWorld(true)
    const hit=raycaster.intersectObjects(graph.pickables,false)[0];if(!hit)return undefined
    const id=hit.object.userData.nodeId??hit.object.userData.nodeIds?.[hit.instanceId!]
    return settings.graph.nodes.find(node=>node.id===id)
  }
  function clearHover(){heroHovered=false;parallax.set(0,0);if(hoverKey){hoverKey='';callbacks.hover(null)}}
  function ignores(event:PointerEvent){return Boolean((event.target as Element).closest('button,a'))}
  function move(event:PointerEvent){
    if(ignores(event))return
    if(settings.mode==='hero')return

    if(dragging&&downPoint){const dx=event.clientX-downPoint.x,dy=event.clientY-downPoint.y;if(Math.abs(dx)+Math.abs(dy)>3)moved=true;if(settings.mode==='explorer'&&!settings.reduced)graphCamera.rotate(dx,dy);downPoint={x:event.clientX,y:event.clientY};clearHover()}
    else if(event.pointerType==='mouse'){
      const node=pick(event),key=node?.id??''
      if(key!==hoverKey){hoverKey=key;if(node?.type==='technology'){const owner=node.projectIds.includes(settings.state.activeId??'')?settings.state.activeId!:node.projectIds[0];callbacks.hoverTechnology({projectId:owner,name:node.label})}else callbacks.hover(node?.projectId??null)}
    }
    invalidate()
  }
  function down(event:PointerEvent){if(settings.mode!=='explorer'||event.button!==0||ignores(event))return;downPoint={x:event.clientX,y:event.clientY};moved=false;if(event.pointerType==='mouse'||settings.touchRotate){dragging=true;host.setPointerCapture(event.pointerId)}}
  function up(event:PointerEvent){if(ignores(event))return;const shifted=downPoint?Math.abs(event.clientX-downPoint.x)+Math.abs(event.clientY-downPoint.y)>8:true;dragging=false;if(host.hasPointerCapture(event.pointerId))host.releasePointerCapture(event.pointerId);if(!moved&&!shifted){const node=pick(event);if(node?.type==='root'){callbacks.overview();graphCamera.reset()}else if(node?.type==='project')callbacks.select(node.projectId!);else if(node){const owner=node.projectIds.includes(settings.state.activeId??'')?settings.state.activeId!:node.projectIds[0];callbacks.inspectTechnology({projectId:owner,name:node.label})}}downPoint=null;invalidate()}
  function cancel(){dragging=false;downPoint=null;clearHover()}
  function captureLost(){if(dragging)cancel()}
  function globalPointer(event:PointerEvent){
    if(event.pointerType!=='mouse')return
    const now=performance.now()
    if(Math.hypot(event.clientX-pointerX,event.clientY-pointerY)/Math.max(8,now-pointerTime)>.9)pointerBusyUntil=now+180
    pointerTime=now;pointerX=event.clientX;pointerY=event.clientY
    pointer.set(event.clientX/width*2-1,-(event.clientY/height*2-1))
    parallax.set((event.clientX-bounds.left)/Math.max(1,bounds.width)*2-1,(event.clientY-bounds.top)/Math.max(1,bounds.height)*2-1)
    if(settings.mode==='hero'&&settings.visible) {
      // Expanded hero geometry can extend outside its DOM interaction slot too.
      // Pick against the full canvas projection, never the slot's clipped bounds.
      raycaster.setFromCamera(pointer,heroCamera);local.updateMatrixWorld(true)
      heroHovered=!ignores(event)&&raycaster.intersectObject(planet.surface,false).length>0
      invalidate()
    }
  }
  function scroll(){boundsDirty=true;invalidate()}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0}else invalidate()}
  function contextLost(event:Event){event.preventDefault();lost=true;cancelAnimationFrame(frame);callbacks.failure()}
  const observer=new ResizeObserver(()=>{boundsDirty=true;projector.refresh();invalidate()});observer.observe(host)
  host.addEventListener('pointermove',move);host.addEventListener('pointerdown',down);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',cancel);host.addEventListener('lostpointercapture',captureLost);host.addEventListener('pointerleave',clearHover)
  window.addEventListener('pointermove',globalPointer,{passive:true});window.addEventListener('resize',resize);window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',contextLost)
  synchronize();resize();callbacks.ready()
  return {update(next:SceneSettings){if(disposed)return;settings=next;synchronize();invalidate()},reset(){graphCamera.reset();invalidate()},zoom(factor:number){graphCamera.zoom(factor);invalidate()},side(){graphCamera.side();invalidate()},dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);sky.dispose();observer.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerdown',down);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',cancel);host.removeEventListener('lostpointercapture',captureLost);host.removeEventListener('pointerleave',clearHover);window.removeEventListener('pointermove',globalPointer);window.removeEventListener('resize',resize);window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',contextLost);if(graph){local.remove(graph.group);graph.dispose()}disposeSceneTree(local);disposeSceneTree(environment.scene);renderer.dispose();if(!lost)renderer.forceContextLoss()}}
}
