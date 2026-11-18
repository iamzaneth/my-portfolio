import type { Project } from '../../types/portfolio'

export type Position3 = [number, number, number]
export type NodeType = 'root' | 'project' | 'technology'
export interface GraphNode {
  id: string
  type: NodeType
  label: string
  projectId?: string
  technologyId?: string
  projectIds: string[]
  position: Position3
  radius: number
  color: string
}
export interface GraphEdge { id:string; source:string; target:string; type:'root-project'|'project-technology' }
export interface KnowledgeGraph { nodes:GraphNode[]; edges:GraphEdge[] }
export const ROOT_ID = 'root:zaneth'
export const TECHNOLOGIES_PER_CLUSTER = 8
const colors=['#b8a0ff','#77dcec','#8da9ff','#9cd9cb']
const aliases:Record<string,string>={reactjs:'react',nestjs:'nestjs',postgres:'postgresql',nodejs:'nodejs',typescript:'typescript',javascript:'javascript'}
export function normalizeTechnologyId(name:string) {
  const key=name.normalize('NFKC').trim().toLowerCase().replace(/[\s._/-]+/g,'')
  return aliases[key]??key
}
export function projectTechnologies(project:Project) {
  const seen=new Set<string>()
  return (project.technologies??[]).map(name=>name.trim()).filter(name=>{
    const key=normalizeTechnologyId(name)
    if(!key||seen.has(key))return false
    seen.add(key);return true
  })
}
export function technologyDescription(project:Project,name:string) {
  return project.pipeline?.find(stage=>normalizeTechnologyId(stage.name)===normalizeTechnologyId(name))?.description??`${name} is part of the technology stack used to build ${project.title}.`
}
export function buildKnowledgeGraph(projects:readonly Project[]):KnowledgeGraph {
  const nodes:GraphNode[]=[{id:ROOT_ID,type:'root',label:'Zaneth',projectIds:[],position:[0,0,0],radius:1.08,color:'#b29aff'}]
  const edges:GraphEdge[]=[]
  const technologies=new Map<string,GraphNode>()
  const projectIds=new Set<string>()
  for(const [index,project] of projects.entries()) {
    if(projectIds.has(project.id))continue
    projectIds.add(project.id)
    const id=`project:${project.id}`
    nodes.push({id,type:'project',label:project.title,projectId:project.id,projectIds:[project.id],position:[0,0,0],radius:.61,color:/data/i.test(project.category)?'#68cce3':colors[index%colors.length]})
    edges.push({id:`${ROOT_ID}->${id}`,source:ROOT_ID,target:id,type:'root-project'})
    for(const name of projectTechnologies(project)) {
      const technologyId=normalizeTechnologyId(name),tid=`technology:${technologyId}`
      let technology=technologies.get(tid)
      if(!technology){technology={id:tid,type:'technology',technologyId,label:name,projectIds:[],position:[0,0,0],radius:.145,color:'#80d9e7'};technologies.set(tid,technology)}
      technology.projectIds.push(project.id)
      edges.push({id:`${id}->${tid}`,source:id,target:tid,type:'project-technology'})
    }
  }
  nodes.push(...technologies.values())
  return {nodes,edges}
}
function hash(text:string) {let h=2166136261;for(const char of text){h^=char.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)/4294967296}
function unit(index:number,count:number,seed=0):Position3 {
  const y=1-2*(index+.5)/Math.max(1,count),r=Math.sqrt(Math.max(0,1-y*y)),theta=index*Math.PI*(3-Math.sqrt(5))+.48+seed
  // Rotate the entire sphere about X; no privileged flat clustering plane.
  const x=Math.cos(theta)*r,z=Math.sin(theta)*r,c=Math.cos(.43+seed*.17),s=Math.sin(.43+seed*.17)
  return [x,y*c-z*s,y*s+z*c]
}
export function layoutKnowledgeGraph(data:KnowledgeGraph):KnowledgeGraph {
  const nodes=data.nodes.map(node=>({...node,projectIds:[...node.projectIds],position:[...node.position] as Position3}))
  const projects=nodes.filter(node=>node.type==='project')
  const byProject=new Map<string,GraphNode>()
  projects.forEach((node,index)=>{
    const direction=unit(index,projects.length)
    const radius=3.85+Math.max(0,projects.length-3)*.17+(index%2)*.45
    node.position=direction.map(value=>value*radius) as Position3
    byProject.set(node.projectId!,node)
  })
  const techs=nodes.filter(node=>node.type==='technology')
  const counts=new Map<string,number>()
  const ordinals=new Map<string,number>()
  techs.forEach(node=>node.projectIds.forEach(id=>counts.set(id,(counts.get(id)??0)+1)))
  for(const node of techs) {
    const parents=node.projectIds.map(id=>byProject.get(id)!).filter(Boolean)
    const centroid:Position3=[0,0,0]
    parents.forEach(parent=>parent.position.forEach((v,i)=>centroid[i]+=v/parents.length))
    const owner=node.projectIds[0],ordinal=ordinals.get(owner)??0
    ordinals.set(owner,ordinal+1)
    const direction=unit(ordinal,counts.get(owner)??1,hash(node.id)*2.2)
    const radius=parents.length>1?1.4:2.05+hash(node.id)*.5
    node.position=centroid.map((value,i)=>value+direction[i]*radius) as Position3
  }
  // Deterministic repulsion: separate canonical technology nodes from every body.
  const fixed=nodes.filter(node=>node.type!=='technology')
  for(let pass=0;pass<40;pass++) {
    let moved=false
    for(let i=0;i<techs.length;i++) {
      const a=techs[i]
      for(const b of [...fixed,...techs.slice(0,i)]) {
        const delta=a.position.map((v,k)=>v-b.position[k]) as Position3
        let distance=Math.hypot(...delta)
        const minimum=b.type==='root'?2.05:b.radius+a.radius+.37
        if(distance>=minimum)continue
        if(distance<1e-6){const axis=unit(i,techs.length,hash(a.id));delta.splice(0,3,...axis.map(value=>value*.001));distance=.001}
        const amount=(minimum-distance+.012)/distance
        a.position=a.position.map((v,k)=>v+delta[k]*amount) as Position3
        moved=true
      }
    }
    if(!moved)break
  }
  return {nodes,edges:data.edges.map(edge=>({...edge}))}
}

/** All project entities stay present; only secondary technology detail is disclosed. */
export function visibleKnowledgeGraph(graph:KnowledgeGraph,focusedId:string|null,stackPage=0):KnowledgeGraph {
  const technologies=graph.nodes.filter(node=>node.type==='technology')
  let visible:GraphNode[]
  if(focusedId) {
    const technologyMap=new Map(technologies.map(node=>[node.id,node]))
    const connected=graph.edges.filter(edge=>edge.source===`project:${focusedId}`&&edge.type==='project-technology').map(edge=>technologyMap.get(edge.target)!).filter(Boolean)
    const page=Math.min(Math.max(0,stackPage),Math.max(0,Math.ceil(connected.length/TECHNOLOGIES_PER_CLUSTER)-1))
    visible=connected.slice(page*TECHNOLOGIES_PER_CLUSTER,(page+1)*TECHNOLOGIES_PER_CLUSTER)
  } else if(technologies.length<=24)visible=technologies
  else {
    const selected=new Map<string,GraphNode>()
    technologies.filter(node=>node.projectIds.length>1).slice(0,16).forEach(node=>selected.set(node.id,node))
    for(const project of graph.nodes.filter(node=>node.type==='project')) {
      technologies.filter(node=>node.projectIds.includes(project.projectId!)).slice(0,2).forEach(node=>{if(selected.size<40)selected.set(node.id,node)})
    }
    visible=[...selected.values()]
  }
  const ids=new Set([...graph.nodes.filter(node=>node.type!=='technology').map(node=>node.id),...visible.map(node=>node.id)])
  return {nodes:graph.nodes.filter(node=>ids.has(node.id)),edges:graph.edges.filter(edge=>ids.has(edge.source)&&ids.has(edge.target))}
}
