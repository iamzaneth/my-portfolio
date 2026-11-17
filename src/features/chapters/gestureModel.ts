export function wheelPixels(delta:number,mode:number,viewport:number){return delta*(mode===1?16:mode===2?viewport:1)}
/** One latched decision per burst, including a trackpad's inertial tail. */
export class WheelGesture {
  last=-Infinity
  direction=0
  accumulated=0
  latched=false
  feed(delta:number,now:number,locked:boolean):number {
    if(!delta)return 0
    const direction=Math.sign(delta),fresh=now-this.last>190,reversed=direction!==this.direction
    this.last=now
    if(locked){this.latched=true;this.direction=direction;this.accumulated=0;return 0}
    if(fresh||reversed){this.accumulated=0;this.latched=false}
    this.direction=direction
    if(this.latched)return 0
    this.accumulated+=delta
    if(Math.abs(this.accumulated)<65)return 0
    this.latched=true;this.accumulated=0
    return direction
  }
  reset(){this.last=-Infinity;this.accumulated=0;this.direction=0;this.latched=false}
}
