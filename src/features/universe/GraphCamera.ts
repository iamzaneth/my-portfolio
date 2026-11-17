import * as THREE from 'three'
import type { RenderedGraphNode } from './GraphScene'

/** Spherical orbit camera. Wheel zoom is deliberately absent. */
export function createGraphCamera() {
  const camera=new THREE.PerspectiveCamera(40,1,.1,180)
  let yaw=.12,polar=1.28,zoom=1,desiredYaw=yaw,desiredPolar=polar,desiredZoom=zoom
  const target=new THREE.Vector3(),desiredTarget=new THREE.Vector3(),direction=new THREE.Vector3(),right=new THREE.Vector3(),up=new THREE.Vector3(),relative=new THREE.Vector3()
  return {
    camera,
    rotate(dx:number,dy:number){desiredYaw-=dx*.007;desiredPolar=THREE.MathUtils.clamp(desiredPolar+dy*.006,.3,Math.PI-.3)},
    zoom(factor:number){desiredZoom=THREE.MathUtils.clamp(desiredZoom*factor,.72,1.75)},
    side(){desiredYaw=Math.PI/2;desiredPolar=Math.PI/2;desiredZoom=1},
    reset(){desiredYaw=.12;desiredPolar=1.28;desiredZoom=1},
    update(nodes:RenderedGraphNode[],focusedId:string|null,aspect:number,dt:number,reduced:boolean){
      const smooth=reduced?1:1-Math.exp(-6*(dt||.016))
      yaw=THREE.MathUtils.lerp(yaw,desiredYaw,smooth);polar=THREE.MathUtils.lerp(polar,desiredPolar,smooth);zoom=THREE.MathUtils.lerp(zoom,desiredZoom,smooth)
      const focused=nodes.find(node=>node.model.projectId===focusedId&&node.model.type==='project')
      desiredTarget.copy(focused?.position??new THREE.Vector3()).multiplyScalar(.43)
      target.lerp(desiredTarget,smooth)
      direction.set(Math.sin(polar)*Math.sin(yaw),Math.cos(polar),Math.sin(polar)*Math.cos(yaw))
      right.crossVectors(new THREE.Vector3(0,1,0),direction).normalize();up.crossVectors(direction,right).normalize()
      const tangent=Math.tan(THREE.MathUtils.degToRad(20))
      let distance=6
      for(const node of nodes) {
        relative.copy(node.position).sub(target)
        const depth=relative.dot(direction),margin=node.model.type==='root'?1.8:node.model.radius+.55
        distance=Math.max(distance,depth+(Math.abs(relative.dot(right))+margin)/(tangent*aspect),depth+(Math.abs(relative.dot(up))+margin)/tangent)
      }
      const radius=Math.max(5.5,distance*zoom)
      camera.aspect=aspect;camera.updateProjectionMatrix()
      camera.position.copy(target).addScaledVector(direction,radius);camera.lookAt(target);camera.updateMatrixWorld()
      return {yaw,polar,zoom,distance:radius}
    },
  }
}
