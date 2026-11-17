import * as THREE from 'three'

export function createGraphAssets() {
  return {
    sphere: new THREE.SphereGeometry(1, 28, 18),
    shell: new THREE.IcosahedronGeometry(1, 1),
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
  const coreMaterial = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: tint }, uTime: { value: 0 }, uEmphasis: { value: 1 } },
    vertexShader: `varying vec3 vP; varying vec3 vN; varying vec3 vWorld; void main(){vP=position; vN=normalize(mat3(modelMatrix)*normal); vWorld=(modelMatrix*vec4(position,1.)).xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uTime; uniform float uEmphasis;
      varying vec3 vP; varying vec3 vN; varying vec3 vWorld;
      void main(){
        vec3 n=normalize(vN), view=normalize(cameraPosition-vWorld);
        float rim=pow(1.-max(dot(n,view),0.),2.6);
        float band=pow(.5+.5*sin(vP.y*32.+vP.x*5.),18.);
        float grid=pow(.5+.5*sin(atan(vP.z,vP.x)*12.),28.)*.5;
        float light=max(dot(n,normalize(vec3(-2.,3.,5.))),0.);
        float breathe=.92+.08*sin(uTime*.7);
        vec3 color=(uColor*(.025+light*.075)+uColor*(rim*.8+band*.15+grid*.1)*breathe)*uEmphasis;
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const core = new THREE.Mesh(assets.sphere, coreMaterial)
  core.scale.setScalar(.61)
  root.add(core)
  const shellMaterial = new THREE.MeshBasicMaterial({ color: tint, wireframe: true, transparent: true, opacity: .21, depthWrite: false })
  const shell = new THREE.Mesh(assets.shell, shellMaterial)
  shell.scale.setScalar(.665)
  shell.rotation.set(.2, .4, .15)
  root.add(shell)
  const rimMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false })
  const frame = new THREE.Mesh(assets.frame, rimMaterial)
  frame.rotation.set(.45, -.35, .12)
  root.add(frame)
  const frameTwo = new THREE.Mesh(assets.frame, new THREE.MeshBasicMaterial({ color: '#78d9ec', transparent: true, opacity: .2, depthWrite: false }))
  frameTwo.rotation.set(1.2, .8, -.3)
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
    coreMaterial.uniforms.uTime.value=time
    coreMaterial.uniforms.uEmphasis.value=intensity
    shellMaterial.opacity=.23*intensity;rimMaterial.opacity=.65*intensity
    frame.rotation.z=.12+Math.sin(time*.1)*.045
  }}
}
