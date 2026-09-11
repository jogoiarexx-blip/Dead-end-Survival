export const QUESTS={
  medical_supplies:{title:'Suprimentos médicos',npc:'Mara',description:'Tenha 2 medkits na mochila.',reward:'60 XP e 3 alimentos'},
  fortify_base:{title:'Peças para Rook',npc:'Rook',description:'Entregue 8 sucatas.',reward:'80 XP e 6 madeiras'},
  clear_streets:{title:'Limpe as ruas',npc:'Eli',description:'Elimine 10 zumbis após aceitar.',reward:'110 XP e 5 munições de rifle'}
};
export class QuestSystem{
  constructor(save={}){this.states={medical_supplies:'available',fortify_base:'available',clear_streets:'available',...save.states};this.starts={...save.starts}}
  state(id){return this.states[id]||'available'}
  accept(id,game){if(this.state(id)!=='available')return{ok:false,msg:'Missão já registrada'};this.states[id]='active';this.starts[id]={kills:game.kills};return{ok:true,msg:`Missão aceita: ${QUESTS[id].title}`}}
  progress(id,game){if(id==='medical_supplies')return[Math.min(2,game.player.inventory.meds),2];if(id==='fortify_base')return[Math.min(8,game.player.inventory.scrap),8];if(id==='clear_streets')return[Math.min(10,game.kills-(this.starts[id]?.kills||0)),10];return[0,1]}
  canComplete(id,game){if(this.state(id)!=='active')return false;const[p,g]=this.progress(id,game);return p>=g}
  complete(id,game){if(!this.canComplete(id,game))return{ok:false,msg:'Objetivo ainda não concluído'};if(id==='fortify_base')game.player.inventory.scrap-=8;if(id==='medical_supplies'){game.player.inventory.food+=3;game.player.gainXP(60)}if(id==='fortify_base'){game.player.inventory.wood+=6;game.player.gainXP(80)}if(id==='clear_streets'){game.player.weapon.reserves.rifle+=5;game.player.gainXP(110)}this.states[id]='completed';return{ok:true,msg:`Missão concluída: ${QUESTS[id].title}`}}
  currentText(game){for(const[id,q]of Object.entries(QUESTS))if(this.state(id)==='active'){const[p,g]=this.progress(id,game);return`${q.title} (${p}/${g})`}return null}
  serialize(){return{states:this.states,starts:this.starts}}
}
