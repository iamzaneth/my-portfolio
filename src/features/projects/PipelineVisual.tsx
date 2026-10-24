import { Activity, Database, Radio, Workflow } from 'lucide-react'

const stages = [
  { name: 'Binance', detail: 'trade ticks', Icon: Radio },
  { name: 'Kafka', detail: 'event stream', Icon: Workflow },
  { name: 'QuestDB', detail: 'candle storage', Icon: Database },
  { name: 'React', detail: 'live charts', Icon: Activity },
]

export default function PipelineVisual() {
  return <div className="pipeline-art" role="img" aria-label="Illustration of the NexTick data flow: Binance trade ticks, Kafka event streaming, QuestDB candle storage, and React charts. Simplified architecture, not live market data.">
    <div className="pipeline-top"><span><span className="pipeline-logo">N</span> NEXTICK</span><span className="diagram-label">SYSTEM OVERVIEW</span></div>
    <div className="pipeline-title"><span>EVENTS IN. INSIGHTS OUT.</span><strong>Every tick tells a story<span>.</span></strong></div>
    <div className="pipeline-stages">
      <div className="pipeline-track"><div className="pipeline-progress" /></div>
      {stages.map(({ name, detail, Icon }) => <div className="pipeline-stage" key={name}><div className="stage-icon"><Icon size={23} strokeWidth={1.5} /></div><b>{name}</b><span>{detail}</span></div>)}
    </div>
    <div className="candle-illustration" aria-hidden="true">{[24, 45, 32, 58, 46, 73, 55, 42, 65, 85, 72, 94, 69, 88, 112, 95, 124, 106, 117, 141, 128, 148, 134, 159].map((height, index) => <i key={`candle-${index}`} className={index % 4 === 1 ? 'down' : ''} style={{ height: `${height}px` }} />)}</div>
    <div className="pipeline-bottom"><span>PYTHON → KAFKA → QUESTDB → NESTJS → REACT</span><span>ARCHITECTURE STUDY ↗</span></div>
  </div>
}
