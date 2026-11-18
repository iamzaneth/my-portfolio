import * as THREE from 'three'
import { createMeteorShowers } from './MeteorShowers'
import { createConstellationSky } from './ConstellationSky'
import type { SkyActivity } from './SkyActivity'

export const SECTION_THEMES:Record<string,{color:string;accent:string}>= {
  home:{color:'#7554c4',accent:'#315a91'},about:{color:'#426bd1',accent:'#7764bd'},skills:{color:'#208e9a',accent:'#305ab2'},projects:{color:'#9158d0',accent:'#287e9b'},contact:{color:'#6b65a8',accent:'#3d4d8c'},
}
export function createGlobalEnvironment(compact:boolean) {
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,1,.1,200)
  camera.position.z=8
  const theme=new THREE.Color(SECTION_THEMES.home.color),accent=new THREE.Color(SECTION_THEMES.home.accent)
  const material=new THREE.ShaderMaterial({
    uniforms:{uTheme:{value:theme},uAccent:{value:accent},uTime:{value:0},uAspect:{value:1}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,.999,1.);}',
    fragmentShader:`varying vec2 vUv;uniform vec3 uTheme;uniform vec3 uAccent;uniform float uTime;uniform float uAspect;
      void main(){vec2 uv=vUv;uv.x*=uAspect;float a=exp(-length((uv-vec2(uAspect*.77,.68))*vec2(.8,1.4))*3.2);float b=exp(-length((uv-vec2(uAspect*.21,.24))*vec2(.9,1.8))*3.6);float cloud=.86+.14*sin(uv.x*5.+uv.y*7.+sin(uv.y*8.)+uTime*.012);vec3 color=vec3(.0015,.0021,.006)+uTheme*a*cloud*.09+uAccent*b*.065;gl_FragColor=vec4(color,1.);
      #include <colorspace_fragment>
      }`,depthTest:false,depthWrite:false,
  })
  const nebula=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);nebula.frustumCulled=false;nebula.renderOrder=-100;scene.add(nebula)
  let seed=382919
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296}
  const count=compact?650:1800,positions=new Float32Array(count*3),sizes=new Float32Array(count),seeds=new Float32Array(count)
  for(let i=0;i<count;i++) {
    const layer=i%3,z=layer===0?-12-random()*18:layer===1?-35-random()*30:-70-random()*55
    positions.set([(random()-.5)*Math.abs(z)*3.5,(random()-.5)*Math.abs(z)*1.8,z],i*3)
    sizes[i]=layer===0?1.4+random()*1.1:layer===1?1+random()*.8:.8+random()*.7;seeds[i]=random()*50
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1))
  const starsMaterial=new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:'attribute float aSize;attribute float aSeed;uniform float uTime;varying float vLight;void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=aSize;vLight=.45+.22*sin(aSeed+uTime*.23);}',fragmentShader:'varying float vLight;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(.69,.77,1.,(1.-smoothstep(.05,.5,d))*vLight);}',transparent:true,depthWrite:false})
  const stars=new THREE.Points(geometry,starsMaterial);stars.renderOrder=-90;scene.add(stars)
  const meteors=createMeteorShowers(compact),constellations=createConstellationSky(compact)
  scene.add(meteors.group,constellations.group)
  const desiredTheme=new THREE.Color(),desiredAccent=new THREE.Color()
  return {scene,camera,stars,meteorStats:meteors.stats,constellationStats:constellations.stats,
    update(chapter:string,time:number,dt:number,reduced:boolean,pointer:THREE.Vector2,aspect:number,activity:SkyActivity,paused:boolean,low:boolean,pointerBusy:boolean){
      const palette=SECTION_THEMES[chapter]??SECTION_THEMES.home
      desiredTheme.set(palette.color);desiredAccent.set(palette.accent)
      const damping=reduced?1:1-Math.exp(-3*(dt||.016))
      theme.lerp(desiredTheme,damping);accent.lerp(desiredAccent,damping)
      material.uniforms.uTime.value=time;material.uniforms.uAspect.value=aspect;starsMaterial.uniforms.uTime.value=time
      if(camera.aspect!==aspect){camera.aspect=aspect;camera.updateProjectionMatrix()};camera.position.x=reduced?0:pointer.x*.22;camera.position.y=reduced?0:pointer.y*.15
      camera.lookAt(0,0,-35)
      camera.updateMatrixWorld()
      meteors.update(time,activity,camera,reduced||paused,low,pointerBusy)
      constellations.update(time,dt,activity,camera,reduced||paused,meteors.stats.phase==='active'&&meteors.stats.meteors>0,low,accent)
    },
  }
}
