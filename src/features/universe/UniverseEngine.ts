import * as THREE from 'three'
import { createPlanet } from './Planet'
import { createGlobalEnvironment } from './GlobalEnvironment'
import { createGraphScene } from './GraphScene'
import { createGraphCamera } from './GraphCamera'
import { SceneClock, type TechnologyTarget, type UniverseState } from './universeState'
import type { KnowledgeGraph } from './knowledgeGraph'
import { createLabelProjector } from './ProjectedLabels'
import { disposeSceneTree } from './sceneResources'

export interface SceneSettings {state:UniverseState;graph:KnowledgeGraph;reduced:boolean;visible:boolean;mode:'hero'|'explorer';chapter:string;touchRotate:boolean}
interface Callbacks {hover:(id:string|null)=>void;hoverTechnology:(target:TechnologyTarget|null)=>void;inspectTechnology:(target:TechnologyTarget)=>void;select:(id:string)=>void;overview:()=>void;failure:()=>void;ready:()=>void}

/** One fixed renderer: global atmosphere first, local 3D objects in transparent viewports. */
export function createUniverseEngine(canvas:HTMLCanvasElement,host:HTMLElement,initial:SceneSettings,callbacks:Callbacks) {
  const mobile=matchMedia('(max-width:767px)').matches
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile,powerPreference:mobile?'low-power':'high-performance'})
  renderer.info.autoReset=false
  renderer.autoClear=false;renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15
  renderer.debug.onShaderError=()=>callbacks.failure()
  const environment=createGlobalEnvironment(mobile),local=new THREE.Scene(),hero=new THREE.Group(),planet=createPlanet(mobile)
  planet.group.scale.setScalar(1.12);hero.add(planet.group);local.add(hero)
  const heroCamera=new THREE.PerspectiveCamera(38,1,.1,160),graphCamera=createGraphCamera()
  const light=new THREE.DirectionalLight('#d9eaff',3.6);light.position.set(-3,5,6)
  const rim=new THREE.DirectionalLight('#a47bff',3.8);rim.position.set(3,1,-3);local.add(new THREE.HemisphereLight('#9fbaff','#131126',1.8),light,rim)
  for(let i=0;i<2;i++) {
    const radius=3.1+i*.42,points=Array.from({length:193},(_,j)=>new THREE.Vector3(Math.cos(j/192*Math.PI*2)*radius,Math.sin(j/192*Math.PI*2)*radius,0))
    const line=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:i?'#8580bd':'#71a7c2',transparent:true,opacity:.23,depthWrite:false}));line.rotation.set(1.1+i*.18,.12,-.28+i*.25);hero.add(line)
  }
  let settings=initial,graph:ReturnType<typeof createGraphScene>|null=null,signature=''
  const projector=createLabelProjector(host),globalClock=new SceneClock(),localClock=new SceneClock()
  let width=innerWidth,height=innerHeight,frame=0,last=0,disposed=false,lost=false,awakeUntil=performance.now()+1600,lastLabels=0,lastStats=0,frames=0,slow=0,sampleTime=0,samples=0
  let ratio=Math.min(devicePixelRatio||1,mobile?1.15:1.5),dragging=false,moved=false,downPoint:{x:number;y:number}|null=null,hoverKey=''
  const pointer=new THREE.Vector2(),parallax=new THREE.Vector2(),raycaster=new THREE.Raycaster(),localPointer=new THREE.Vector2()
  let bounds=host.getBoundingClientRect(),boundsDirty=true
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
    const modal=settings.state.phase==='focused'||settings.state.phase==='focusing'
    const still=settings.reduced||settings.state.paused
    globalClock.advance(dt,still?0:1,still);if(settings.visible)localClock.advance(dt,still||modal?0:1,still)
    if(boundsDirty){bounds=host.getBoundingClientRect();boundsDirty=false}
    renderer.info.reset();renderer.setScissorTest(false);renderer.setViewport(0,0,width,height);renderer.clear(true,true,true)
    environment.update(settings.chapter,globalClock.time,dt,settings.reduced,pointer,width/height);renderer.render(environment.scene,environment.camera)
    if(settings.visible&&bounds.width>0&&bounds.height>0&&bounds.bottom>0&&bounds.top<height) {
      const aspect=bounds.width/bounds.height
      let camera:THREE.PerspectiveCamera
      if(settings.mode==='hero') {
        planet.surface.rotation.y=localClock.time*Math.PI*2/120
        heroCamera.aspect=aspect;heroCamera.updateProjectionMatrix();heroCamera.position.set(settings.reduced?0:parallax.x*.17,2.3+(settings.reduced?0:parallax.y*.12),Math.max(11.3,10.2/aspect));heroCamera.lookAt(0,0,0);camera=heroCamera
      } else {
        graph!.update(localClock.time,dt,settings.state)
        const pose=graphCamera.update(graph!.nodes,settings.state.focusedId,aspect,dt,settings.reduced)
        Object.assign(host.dataset,{yaw:pose.yaw.toFixed(3),polar:pose.polar.toFixed(3),zoom:pose.zoom.toFixed(3),graphNodes:String(graph!.nodes.length)})
        camera=graphCamera.camera
        if(now-lastLabels>=32){projector.update(camera,graph!.nodes,settings.state,bounds.width,bounds.height);lastLabels=now}
      }
      renderer.setViewport(bounds.left,height-bounds.bottom,bounds.width,bounds.height)
      renderer.setScissor(Math.max(0,bounds.left),Math.max(0,height-bounds.bottom),Math.min(width,bounds.right)-Math.max(0,bounds.left),Math.min(height,bounds.bottom)-Math.max(0,bounds.top));renderer.setScissorTest(true);renderer.clearDepth();renderer.render(local,camera);renderer.setScissorTest(false)
    }
    frames++;if(!still&&now>awakeUntil){sampleTime+=raw;samples++}
    if(samples>=90){slow=sampleTime/samples>30?slow+1:0;sampleTime=0;samples=0;if(slow>=2&&ratio>.8){ratio=Math.max(.8,ratio-.2);slow=0;resize()}}
    if(now-lastStats>600){Object.assign(host.dataset,{dpr:ratio.toFixed(2),frames:String(frames),sceneTime:localClock.time.toFixed(3),globalTime:globalClock.time.toFixed(3),drawCalls:String(renderer.info.render.calls),triangles:String(renderer.info.render.triangles),geometries:String(renderer.info.memory.geometries)});canvas.dataset.theme=settings.chapter;lastStats=now}
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
  function clearHover(){if(hoverKey){hoverKey='';callbacks.hover(null)}}
  function ignores(event:PointerEvent){return Boolean((event.target as Element).closest('button,a'))}
  function move(event:PointerEvent){
    if(ignores(event))return
    if(dragging&&downPoint){const dx=event.clientX-downPoint.x,dy=event.clientY-downPoint.y;if(Math.abs(dx)+Math.abs(dy)>3)moved=true;if(settings.mode==='explorer'&&!settings.reduced)graphCamera.rotate(dx,dy);downPoint={x:event.clientX,y:event.clientY};clearHover()}
    else if(event.pointerType==='mouse'){
      const node=pick(event),key=node?.id??''
      if(key!==hoverKey){hoverKey=key;if(node?.type==='technology'){const owner=node.projectIds.includes(settings.state.activeId??'')?settings.state.activeId!:node.projectIds[0];callbacks.hoverTechnology({projectId:owner,name:node.label})}else callbacks.hover(node?.projectId??null)}
    }
    invalidate()
  }
  function down(event:PointerEvent){if(event.button!==0||ignores(event))return;downPoint={x:event.clientX,y:event.clientY};moved=false;if(event.pointerType==='mouse'||settings.touchRotate){dragging=true;host.setPointerCapture(event.pointerId)}}
  function up(event:PointerEvent){if(ignores(event))return;const shifted=downPoint?Math.abs(event.clientX-downPoint.x)+Math.abs(event.clientY-downPoint.y)>8:true;dragging=false;if(host.hasPointerCapture(event.pointerId))host.releasePointerCapture(event.pointerId);if(!moved&&!shifted){const node=pick(event);if(node?.type==='root'){callbacks.overview();graphCamera.reset()}else if(node?.type==='project')callbacks.select(node.projectId!);else if(node){const owner=node.projectIds.includes(settings.state.activeId??'')?settings.state.activeId!:node.projectIds[0];callbacks.inspectTechnology({projectId:owner,name:node.label})}}downPoint=null;invalidate()}
  function cancel(){dragging=false;downPoint=null;clearHover()}
  function captureLost(){if(dragging)cancel()}
  function globalPointer(event:PointerEvent){if(event.pointerType!=='mouse')return;pointer.set(event.clientX/width*2-1,-(event.clientY/height*2-1));const rect=host.getBoundingClientRect();parallax.set((event.clientX-rect.left)/Math.max(1,rect.width)*2-1,(event.clientY-rect.top)/Math.max(1,rect.height)*2-1)}
  function scroll(){boundsDirty=true;invalidate()}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0}else invalidate()}
  function contextLost(event:Event){event.preventDefault();lost=true;cancelAnimationFrame(frame);callbacks.failure()}
  const observer=new ResizeObserver(()=>{boundsDirty=true;projector.refresh();invalidate()});observer.observe(host)
  host.addEventListener('pointermove',move);host.addEventListener('pointerdown',down);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',cancel);host.addEventListener('lostpointercapture',captureLost);host.addEventListener('pointerleave',clearHover)
  window.addEventListener('pointermove',globalPointer,{passive:true});window.addEventListener('resize',resize);window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',contextLost)
  synchronize();resize();callbacks.ready()
  return {update(next:SceneSettings){if(disposed)return;settings=next;synchronize();invalidate()},reset(){graphCamera.reset();invalidate()},zoom(factor:number){graphCamera.zoom(factor);invalidate()},side(){graphCamera.side();invalidate()},dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerdown',down);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',cancel);host.removeEventListener('lostpointercapture',captureLost);host.removeEventListener('pointerleave',clearHover);window.removeEventListener('pointermove',globalPointer);window.removeEventListener('resize',resize);window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',contextLost);if(graph){local.remove(graph.group);graph.dispose()}disposeSceneTree(local);disposeSceneTree(environment.scene);renderer.dispose();if(!lost)renderer.forceContextLoss()}}
}
