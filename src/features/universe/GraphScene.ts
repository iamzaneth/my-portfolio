import * as THREE from 'three'
import { createGraphAssets, createProjectCore } from './GraphBodies'
import { disposeSceneTree } from './sceneResources'
import { ROOT_ID, normalizeTechnologyId, type GraphNode, type KnowledgeGraph } from './knowledgeGraph'
import type { UniverseState } from './universeState'

export interface RenderedGraphNode { model:GraphNode; position:THREE.Vector3 }
export function createGraphScene(data:KnowledgeGraph) {
  const group=new THREE.Group(),assets=createGraphAssets(),shared=new Set(Object.values(assets))
  const nodes:RenderedGraphNode[]=data.nodes.map(model=>({model,position:new THREE.Vector3(...model.position)}))
  const byId=new Map(nodes.map(node=>[node.model.id,node]))
  const root=createProjectCore(ROOT_ID,'#f5c9ff',assets)
  root.root.scale.setScalar(1.65);group.add(root.root)
  const rootHit=new THREE.Mesh(assets.hit,assets.invisible)
  rootHit.scale.setScalar(1.08);rootHit.userData.nodeId=ROOT_ID;group.add(rootHit)
  const projects=nodes.filter(node=>node.model.type==='project').map(node=>{
    const core=createProjectCore(node.model.id,node.model.color,assets)
    core.hit.userData.nodeId=node.model.id
    core.root.position.copy(node.position);group.add(core.root)
    return {...core,node}
  })
  const technologies=nodes.filter(node=>node.model.type==='technology')
  const bodyMaterial=new THREE.MeshStandardMaterial({color:'#9ccfdf',emissive:'#1a647f',emissiveIntensity:.65,metalness:.5,roughness:.32})
  const techBodies=new THREE.InstancedMesh(assets.marker,bodyMaterial,technologies.length)
  const techLights=new THREE.InstancedMesh(assets.light,new THREE.MeshBasicMaterial({color:'#c0edfa'}),technologies.length)
  techBodies.userData.nodeIds=technologies.map(node=>node.model.id)
  group.add(techBodies,techLights)
  const pulse=new THREE.InstancedMesh(assets.pulse,new THREE.MeshBasicMaterial({color:'#a5ddea'}),data.edges.length)
  group.add(pulse)
  const steps=20
  const positions=new Float32Array(data.edges.length*steps*6),colors=new Float32Array(positions.length)
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))
  const lines=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.6,depthWrite:false}))
  group.add(lines)
  // Topology and bend offsets are fixed; endpoints still follow every animated node.
  const edges=data.edges.map((edge,index)=>({edge,index,source:byId.get(edge.source)!,target:byId.get(edge.target)!,bendY:Math.sin(index*2.39)*.35,bendZ:Math.cos(index*1.7)*.5}))
  techBodies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);techLights.instanceMatrix.setUsage(THREE.DynamicDrawUsage);pulse.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  let lastProjectFocus:string|null|undefined,lastTechnologyId:string|null|undefined
  const dummy=new THREE.Object3D(),color=new THREE.Color(),control=new THREE.Vector3(),sample=new THREE.Vector3(),previous=new THREE.Vector3()
  function curve(a:THREE.Vector3,c:THREE.Vector3,b:THREE.Vector3,t:number,out:THREE.Vector3) {
    return out.copy(a).multiplyScalar((1-t)*(1-t)).addScaledVector(c,2*(1-t)*t).addScaledVector(b,t*t)
  }
  return {
    group,nodes,
    pickables:[rootHit,...projects.map(project=>project.hit),techBodies],
    update(time:number,dt:number,state:UniverseState) {
      root.update(time,dt,state.focusedId ? .18 : 1.5)
      const projectFocus=state.hoveredId??state.focusedId
      const technologyTarget=state.hoveredTechnology??state.technology
      const technologyId=technologyTarget?`technology:${normalizeTechnologyId(technologyTarget.name)}`:null
      const selectedTechnology=technologyId?byId.get(technologyId)?.model:undefined
      const related=selectedTechnology?.projectIds??[]
      // Highlight colors depend on interaction, never on animation time.
      const colorsChanged=projectFocus!==lastProjectFocus||technologyId!==lastTechnologyId
      lastProjectFocus=projectFocus;lastTechnologyId=technologyId
      for(const project of projects) {
        const relevant=related.length?related.includes(project.node.model.projectId!):!projectFocus||projectFocus===project.node.model.projectId
        project.update(time,dt,relevant?1.25:.32)
        const base=project.node.model.position
        project.node.position.set(base[0]+Math.sin(time*.19+base[2])*.025,base[1]+Math.sin(time*.22+base[0])*.025,base[2]+Math.cos(time*.16+base[1])*.025)
        project.root.position.copy(project.node.position)
      }
      technologies.forEach((node,index)=>{
        const base=node.model.position
        node.position.set(base[0]+Math.sin(time*.16+index)*.018,base[1]+Math.cos(time*.2+index)*.018,base[2]+Math.sin(time*.13+index*2)*.018)
        dummy.position.copy(node.position);dummy.rotation.set(.3,index*.4,.4);dummy.scale.setScalar(node.model.id===technologyId?1.2:1);dummy.updateMatrix()
        techBodies.setMatrixAt(index,dummy.matrix);techLights.setMatrixAt(index,dummy.matrix)
        if(colorsChanged){color.set(node.model.id===technologyId?'#ffffff':'#8bd6e6').multiplyScalar(!projectFocus||node.model.projectIds.includes(projectFocus)?1:.32);techBodies.setColorAt(index,color)}
      })
      techBodies.instanceMatrix.needsUpdate=true;techLights.instanceMatrix.needsUpdate=true
      if(colorsChanged&&techBodies.instanceColor)techBodies.instanceColor.needsUpdate=true
      edges.forEach(({edge,index,source,target,bendY,bendZ})=>{
        const a=source.position,b=target.position
        control.copy(a).add(b).multiplyScalar(.5)
        control.y+=bendY;control.z+=bendZ
        if(edge.type==='project-technology'&&control.length()<2)control.addScaledVector(sample.copy(control).normalize(),2-control.length())
        const relevant=technologyId?edge.target===technologyId:!projectFocus||source.model.projectId===projectFocus||target.model.projectId===projectFocus
        if(colorsChanged)color.set(edge.type==='root-project'?'#a99bff':'#70c9e0').multiplyScalar(relevant?(edge.type==='root-project'?.8:.55):.09)
        previous.copy(a)
        for(let step=1;step<=steps;step++) {
          curve(a,control,b,step/steps,sample)
          const offset=(index*steps+step-1)*6
          positions[offset]=previous.x;positions[offset+1]=previous.y;positions[offset+2]=previous.z
          positions[offset+3]=sample.x;positions[offset+4]=sample.y;positions[offset+5]=sample.z
          if(colorsChanged){colors[offset]=color.r;colors[offset+1]=color.g;colors[offset+2]=color.b;colors[offset+3]=color.r;colors[offset+4]=color.g;colors[offset+5]=color.b}
          previous.copy(sample)
        }
        curve(a,control,b,(time*.085+index*.137)%1,sample)
        dummy.position.copy(sample);dummy.scale.setScalar(relevant?1:.45);dummy.updateMatrix();pulse.setMatrixAt(index,dummy.matrix)
      })
      geometry.attributes.position.needsUpdate=true;if(colorsChanged)geometry.attributes.color.needsUpdate=true;pulse.instanceMatrix.needsUpdate=true
    },
    dispose(){disposeSceneTree(group,shared);Object.values(assets).forEach(asset=>asset.dispose())},
  }
}
