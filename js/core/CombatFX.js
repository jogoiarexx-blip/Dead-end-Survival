export class CombatFX{
  constructor(){this.particles=[];this.floaters=[];this.stains=[];this.corpses=[];this.flash=0}
  cap(quality){return quality==='low'?28:quality==='high'?86:52}
  hit(x,y,damage=0,quality='medium',strong=false){
    const count=quality==='low'?(strong?4:2):quality==='high'?(strong?11:6):(strong?7:4);
    for(let i=0;i<count&&this.particles.length<this.cap(quality);i++){
      const a=Math.random()*Math.PI*2,s=(strong?95:62)*(0.45+Math.random()*.8);
      this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-22,t:0,d:.28+Math.random()*.24,r:1.5+Math.random()*2.5});
    }
    if(damage>0&&quality!=='low')this.floaters.push({x,y:y-34,text:`-${Math.round(damage)}`,t:0,d:.62,strong});if(quality!=='low'&&Math.random()<(strong?.8:.38)&&this.stains.length<(quality==='high'?24:14))this.stains.push({x:x+(Math.random()-.5)*14,y:y+(Math.random()-.5)*10,r:strong?9+Math.random()*6:5+Math.random()*5,a:.12+Math.random()*.08,t:0,d:10+Math.random()*8});
  }
  kill(x,y,quality='medium',type='walker',dirX=1){if(quality!=='low')this.floaters.push({x,y:y-48,text:'ABATE',t:0,d:.78,strong:true});const cap=quality==='low'?5:quality==='high'?16:10;this.corpses.push({x,y,type,dirX,t:0,d:quality==='low'?8:18});if(this.corpses.length>cap)this.corpses.shift()}
  playerDamage(){this.flash=.18}
  update(dt){
    this.flash=Math.max(0,this.flash-dt);
    for(const p of this.particles){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=210*dt;p.vx*=Math.pow(.1,dt)}
    this.particles=this.particles.filter(p=>p.t<p.d);
    for(const f of this.floaters){f.t+=dt;f.y-=28*dt}this.floaters=this.floaters.filter(f=>f.t<f.d);for(const s of this.stains)s.t+=dt;this.stains=this.stains.filter(s=>s.t<s.d);for(const c of this.corpses)c.t+=dt;this.corpses=this.corpses.filter(c=>c.t<c.d)
  }
  drawCorpses(g,a){g.save();for(const c of this.corpses){const im=a.death(c.type,3);if(!im?.complete)continue;const fade=c.t>c.d-3?Math.max(0,(c.d-c.t)/3):1,s=c.type==='brute'?145:100;g.globalAlpha=.62*fade;g.translate(c.x,c.y+10);if(c.dirX<0)g.scale(-1,1);g.drawImage(im,-s/2,-s*.7,s,s);if(c.dirX<0)g.scale(-1,1);g.translate(-c.x,-c.y-10)}g.restore();g.globalAlpha=1}
  drawWorld(g){
    g.save();
    for(const s of this.stains){const fade=s.t>s.d-2?Math.max(0,(s.d-s.t)/2):1;g.globalAlpha=s.a*fade;g.fillStyle='#3c1514';g.beginPath();g.ellipse(s.x,s.y,s.r,s.r*.48,0,0,Math.PI*2);g.fill()}
    for(const p of this.particles){g.globalAlpha=Math.max(0,1-p.t/p.d);g.fillStyle='#7e211f';g.beginPath();g.arc(p.x,p.y,p.r,0,Math.PI*2);g.fill()}
    g.textAlign='center';g.font='900 13px Segoe UI, sans-serif';
    for(const f of this.floaters){g.globalAlpha=Math.max(0,1-f.t/f.d);g.fillStyle=f.strong?'#f6d07a':'#f1efdf';g.fillText(f.text,f.x,f.y)}
    g.restore();g.globalAlpha=1
  }
  drawScreen(g,w,h){if(this.flash<=0)return;g.save();g.globalAlpha=Math.min(.22,this.flash*1.05);const gr=g.createRadialGradient(w/2,h/2,Math.min(w,h)*.18,w/2,h/2,Math.max(w,h)*.68);gr.addColorStop(0,'rgba(100,0,0,0)');gr.addColorStop(1,'rgba(150,0,0,1)');g.fillStyle=gr;g.fillRect(0,0,w,h);g.restore()}
}
