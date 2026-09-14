export const WEAPONS={
  bat:{name:'TACO',damage:30,range:82,cooldown:.48,stamina:18,noise:70,arc:.76,knockback:24,melee:true},
  axe:{name:'MACHADO',damage:56,range:88,cooldown:.72,stamina:26,noise:100,arc:.62,knockback:52,melee:true},
  machete:{name:'MACHETE',damage:39,range:102,cooldown:.34,stamina:14,noise:60,arc:.88,knockback:32,melee:true},
  pistol:{name:'PISTOLA',damage:36,range:560,cooldown:.22,noise:430,spread:.07,knockback:18,ammoType:'light',mag:12,reload:1.15,pellets:1,effect:'pistol'},
  shotgun:{name:'SHOTGUN',damage:25,range:390,cooldown:.9,noise:760,spread:.3,knockback:62,ammoType:'shells',mag:6,reload:1.65,pellets:6,effect:'heavy'},
  rifle:{name:'RIFLE',damage:72,range:840,cooldown:.58,noise:650,spread:.025,knockback:46,ammoType:'rifle',mag:5,reload:1.45,pellets:1,effect:'heavy'}
};
const angleDiff=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
export class WeaponSystem{
  constructor(owner,save={}){this.owner=owner;this.current=save.current||'pistol';this.unlocked={bat:true,pistol:true,...save.unlocked};this.magazines={pistol:save.ammo??12,shotgun:0,rifle:0,...save.magazines};this.reserves={light:save.reserve??48,shells:0,rifle:0,...save.reserves};this.reloadLeft=0;this.effects=[];this.tracers=[]}
  get config(){return WEAPONS[this.current]}get ammo(){return this.config.melee?Infinity:this.magazines[this.current]}get reserve(){return this.config.melee?0:this.reserves[this.config.ammoType]}set reserve(v){if(!this.config.melee)this.reserves[this.config.ammoType]=v}
  switch(name){if(!this.unlocked[name]||!WEAPONS[name])return false;this.current=name;this.reloadLeft=0;return true}unlock(name){if(WEAPONS[name])this.unlocked[name]=true}
  reload(){const w=this.config;if(w.melee||this.reloadLeft>0||this.ammo>=w.mag||this.reserve<=0)return false;this.reloadLeft=w.reload/(this.owner.reloadMultiplier||1);return true}
  finishReload(){const w=this.config,n=Math.min(w.mag-this.magazines[this.current],this.reserves[w.ammoType]);this.magazines[this.current]+=n;this.reserves[w.ammoType]-=n}
  attack(target,zombies,world){const p=this.owner,w=this.config;if(p.attackCooldown>0||this.reloadLeft>0||(w.melee&&p.stamina<w.stamina))return[];if(!w.melee&&this.ammo<=0){this.reload();return[]}if(w.melee)p.stamina-=w.stamina;else this.magazines[this.current]--;p.attackCooldown=w.cooldown;world.makeNoise(p.x,p.y,w.noise);const aim=Math.atan2(target.y-p.y,target.x-p.x),hits=[];
    if(w.melee){for(const z of zombies){if(z.dying)continue;const dist=Math.hypot(z.x-p.x,z.y-p.y),za=Math.atan2(z.y-p.y,z.x-p.x);if(dist<=w.range&&angleDiff(za,aim)<w.arc){z.hit(w.damage*(p.damageMultiplier||1));z.knockback(Math.cos(aim)*w.knockback,Math.sin(aim)*w.knockback,world);hits.push(z)}}this.effects.push({type:'slash',x:p.x+Math.cos(aim)*48,y:p.y+Math.sin(aim)*48,a:aim,t:0,d:.2});return hits}
    for(let pellet=0;pellet<w.pellets;pellet++){const shot=aim+(Math.random()-.5)*w.spread*2;let best=null,bestD=w.range;for(const z of zombies){if(z.dying)continue;const dist=Math.hypot(z.x-p.x,z.y-p.y),za=Math.atan2(z.y-p.y,z.x-p.x);if(dist<bestD&&angleDiff(za,shot)<.055+z.r/dist){best=z;bestD=dist}}const x2=best?best.x:p.x+Math.cos(shot)*w.range,y2=best?best.y:p.y+Math.sin(shot)*w.range;this.tracers.push({x1:p.x,y1:p.y,x2,y2,t:.09});if(best){best.hit(w.damage*(p.damageMultiplier||1));best.knockback(Math.cos(shot)*w.knockback/w.pellets,Math.sin(shot)*w.knockback/w.pellets,world);if(!hits.includes(best))hits.push(best);this.effects.push({type:'impact',x:best.x,y:best.y,a:shot,t:0,d:.18})}}
    this.effects.push({type:w.effect,x:p.x+Math.cos(aim)*42,y:p.y+Math.sin(aim)*42,a:aim,t:0,d:.16});return hits;
  }
  update(dt){if(this.reloadLeft>0){this.reloadLeft-=dt;if(this.reloadLeft<=0)this.finishReload()}for(const t of this.tracers)t.t-=dt;this.tracers=this.tracers.filter(t=>t.t>0);for(const e of this.effects)e.t+=dt;this.effects=this.effects.filter(e=>e.t<e.d)}
  draw(g,assets){g.strokeStyle='#ffe49a';g.lineWidth=2;for(const t of this.tracers){g.globalAlpha=Math.max(0,t.t/.09);g.beginPath();g.moveTo(t.x1,t.y1);g.lineTo(t.x2,t.y2);g.stroke()}g.globalAlpha=1;for(const e of this.effects){const frame=Math.min(3,Math.floor(e.t/e.d*4)),im=assets.effect(e.type,frame);if(!im?.complete)continue;const size=e.type==='slash'?120:e.type==='heavy'?90:64;g.save();g.translate(e.x,e.y);g.rotate(e.a);g.drawImage(im,-size/2,-size/2,size,size);g.restore()}}
  serialize(){return{current:this.current,unlocked:this.unlocked,magazines:this.magazines,reserves:this.reserves}}
}
