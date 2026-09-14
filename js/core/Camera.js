export class Camera{
  constructor(w,h){this.x=0;this.y=0;this.w=w;this.h=h;this.shake=0;this.shakeX=0;this.shakeY=0}
  addShake(power=5){this.shake=Math.max(this.shake,power)}
  follow(p,world,dt){const tx=p.x-this.w/2,ty=p.y-this.h/2;this.x+=(tx-this.x)*Math.min(1,dt*6);this.y+=(ty-this.y)*Math.min(1,dt*6);this.x=Math.max(0,Math.min(Math.max(0,world.w-this.w),this.x));this.y=Math.max(0,Math.min(Math.max(0,world.h-this.h),this.y));if(this.shake>.05){this.shakeX=(Math.random()-.5)*this.shake*2;this.shakeY=(Math.random()-.5)*this.shake*2;this.shake*=Math.pow(.035,dt)}else{this.shake=0;this.shakeX=0;this.shakeY=0}}
  screenToWorld(x,y){return{x:x+this.x-this.shakeX,y:y+this.y-this.shakeY}}
}
