const LEVELS={2:{wood:10,scrap:8,maxHp:145},3:{wood:18,scrap:15,maxHp:210}};
export class BaseUpgradeSystem{
  upgrade(game){const b=game.world.base,next=b.level+1,cost=LEVELS[next];if(!cost)return{ok:false,msg:'A base já está no nível máximo'};const inv=game.player.inventory;if(inv.wood<cost.wood||inv.scrap<cost.scrap)return{ok:false,msg:`Requer ${cost.wood} madeira e ${cost.scrap} sucata`};inv.wood-=cost.wood;inv.scrap-=cost.scrap;b.level=next;b.maxHp=cost.maxHp;b.hp=b.maxHp;return{ok:true,msg:`Base melhorada para o nível ${next}`}}
  costText(base){const c=LEVELS[base.level+1];return c?`${c.wood} madeira + ${c.scrap} sucata`:'Nível máximo'}
}
