import type { MouseEvent } from 'react'
export function useBackToTop(){return(event:MouseEvent<HTMLAnchorElement>)=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();window.dispatchEvent(new CustomEvent('portfolio:navigate',{detail:{id:'home'}}))}}
