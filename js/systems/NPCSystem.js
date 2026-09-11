const DATA={
  mara:{name:'Mara',role:'Médica',x:955,y:900,quest:'medical_supplies',greeting:'Os remédios estão acabando. Se encontrar suprimentos médicos, eu consigo manter todos de pé.'},
  rook:{name:'Rook',role:'Mecânico',x:1110,y:915,quest:'fortify_base',greeting:'Esta casa ainda está vulnerável. Traga sucata e eu reforço o que for preciso.'},
  eli:{name:'Eli',role:'Batedor',x:1270,y:895,quest:'clear_streets',greeting:'Há mortos demais rondando as ruas. Reduza o número deles e teremos uma rota segura.'}
};
export class NPCSystem{
  constructor(){this.npcs=Object.entries(DATA).map(([id,data],i)=>({id,...data,anim:i*.7}))}
  update(dt){for(const npc of this.npcs)npc.anim+=dt*2.2}
  nearest(player){let best=null,distance=90;for(const npc of this.npcs){const d=Math.hypot(npc.x-player.x,npc.y-player.y);if(d<distance){best=npc;distance=d}}return best}
  draw(g,assets,quests,game){for(const npc of this.npcs){const im=assets.npc(npc.id,Math.floor(npc.anim)%4);if(im?.complete)g.drawImage(im,npc.x-48,npc.y-78,96,96);const state=quests.state(npc.quest),ready=quests.canComplete(npc.quest,game);g.font='bold 13px Segoe UI';g.textAlign='center';g.fillStyle='#ecf1ed';g.fillText(npc.name,npc.x,npc.y+27);if(state==='available'||ready){g.font='bold 25px Segoe UI';g.fillStyle=ready?'#b7d35b':'#f2c75c';g.fillText(ready?'?':'!',npc.x,npc.y-78)}}g.textAlign='left'}
}
