import * as THREE from 'three'
import { planetNoise } from './Planet'

export function createGraphAssets() {
  return {
    sphere: new THREE.SphereGeometry(1, 48, 32),
    frame: new THREE.TorusGeometry(.73, .009, 5, 72),
    marker: new THREE.OctahedronGeometry(.145, 1),
    light: new THREE.SphereGeometry(.068, 10, 6),
    pulse: new THREE.SphereGeometry(.025, 8, 5),
    hit: new THREE.SphereGeometry(1, 12, 8),
    invisible: new THREE.MeshBasicMaterial({ visible: false }),
  }
}
type Assets = ReturnType<typeof createGraphAssets>

/** One anchored engineering hub, with instanced secondary nodes and edge pulses. */
export function createProjectCore(id: string, color: string, assets: Assets) {
  const root = new THREE.Group()
  root.name = `Project: ${id}`
  const tint = new THREE.Color(color)
  const seed=[...id].reduce((sum,char)=>sum+char.charCodeAt(0),0)*.137
  const coreMaterial = new THREE.ShaderMaterial({
    defines: { FBM_OCTAVES: 3 },
    uniforms: { uSeed: { value: seed }, uColor: { value: tint }, uTime: { value: 0 }, uEmphasis: { value: 1 } },
    vertexShader: `varying vec3 vP; varying vec3 vN; varying vec3 vWorld; void main(){vP=position; vN=normalize(mat3(modelMatrix)*normal); vWorld=(modelMatrix*vec4(position,1.)).xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: /* glsl */ `
      uniform float uSeed; uniform vec3 uColor; uniform float uTime; uniform float uEmphasis;
      varying vec3 vP; varying vec3 vN; varying vec3 vWorld;
      ${planetNoise}
      void main(){
        vec3 n=normalize(vN), view=normalize(cameraPosition-vWorld);
        float rim=pow(1.-max(dot(n,view),0.),2.6);
        vec3 p=vP*3.+uSeed;
        float warp=fbm(p*1.3);
        float terrain=fbm(p*2.4+warp*3.);
        float clouds=fbm(p*5.+warp*2.);
        vec3 surface=mix(vec3(.006,.014,.045),uColor*.22,smoothstep(.25,.8,terrain));
        surface+=uColor*pow(clouds,3.)*.15;
        float light=max(dot(n,normalize(vec3(-2.,3.,5.))),0.);
        float breathe=.92+.08*sin(uTime*.7);
        vec3 color=(surface*(.38+light*1.7)+uColor*rim*.52*breathe)*uEmphasis;
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const core = new THREE.Mesh(assets.sphere, coreMaterial)
  core.scale.setScalar(.61)
  root.add(core)
  const rimMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false })
  const frame = new THREE.Mesh(assets.frame, rimMaterial)
  frame.rotation.set(.45, -.35, .12)
  root.add(frame)
  const frameTwo = new THREE.Mesh(assets.frame, new THREE.MeshBasicMaterial({ color: '#78d9ec', transparent: true, opacity: .2, depthWrite: false }))
  frameTwo.rotation.set(1.2+seed%1, .8, -.3)
  frameTwo.scale.setScalar(1.12)
  root.add(frameTwo)
  const glow = new THREE.Mesh(assets.sphere, new THREE.ShaderMaterial({
    uniforms: { uColor: { value: tint } },
    vertexShader: 'varying vec3 vN; varying vec3 vW; void main(){vN=normalize(mat3(modelMatrix)*normal);vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform vec3 uColor; varying vec3 vN;varying vec3 vW;void main(){float rim=pow(1.-abs(dot(normalize(vN),normalize(cameraPosition-vW))),3.);gl_FragColor=vec4(uColor,rim*.2);}',
    side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }))
  glow.scale.setScalar(.8)
  root.add(glow)
  const hit = new THREE.Mesh(assets.hit, assets.invisible)
  hit.scale.setScalar(.82)
  hit.userData.projectId = id
  root.add(hit)

  let intensity=1
  return {root,hit,update(time:number,delta:number,target:number){
    intensity=THREE.MathUtils.damp(intensity,target,7,delta||.016)
    core.rotation.y=time*Math.PI*2/125
    coreMaterial.uniforms.uTime.value=time
    coreMaterial.uniforms.uEmphasis.value=intensity
    glow.visible=intensity>.5;frameTwo.visible=intensity>.5
    rimMaterial.opacity=.65*intensity
    frame.rotation.z=.12+Math.sin(time*.1)*.045
  }}
}
