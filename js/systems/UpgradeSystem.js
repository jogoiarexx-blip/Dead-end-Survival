export const UPGRADES={
  vitality:{name:'VITALIDADE',description:'+15 de vida máxima por nível',max:3},
  endurance:{name:'VIGOR',description:'+12 de stamina e regeneração por nível',max:3},
  power:{name:'FORÇA',description:'+12% de dano com todas as armas por nível',max:3},
  reload:{name:'RECARGA',description:'+12% de velocidade de recarga por nível',max:3},
  mobility:{name:'MOBILIDADE',description:'+4% de velocidade de movimento por nível',max:3},
  metabolism:{name:'METABOLISMO',description:'Fome diminui 15% mais devagar por nível',max:3}
};

export class UpgradeSystem{
  purchase(id,game){const data=UPGRADES[id],p=game.player;if(!data)return{ok:false,msg:'Melhoria desconhecida'};const rank=p.upgradeRanks[id]||0;if(rank>=data.max)return{ok:false,msg:`${data.name} já está no máximo`};if(p.skillPoints<1)return{ok:false,msg:'Você não possui pontos de melhoria'};const oldHp=p.maxHp,oldStamina=p.maxStamina;p.skillPoints--;p.upgradeRanks[id]=rank+1;p.recalculateStats();p.hp=Math.min(p.maxHp,p.hp+(p.maxHp-oldHp));p.stamina=Math.min(p.maxStamina,p.stamina+(p.maxStamina-oldStamina));return{ok:true,msg:`${data.name} melhorada para ${rank+1}/${data.max}`}}
}
