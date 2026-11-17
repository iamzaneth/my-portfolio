import { useEffect, useRef, useState, type ReactNode } from 'react'
export default function ChapterBody({label,children}:{label:string;children:ReactNode}) {
  const ref=useRef<HTMLDivElement>(null),[overflow,setOverflow]=useState(false)
  useEffect(()=>{const element=ref.current!;const check=()=>setOverflow(element.scrollHeight>element.clientHeight+2);const observer=new ResizeObserver(check);observer.observe(element);Array.from(element.children).forEach(child=>observer.observe(child));check();return()=>observer.disconnect()},[children])
  return <div ref={ref} className="page-container chapter-body" tabIndex={overflow?0:undefined} role="region" aria-label={`${label} content`}>{children}</div>
}
