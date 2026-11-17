import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { WheelGesture, wheelPixels } from './gestureModel'

/** Desktop chapters use grouped wheel input; nested readers and mobile stay native. */
export function useChapterNavigation() {
  const [active,setActive]=useState('home')
  useEffect(()=>{
    const root=document.documentElement,sections=Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'))
    const desktop=matchMedia('(min-width:1024px) and (min-height:600px)'),motion=matchMedia('(prefers-reduced-motion:reduce)')
    const gesture=new WheelGesture()
    let current=0,phase:'idle'|'navigating'|'settling'='idle',tween:gsap.core.Tween|null=null,frame=0,measureFrame=0,alive=true,interacted=false,lastWheel=-Infinity,nestedOwner:HTMLElement|null=null
    let settleTimer:ReturnType<typeof setTimeout>|undefined
    const previousRestoration=history.scrollRestoration;history.scrollRestoration='manual'
    function header(){return document.querySelector<HTMLElement>('.site-header')?.offsetHeight??72}
    function top(index:number){return Math.max(0,sections[index].getBoundingClientRect().top+scrollY-header())}
    function mark(index:number){current=index;const id=sections[index]?.id??'home';setActive(id);root.dataset.chapter=id}
    function status(value:typeof phase){phase=value;root.dataset.navigation=value}
    function scrollUpdate(){frame=0;if(phase==='navigating'||document.querySelector('dialog[open]'))return;const line=header()+innerHeight*.25;const index=sections.reduce((chosen,section,i)=>section.getBoundingClientRect().top<=line?i:chosen,0);mark(index)}
    function scroll(){if(!frame)frame=requestAnimationFrame(scrollUpdate)}
    function sectionForHash(hash:string){let id:string;try{id=decodeURIComponent(hash.replace(/^#/,''))}catch{return 0}const element=document.getElementById(id);const section=element?.closest('main > section');return Math.max(0,sections.findIndex(item=>item===section))}
    function settle(){clearTimeout(settleTimer);const wait=190-(performance.now()-lastWheel);if(wait>0){status('settling');settleTimer=setTimeout(settle,wait+5)}else status('idle')}
    function navigate(index:number,options:{history?:boolean;hash?:string;immediate?:boolean;focus?:boolean}={}){
      if(!sections.length)return
      index=Math.max(0,Math.min(sections.length-1,index))
      tween?.kill();clearTimeout(settleTimer);mark(index)
      const hash=options.hash??`#${sections[index].id}`
      if(options.history!==false&&location.hash!==hash)history.pushState(history.state,'',hash)
      const destinationFor=()=>{
        if(!desktop.matches){let id='';try{id=decodeURIComponent(hash.slice(1))}catch{/* Invalid fragments keep the current chapter. */}const target=document.getElementById(id);if(target&&target!==sections[index]&&target.closest('main > section')===sections[index]&&target.getClientRects().length)return Math.max(0,target.getBoundingClientRect().top+scrollY-header()-12)}
        return top(index)
      }
      const destination=destinationFor()
      const finish=()=>{tween=null;window.scrollTo({top:destinationFor(),behavior:'instant'});mark(index);if(options.focus){sections[index].tabIndex=-1;sections[index].focus({preventScroll:true})}settle()}
      if(options.immediate||motion.matches||Math.abs(scrollY-destination)<2){status('navigating');window.scrollTo({top:destination,behavior:'instant'});finish();return}
      status('navigating')
      const position={y:scrollY}
      tween=gsap.to(position,{y:destination,duration:.76,ease:'power3.inOut',onUpdate:()=>window.scrollTo({top:position.y,behavior:'instant'}),onComplete:finish})
    }
    function canScroll(element:HTMLElement,direction:number){return /(auto|scroll)/.test(getComputedStyle(element).overflowY)&&element.scrollHeight>element.clientHeight+2&&(direction>0?element.scrollTop+element.clientHeight<element.scrollHeight-2:element.scrollTop>2)}
    function nested(element:Element|null,direction:number):HTMLElement|null {for(let target=element;target&&target!==document.body;target=target.parentElement){if(target instanceof HTMLElement&&canScroll(target,direction))return target}return null}
    function wheel(event:WheelEvent){
      interacted=true
      if(!desktop.matches||event.ctrlKey||event.metaKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||document.querySelector('dialog[open]'))return
      const element=event.target instanceof Element?event.target:null
      if(element?.closest('input,textarea,select,[contenteditable=true],[role=slider],[data-wheel-owner]'))return
      const delta=wheelPixels(event.deltaY,event.deltaMode,innerHeight-header());if(!delta)return
      const now=performance.now(),direction=Math.sign(delta),fresh=now-lastWheel>(nestedOwner?260:190)
      if(fresh)nestedOwner=null
      const owner=nested(element,direction)
      if(nestedOwner&&!fresh){lastWheel=now;if(!canScroll(nestedOwner,direction))event.preventDefault();return}
      if(owner){nestedOwner=owner;lastWheel=now;return}
      lastWheel=now;event.preventDefault()
      const action=gesture.feed(delta,now,phase==='navigating')
      if(action)navigate(current+action)
    }
    function key(event:KeyboardEvent){
      if(!desktop.matches||event.defaultPrevented||event.altKey||event.metaKey||event.ctrlKey||event.shiftKey||document.querySelector('dialog[open]'))return
      const target=event.target instanceof Element?event.target:null
      if(target?.closest('a,button,input,textarea,select,[contenteditable=true],[role=slider],[role=tab]'))return
      for(let el=target;el&&el!==document.body;el=el.parentElement)if(el instanceof HTMLElement&&/(auto|scroll)/.test(getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight+2)return
      const index=event.key==='Home'?0:event.key==='End'?sections.length-1:['ArrowDown','PageDown'].includes(event.key)?current+1:['ArrowUp','PageUp'].includes(event.key)?current-1:null
      if(index===null)return
      event.preventDefault();if(event.repeat&&phase==='navigating')return
      interacted=true;navigate(index,{focus:true})
    }
    function anchor(event:MouseEvent){
      const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href^="#"]'):null
      if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!link||link.hash==='#main')return
      const target=document.getElementById(decodeURIComponent(link.hash.slice(1)))
      if(!target?.closest('main > section'))return
      event.preventDefault();interacted=true;gesture.reset();navigate(sectionForHash(link.hash),{hash:link.hash,focus:true})
    }
    function restore(){gesture.reset();navigate(sectionForHash(location.hash),{hash:location.hash||'#home',history:false,immediate:true})}
    function resize(){if(measureFrame)return;measureFrame=requestAnimationFrame(()=>{measureFrame=0;if(document.querySelector('dialog[open]'))return;if(desktop.matches)navigate(current,{history:false,immediate:true});else{tween?.kill();tween=null;status('idle');scrollUpdate()}})}
    function explicit(event:Event){const detail=(event as CustomEvent<{id:string}>).detail;const index=sections.findIndex(section=>section.id===detail?.id);if(index>=0)navigate(index,{focus:true})}
    function preference(){gesture.reset();resize()}
    const observer=new ResizeObserver(resize);sections.forEach(section=>observer.observe(section))
    window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('keydown',key);window.addEventListener('resize',resize);window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);window.addEventListener('portfolio:navigate',explicit);window.addEventListener('portfolio:restore',restore);document.addEventListener('click',anchor)
    desktop.addEventListener('change',preference);motion.addEventListener('change',preference)
    scrollUpdate()
    void document.fonts.ready.then(()=>{if(alive&&!interacted)restore()})
    return()=>{alive=false;tween?.kill();observer.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(measureFrame);clearTimeout(settleTimer);history.scrollRestoration=previousRestoration;delete root.dataset.navigation;delete root.dataset.chapter;window.removeEventListener('scroll',scroll);window.removeEventListener('wheel',wheel);window.removeEventListener('keydown',key);window.removeEventListener('resize',resize);window.removeEventListener('popstate',restore);window.removeEventListener('hashchange',restore);window.removeEventListener('portfolio:navigate',explicit);window.removeEventListener('portfolio:restore',restore);document.removeEventListener('click',anchor);desktop.removeEventListener('change',preference);motion.removeEventListener('change',preference)}
  },[])
  return active
}
