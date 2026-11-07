import { ellipseArc } from '../src/features/cosmic/orbit'
import { expect, test } from '@playwright/test'
import { append, prune, MAX_POINTS, MAX_LENGTH } from '../src/features/cursor/history'
import { figures } from '../src/features/cosmic/constellations'

test('immutable history preserves corners, reversal, linear resampling and stationary fade', () => {
 const points: Parameters<typeof append>[0] = []
 append(points,100,100,0); append(points,160,100,10)
 const saved = points.map(p=>({...p})), refs=[...points]
 append(points,160,160,20)
 expect(refs).toEqual(saved)
 expect(points.every(p=>p.y===100 || p.x===160)).toBe(true)
 append(points,160,130,30)
 expect(refs).toEqual(saved)
 const stationary=points.map(p=>({...p}))
 prune(points,40); expect(points).toEqual(stationary)
 prune(points,700); expect(points).toHaveLength(0)
})
test('arc length and time bound memory; discontinuities and invalid samples are safe',()=>{
 const points: Parameters<typeof append>[0]=[]
 for(let i=0;i<5000;i++) append(points,100+Math.sin(i/20)*50,100+Math.cos(i/20)*50,i)
 expect(points.length).toBeLessThanOrEqual(MAX_POINTS)
 const length=points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-points[i].x,p.y-points[i].y),0)
 expect(length).toBeLessThanOrEqual(MAX_LENGTH+.00001)
 const saved=[...points]; append(points,NaN,10,5001); append(points,10,10,0); expect(points).toEqual(saved)
 append(points,1500,1500,5002); expect(points).toHaveLength(1)
})
test('constellation identities and static connections are valid',()=>{
 expect(Object.values(figures).map(f=>f.name)).toEqual(['Lyra','Orion','Cygnus','Scorpius','Ursa Major'])
 for(const f of Object.values(figures)) {
 const ids=f.stars.map(s=>s.id); expect(new Set(ids).size).toBe(ids.length)
 for(const s of f.stars) expect(Number.isFinite(s.x)&&Number.isFinite(s.y)).toBe(true)
 for(const [a,b] of f.connections) {expect(ids).toContain(a);expect(ids).toContain(b)}
 }
})

for(const shape of ['straight','S','circle','zigzag']) test(`${shape} resampling stays on observed segments`,()=>{
 const points: Parameters<typeof append>[0]=[]
 let previous={x:100,y:100};append(points,previous.x,previous.y,0)
 for(let i=1;i<60;i++) {
 const next=shape==='straight'?{x:100+i*2,y:100}:shape==='circle'?{x:100+20*Math.sin(i/10),y:120-20*Math.cos(i/10)}:shape==='S'?{x:100+15*Math.sin(i/8),y:100+i}: {x:100+(i%2)*12,y:100+i}
 const old=new Set(points);append(points,next.x,next.y,i)
 for(const p of points.filter(p=>!old.has(p)).slice(1)) {
 const cross=(p.x-previous.x)*(next.y-previous.y)-(p.y-previous.y)*(next.x-previous.x)
 expect(Math.abs(cross)).toBeLessThan(.00001)
 }
 previous=next
 }
})

test('orbital endpoints lie on an ellipse with correct sweep and large arc flags',()=>{
 for(const end of [140,260,305]) {
 const values=ellipseArc(300,100,20,end).match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)!.map(Number)
 const [x,y,rx,ry,,large,sweep,ex,ey]=values
 expect((x/rx)**2+(y/ry)**2).toBeCloseTo(1,10)
 expect((ex/rx)**2+(ey/ry)**2).toBeCloseTo(1,10)
 expect(large).toBe(end-20>180?1:0);expect(sweep).toBe(1)
 }
})
