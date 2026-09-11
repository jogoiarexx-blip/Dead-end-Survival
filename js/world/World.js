import { CollisionSystem } from '../systems/CollisionSystem.js';
export class World{
  constructor(save={}){
    this.w=2200;this.h=1400;this.noise=null;this.noiseLife=0;
    const level=Math.max(1,Math.min(3,save.baseLevel??1)),maxHp=[0,100,145,210][level];this.base={x:925,y:565,w:350,h:270,level,maxHp,hp:Math.min(maxHp,save.baseHp??55)};
    this.drops=[];
    const used=new Set(save.looted||[]);
    this.containers=[['crate',350,270,'wood'],['dumpster',680,200,'scrap'],['crate',1760,310,'food'],['dumpster',1800,1080,'meds'],['crate',300,1120,'scrap'],['crate',1500,900,'wood']].map(([sprite,x,y,t],id)=>({id,sprite,x,y,t,used:used.has(id)}));
    this.props=[['ruined-house',250,160,250],['grocery',1540,130,290],['gas-station',1550,1040,300],['sedan',540,620,150],['pickup',1470,670,165],['tree',180,650,170],['dead-tree',2010,430,165],['tree',410,1230,170],['fence',760,430,175],['barricade',1250,475,155],['lamp',750,850,125],['workbench',1100,790,150],['garden',900,950,165]];
    this.blockers=[{x:260,y:165,w:210,h:125},{x:1570,y:150,w:240,h:125},{x:1590,y:1070,w:250,h:110},{x:490,y:585,w:120,h:62},{x:1415,y:630,w:135,h:70}];
    this.constructions=(save.constructions||[]).map(c=>({...c,hp:c.hp??c.maxHp}));
  }
  makeNoise(x,y,radius){this.noise={x,y,radius};this.noiseLife=.8}
  update(dt){this.noiseLife-=dt;if(this.noiseLife<=0)this.noise=null}
  collisionObjects(){return[...this.blockers,...this.constructions.filter(c=>c.type!=='trap').map(c=>({...c,construction:c}))]}
  isBlocked(x,y,r){return!!CollisionSystem.hit(x,y,r,this.collisionObjects())}
  move(entity,dx,dy){entity.x=Math.max(entity.r,Math.min(this.w-entity.r,entity.x));entity.y=Math.max(entity.r,Math.min(this.h-entity.r,entity.y));return CollisionSystem.move(entity,dx,dy,this.collisionObjects())}
  addConstruction(c){this.constructions.push(c)}
  damageConstruction(c,n){c.hp-=n;if(c.hp<=0)this.constructions.splice(this.constructions.indexOf(c),1)}
  triggerTrap(z){const trap=this.constructions.find(c=>c.type==='trap'&&CollisionSystem.circleRect(z.x,z.y,z.r,c));if(!trap)return false;z.hit(95);this.constructions.splice(this.constructions.indexOf(trap),1);return true}
  spawnDrop(x,y){const types=['wood','scrap','food','meds'];this.drops.push({x,y,t:types[Math.floor(Math.random()*types.length)]})}
  interact(p){for(let i=this.drops.length-1;i>=0;i--){const d=this.drops[i];if(Math.hypot(d.x-p.x,d.y-p.y)<60){p.inventory[d.t]++;this.drops.splice(i,1);return`Coletado: ${d.t}`}}for(const c of this.containers){if(!c.used&&Math.hypot(c.x-p.x,c.y-p.y)<90){c.used=true;p.inventory[c.t]+=c.t==='meds'?1:3;return`Encontrado: ${c.t}`}}const b=this.base;if(p.x>b.x-60&&p.x<b.x+b.w+60&&p.y>b.y-60&&p.y<b.y+b.h+60&&b.hp<100){if(p.inventory.wood>=2){p.inventory.wood-=2;b.hp=Math.min(100,b.hp+20);return'Base reparada'}return'Madeira insuficiente (2)'}return null}
  drawGround(g){g.fillStyle='#475448';g.fillRect(0,0,this.w,this.h);g.fillStyle='#343a38';g.fillRect(0,520,this.w,320);g.fillRect(920,0,360,this.h);g.fillStyle='#555956';g.fillRect(0,590,this.w,180);g.fillRect(1000,0,200,this.h);g.strokeStyle='#c9b65a';g.lineWidth=5;g.setLineDash([45,38]);g.beginPath();g.moveTo(0,680);g.lineTo(this.w,680);g.moveTo(1100,0);g.lineTo(1100,this.h);g.stroke();g.setLineDash([])}
  drawObjects(g,a){const b=this.base,im=a.base(b.level)||a.prop('base');g.drawImage(im,b.x-32,b.y-5,b.w+64,b.h);g.fillStyle='#211d1c';g.fillRect(b.x,b.y-24,b.w,9);g.fillStyle='#b4443f';g.fillRect(b.x,b.y-24,b.w*b.hp/b.maxHp,9);const all=[...this.props,...this.containers.filter(c=>!c.used).map(c=>[c.sprite,c.x,c.y,100])].sort((u,v)=>u[2]-v[2]);for(const[name,x,y,s]of all){const pic=a.prop(name);if(pic?.complete)g.drawImage(pic,x-s/2,y-s*.72,s,s)}for(const c of this.constructions){const pic=a.prop(c.type),ratio=c.hp/c.maxHp;g.globalAlpha=.55+.45*ratio;if(pic?.complete)g.drawImage(pic,c.x,c.y-c.h*1.7,c.w,c.h*2.7);g.globalAlpha=1;if(c.type!=='trap'&&ratio<1){g.fillStyle='#241a19';g.fillRect(c.x,c.y-9,c.w,5);g.fillStyle='#c55b4e';g.fillRect(c.x,c.y-9,c.w*ratio,5)}}for(const d of this.drops){g.fillStyle=d.t==='wood'?'#c48d52':d.t==='scrap'?'#b9c2c6':d.t==='food'?'#d59b57':'#d95d65';g.beginPath();g.arc(d.x,d.y,10,0,6.3);g.fill()}}
  serialize(){return{baseHp:this.base.hp,baseLevel:this.base.level,looted:this.containers.filter(c=>c.used).map(c=>c.id),constructions:this.constructions.map(c=>({...c}))}}
}
