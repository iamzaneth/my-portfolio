import * as THREE from 'three'
import type { RenderedGraphNode } from './GraphScene'

/** Spherical orbit camera. Wheel zoom is deliberately absent. */
export function createGraphCamera() {
  const camera=new THREE.PerspectiveCamera(40,1,.1,180)
  let yaw=.12,polar=1.28,zoom=1,desiredYaw=yaw,desiredPolar=polar,desiredZoom=zoom
  let currentDistance=0
  const box=new THREE.Box3(),worldUp=new THREE.Vector3(0,1,0)
  const target=new THREE.Vector3(),desiredTarget=new THREE.Vector3(),direction=new THREE.Vector3(),right=new THREE.Vector3(),up=new THREE.Vector3(),relative=new THREE.Vector3()
  return {
    camera,
    rotate(dx:number,dy:number){desiredYaw=THREE.MathUtils.clamp(desiredYaw-dx*.005,-1.05,1.2);desiredPolar=THREE.MathUtils.clamp(desiredPolar+dy*.004,.65,2.25)},
    zoom(factor:number){desiredZoom=THREE.MathUtils.clamp(desiredZoom*factor,.72,1.75)},
    side(){desiredYaw=Math.PI/2;desiredPolar=Math.PI/2;desiredZoom=1},
    reset(){desiredYaw=.12;desiredPolar=1.28;desiredZoom=1},
    update(nodes:RenderedGraphNode[],focusedId:string|null,aspect:number,dt:number,reduced:boolean){
      const smooth=reduced?1:1-Math.exp(-6*(dt||.016))
      yaw=THREE.MathUtils.lerp(yaw,desiredYaw,smooth);polar=THREE.MathUtils.lerp(polar,desiredPolar,smooth);zoom=THREE.MathUtils.lerp(zoom,desiredZoom,smooth)
      const focused=nodes.find(node=>node.model.projectId===focusedId&&node.model.type==='project')
      box.makeEmpty();nodes.forEach(node=>box.expandByPoint(node.position))
      if(focused)desiredTarget.copy(focused.position)
      else if(nodes.length)box.getCenter(desiredTarget)
      else desiredTarget.set(0,0,0)
      direction.set(Math.sin(polar)*Math.sin(yaw),Math.cos(polar),Math.sin(polar)*Math.cos(yaw))
      right.crossVectors(worldUp,direction).normalize();up.crossVectors(direction,right).normalize()
      const tangent=Math.tan(THREE.MathUtils.degToRad(20))
      let distance=6
      for(const node of nodes) {
        relative.copy(node.position).sub(desiredTarget)
        const depth=relative.dot(direction),margin=node.model.type==='root'?1.4:node.model.radius+.3
        distance=Math.max(distance,depth+(Math.abs(relative.dot(right))+margin)/(tangent*aspect),depth+(Math.abs(relative.dot(up))+margin)/tangent)
      }
      const desiredDistance=focused?(aspect>1.25?5.4:6.5):Math.max(5.5,distance*zoom)
      if(!currentDistance||reduced)currentDistance=desiredDistance
      currentDistance=THREE.MathUtils.lerp(currentDistance,desiredDistance,smooth)
      const radius=currentDistance
      if(focused&&aspect>1.25)desiredTarget.addScaledVector(right,radius*tangent*aspect*.43)
      target.lerp(desiredTarget,smooth)
      if(camera.aspect!==aspect){camera.aspect=aspect;camera.updateProjectionMatrix()}
      camera.position.copy(target).addScaledVector(direction,radius);camera.lookAt(target);camera.updateMatrixWorld()
      return {yaw,polar,zoom,distance:radius}
    },
  }
}
