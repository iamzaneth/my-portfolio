import { Activity, Database, Radio, Workflow } from 'lucide-react'

const stages = [
  { name: 'Binance', detail: 'trade ticks', Icon: Radio },
  { name: 'Kafka', detail: 'event stream', Icon: Workflow },
  { name: 'QuestDB', detail: 'candle storage', Icon: Database },
  { name: 'React', detail: 'live charts', Icon: Activity },
]

export default function PipelineVisual() {
  return <div className="pipeline-art relative min-h-[420px] overflow-hidden bg-surface max-desktop:min-h-[440px]
    max-tablet:min-h-[420px] max-md:min-h-[350px]" role="img" aria-label="Illustration of the NexTick data flow: Binance trade ticks, Kafka event streaming, QuestDB candle storage, and React charts. Simplified architecture, not live market data.">
    <div className="pipeline-top relative mx-[25px] mt-[23px] flex items-center justify-between font-mono text-[12px]
      tracking-[1px] text-[#d4dce7] max-md:mx-[18px] max-md:mt-5 max-md:text-[11px] [&>span:first-child]:flex
      [&>span:first-child]:items-center [&>span:first-child]:gap-[9px]"><span><span className="pipeline-logo grid size-6 place-items-center rounded-[3px] bg-[#9fc9d2] text-[16px] font-bold text-[#0c1c2a]">N</span> NEXTICK</span><span className="diagram-label text-[9px] tracking-[1px] text-faint max-md:text-[8px]">SYSTEM OVERVIEW</span></div>
    <div className="pipeline-title relative mx-[25px] mt-[33px] max-md:mx-[18px] max-md:mt-7 [&>span]:font-mono
      [&>span]:text-[9px] [&>span]:tracking-[1.5px] [&>span]:text-cyan [&>strong]:mt-2 [&>strong]:block
      [&>strong]:text-[24px] [&>strong]:font-medium [&>strong]:tracking-[-1.2px]
      max-desktop:[&>strong]:text-[20px] max-tablet:[&>strong]:text-[29px]
      max-md:[&>strong]:text-[clamp(18px,4vw,26px)] max-md:[&>strong]:tracking-[-.7px]
      [&>strong>span]:text-cyan"><span>EVENTS IN. INSIGHTS OUT.</span><strong>Every tick tells a story<span>.</span></strong></div>
    <div className="pipeline-stages relative z-2 mx-[25px] mt-[33px] grid grid-cols-4 max-tablet:mt-10 max-md:mx-3 max-md:mt-[30px]">
      <div className="pipeline-track absolute top-[23px] left-[10%] h-px w-4/5 bg-[#425066] max-md:top-[21px]"><div className="pipeline-progress h-px w-full origin-left bg-cyan" /></div>
      {stages.map(({ name, detail, Icon }) => <div className="pipeline-stage relative flex flex-col items-center [&:nth-of-type(3)>.stage-icon]:text-accent [&>b]:mt-3
        [&>b]:text-[12px] [&>b]:font-medium max-md:[&>b]:text-[11px] [&>span]:mt-[5px] [&>span]:font-mono
        [&>span]:text-[9px] [&>span]:text-muted max-md:[&>span]:text-[8px]" key={name}><div className="stage-icon flex size-[47px] items-center justify-center rounded-md border border-[#5c6b84]
        bg-surface-raised text-cyan transition-[transform,border-color] duration-350 ease-[ease]
        group-hover/project:border-[#94a5c0] group-hover/project:[transform:translateY(-4px)]
        motion-reduce:group-hover/project:transform-none max-md:size-[42px]"><Icon size={23} strokeWidth={1.5} /></div><b>{name}</b><span>{detail}</span></div>)}
    </div>
    <div className="candle-illustration" aria-hidden="true">{[24, 45, 32, 58, 46, 73, 55, 42, 65, 85, 72, 94, 69, 88, 112, 95, 124, 106, 117, 141, 128, 148, 134, 159].map((height, index) => <i key={`candle-${index}`} className={index % 4 === 1 ? 'down' : ''} style={{ height: `${height}px` }} />)}</div>
    <div className="pipeline-bottom absolute inset-x-0 bottom-0 flex justify-between gap-2 border-t border-line bg-bg-subtle
      px-[23px] py-[15px] font-mono text-[8px] tracking-[.1px] text-muted max-desktop:px-3
      max-desktop:text-[7px] max-tablet:px-6 max-tablet:text-[9px] max-md:px-4 max-md:py-3.5 max-md:text-[7px]
      [&>span:last-child]:text-[#b9a6d2] max-md:[&>span:last-child]:hidden"><span>PYTHON → KAFKA → QUESTDB → NESTJS → REACT</span><span>ARCHITECTURE STUDY ↗</span></div>
  </div>
}
