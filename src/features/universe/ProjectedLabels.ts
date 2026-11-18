import * as THREE from 'three'
import type { RenderedGraphNode } from './GraphScene'
import type { UniverseState } from './universeState'
import { normalizeTechnologyId } from './knowledgeGraph'

type Box={x:number;y:number;width:number;height:number}
type Label={element:HTMLElement;width:number;height:number;transform:string;visible:string}
export function createLabelProjector(host:HTMLElement) {
  let labels=new Map<string,Label>()
  const point=new THREE.Vector3(),edge=new THREE.Vector3(),direction=new THREE.Vector3()
  function refresh(){const previous=labels;labels=new Map(Array.from(host.querySelectorAll<HTMLElement>('[data-node-label]')).map(element=>{const old=previous.get(element.dataset.nodeLabel!);return[element.dataset.nodeLabel!,{element,width:element.offsetWidth,height:element.offsetHeight,transform:old?.transform??'',visible:old?.visible??''}]}))}
  function update(camera:THREE.PerspectiveCamera,nodes:RenderedGraphNode[],state:UniverseState,width:number,height:number) {
    camera.updateMatrixWorld()
    const placed:Box[]=[]
    const technologyCount=nodes.reduce((count,node)=>count+Number(node.model.type==='technology'),0)
    const targetTech=state.hoveredTechnology??state.technology
    const focus=state.hoveredId??state.focusedId
    const sorted=[...nodes].sort((a,b)=>(a.model.type==='root'?-100:a.model.type==='project'?(a.model.projectId===focus?-90:-80):0)-(b.model.type==='root'?-100:b.model.type==='project'?(b.model.projectId===focus?-90:-80):0))
    for(const node of sorted) {
      const label=labels.get(node.model.id);if(!label)continue
      point.copy(node.position).project(camera)
      const x=(point.x*.5+.5)*width,y=(-point.y*.5+.5)*height
      label.element.dataset.screenX=x.toFixed(1);label.element.dataset.screenY=y.toFixed(1)
      label.element.dataset.worldX=node.position.x.toFixed(3);label.element.dataset.worldY=node.position.y.toFixed(3);label.element.dataset.worldZ=node.position.z.toFixed(3)
      direction.copy(node.position).sub(camera.position);const distance=direction.length();direction.normalize()
      const occluded=node.model.type!=='root'&&nodes.some(other=>{
        if(other===node||other.model.type==='technology')return false
        edge.copy(other.position).sub(camera.position);const t=edge.dot(direction)
        return t>0&&t<distance-other.model.radius&&edge.lengthSq()-t*t<other.model.radius*other.model.radius*.92
      })
      const selected=node.model.type!=='technology'||node.model.projectIds.includes(focus??'')||technologyCount<=8||normalizeTechnologyId(targetTech?.name??'')===node.model.technologyId
      const visible=selected&&!occluded&&point.z>=-1&&point.z<=1&&x>=0&&x<=width&&y>=0&&y<=height
      const w=label.width,h=label.height
      const pixels=node.model.radius/(Math.max(1,distance)*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*height*.5
      const candidates=node.model.type==='root'?[[x-w/2,y-h/2]]:node.model.type==='project'?[[x-w/2,y+pixels+7],[x-w/2,y-pixels-h-8]]:[[x-w/2,y-h-10],[x-w/2,y+12],[x+12,y-h/2],[x-w-12,y-h/2]]
      const boxes=candidates.map(([px,py])=>({x:THREE.MathUtils.clamp(px,8,Math.max(8,width-w-8)),y:THREE.MathUtils.clamp(py,45,Math.max(45,height-h-58)),width:w,height:h}))
      const collision=(box:Box)=>placed.some(other=>box.x<other.x+other.width+4&&box.x+box.width+4>other.x&&box.y<other.y+other.height+4&&box.y+box.height+4>other.y)
      const box=boxes.find(candidate=>!collision(candidate))??boxes[0]
      const show=visible&&!(node.model.type==='technology'&&collision(box))
      const transform=`translate3d(${box.x.toFixed(1)}px,${box.y.toFixed(1)}px,0)`
      if(label.transform!==transform){label.element.style.transform=transform;label.transform=transform}
      const visibility=show?'visible':'hidden';if(label.visible!==visibility){label.element.style.visibility=visibility;label.visible=visibility}
      if(show)placed.push(box)
    }
  }
  return {refresh,update}
}
