import * as THREE from 'three'
import { PLANET_RADIUS } from './universeState'

const vertex = /* glsl */ `
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vPosition = position;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vWorld = (modelMatrix * vec4(position, 1.)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`
const noise = /* glsl */ `
float hash(vec3 p) { p = fract(p * .3183099 + vec3(.1,.2,.3)); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise3(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) {
  float v=0., a=.5;
  for(int i=0;i<FBM_OCTAVES;i++) { v+=a*noise3(p); p=p*2.03+vec3(1.7,9.2,3.4); a*=.5; }
  return v;
}`

export function createPlanet(low: boolean) {
  const group = new THREE.Group()
  group.rotation.z = -.19
  const geometry = new THREE.SphereGeometry(PLANET_RADIUS, low ? 48 : 80, low ? 32 : 56)
  const material = new THREE.ShaderMaterial({
    defines: { FBM_OCTAVES: low ? 3 : 5 },
    vertexShader: vertex,
    fragmentShader: /* glsl */ `
      varying vec3 vPosition; varying vec3 vNormal; varying vec3 vWorld;
      ${noise}
      void main() {
        vec3 p=vPosition*2.2;
        float warp=fbm(p*1.25);
        float terrain=fbm(p*2.8+warp*3.7);
        float veins=abs(fbm(p*5.+warp*4.)-.49);
        float bands=sin(p.y*8.+warp*16.);
        vec3 sea=vec3(.004,.009,.032);
        vec3 land=mix(vec3(.015,.023,.075),vec3(.072,.038,.16),smoothstep(.3,.7,terrain));
        vec3 surface=mix(sea,land,smoothstep(.34,.63,terrain));
        surface+=vec3(.012,.045,.08)*smoothstep(.3,.8,terrain)*(.5+.5*bands);
        float ridges=(1.-smoothstep(0.,.038,veins))*smoothstep(.40,.58,terrain);
        surface+=vec3(.04,.16,.26)*ridges*.3;
        vec3 n=normalize(vNormal);
        vec3 light=normalize(vec3(-3.,4.,5.));
        vec3 view=normalize(cameraPosition-vWorld);
        float diffuse=max(dot(n,light),0.);
        float rim=pow(1.-max(dot(view,n),0.),3.6);
        float spec=pow(max(dot(reflect(-light,n),view),0.),35.);
        float micro=noise3(p*48.);
        vec3 color=surface*(.2+diffuse*2.2);
        color+=vec3(.15,.47,.67)*spec*.25*(.3+micro);
        color+=mix(vec3(.09,.17,.46),vec3(.2,.1,.49),smoothstep(-1.,1.,n.x))*rim*.65;
        color+=vec3(.1,.31,.38)*smoothstep(.83,.96,micro)*ridges*.6;
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const surface = new THREE.Mesh(geometry, material)
  surface.name = 'Zaneth planet'
  group.add(surface)
  const atmosphere = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: /* glsl */ `
      varying vec3 vNormal; varying vec3 vWorld;
      void main() {
        vec3 view=normalize(cameraPosition-vWorld);
        float rim=pow(1.-abs(dot(normalize(vNormal),view)),4.5);
        vec3 tint=mix(vec3(.16,.30,.85),vec3(.18,.74,.94),smoothstep(-.7,.7,normalize(vNormal).y));
        gl_FragColor=vec4(tint,rim*.38);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide,
  }))
  atmosphere.scale.setScalar(1.045)
  group.add(atmosphere)

  // A physical annulus: depth testing hides its rear half behind the sphere.
  const ringGeometry = new THREE.RingGeometry(2.05, 2.58, low ? 128 : 224)
  const ringMaterial = new THREE.ShaderMaterial({
    vertexShader: 'varying float vR; void main(){vR=length(position.xy); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: /* glsl */ `
      varying float vR;
      void main(){
        float bands=.3+.7*pow(.5+.5*sin(vR*260.),5.);
        float edge=smoothstep(2.05,2.11,vR)*(1.-smoothstep(2.49,2.58,vR));
        vec3 color=mix(vec3(.19,.24,.5),vec3(.43,.32,.7),sin(vR*21.)*.5+.5);
        gl_FragColor=vec4(color,bands*edge*.4);
      }`,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.rotation.set(-1.25, -.1, -.28)
  group.add(ring)
  return { group, surface }
}
