/** Runs inside the browser: sample transformed geometry against every clipping
 * SVG viewport and the chapter plane, rather than trusting getTotalLength(). */
export function inspectOrbits(section) {
 const bounds=section.getBoundingClientRect()
 return [...section.querySelectorAll('.celestial-orbit')].filter(path=>path.getBoundingClientRect().width>0).map(path=>{
  const clips=[bounds]
  for(let parent=path.parentElement;parent&&parent!==section;parent=parent.parentElement) {
   if(parent.tagName.toLowerCase()==='svg'&&getComputedStyle(parent).overflow!=='visible')clips.push(parent.getBoundingClientRect())
  }
  const matrix=path.getScreenCTM(),length=path.getTotalLength(),samples=1200
  let previous=null,visibleLength=0,run=0,longestRun=0,count=0,minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity
  for(let i=0;i<=samples;i++){
   const local=path.getPointAtLength(length*i/samples),p=new DOMPoint(local.x,local.y).matrixTransform(matrix)
   const inside=clips.every(r=>p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom)
   if(inside){count++;minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y)}
   if(inside&&previous?.inside){const step=Math.hypot(p.x-previous.x,p.y-previous.y);visibleLength+=step;run+=step;longestRun=Math.max(longestRun,run)}else run=0
   previous={x:p.x,y:p.y,inside}
  }
  return {variant:path.getAttribute('class'),parameters:path.dataset.orbit,sourceLength:length,visibleFraction:count/(samples+1),visibleLength,longestRun,spanX:count?maxX-minX:0,spanY:count?maxY-minY:0,sectionWidth:bounds.width,relativeBounds:count?[minX-bounds.x,minY-bounds.y,maxX-bounds.x,maxY-bounds.y]:null}
 })
}
