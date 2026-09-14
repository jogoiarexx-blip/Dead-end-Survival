const ITEMS=['wood','scrap','food','meds','fuel'];
const LABELS={wood:'Madeira',scrap:'Sucata',food:'Comida',meds:'Medkits',fuel:'Combustível'};

export class BaseFacilitiesSystem{
  constructor(save={}){
    this.storage={wood:0,scrap:0,food:0,meds:0,fuel:0,...save.storage};
    const plots=Array.isArray(save.plots)?save.plots:[];
    this.plots=Array.from({length:3},(_,i)=>({plantedAt:null,readyAt:null,...plots[i]}));
    this.points={storage:{x:1450,y:920,r:105},farm:{x:730,y:1020,r:190}};
  }
  now(clock){return(Math.max(1,clock.day)-1)*1440+clock.time}
  capacity(level=1){return[0,40,80,140][Math.max(1,Math.min(3,level))]}
  used(){return ITEMS.reduce((sum,key)=>sum+(this.storage[key]||0),0)}
  unlocked(level=1){return Math.max(1,Math.min(3,level))}
  nearby(player){for(const[id,p]of Object.entries(this.points))if(Math.hypot(player.x-p.x,player.y-p.y)<=p.r)return id;return null}
  hint(player){const id=this.nearby(player);return id==='storage'?'E • ABRIR DEPÓSITO':id==='farm'?'E • CUIDAR DA HORTA':''}
  transfer(item,direction,amount,player,level=1){
    if(!ITEMS.includes(item))return{ok:false,msg:'Item inválido'};
    const bag=player.inventory,all=amount==='all';
    if(direction==='deposit'){
      const room=this.capacity(level)-this.used(),wanted=all?bag[item]:1,moved=Math.min(bag[item]||0,room,wanted);
      if(moved<=0)return{ok:false,msg:room<=0?'Depósito cheio':`Nenhum item para guardar`};
      bag[item]-=moved;this.storage[item]+=moved;return{ok:true,msg:`${moved} ${LABELS[item].toLowerCase()} guardado${moved>1?'s':''}`};
    }
    const wanted=all?this.storage[item]:1,moved=Math.min(this.storage[item]||0,wanted);
    if(moved<=0)return{ok:false,msg:'Nada desse item no depósito'};
    this.storage[item]-=moved;bag[item]=(bag[item]||0)+moved;return{ok:true,msg:`${moved} ${LABELS[item].toLowerCase()} retirado${moved>1?'s':''}`};
  }
  plotState(index,clock){const plot=this.plots[index];if(plot.readyAt==null)return'empty';return this.now(clock)>=plot.readyAt?'ready':'growing'}
  progress(index,clock){const plot=this.plots[index];if(plot.readyAt==null)return 0;const duration=720;return Math.max(0,Math.min(1,1-(plot.readyAt-this.now(clock))/duration))}
  plant(index,player,clock,level=1){
    if(index>=this.unlocked(level))return{ok:false,msg:'Melhore a base para liberar este canteiro'};
    if(this.plotState(index,clock)!=='empty')return{ok:false,msg:'Este canteiro já está ocupado'};
    if((player.inventory.food||0)<1)return{ok:false,msg:'É preciso 1 alimento para obter sementes'};
    player.inventory.food--;const plantedAt=this.now(clock);this.plots[index]={plantedAt,readyAt:plantedAt+720};return{ok:true,msg:'Plantado: colheita pronta em 12 horas'};
  }
  harvest(index,player,clock,level=1){
    if(index>=this.unlocked(level))return{ok:false,msg:'Canteiro bloqueado'};
    if(this.plotState(index,clock)!=='ready')return{ok:false,msg:'A plantação ainda não está pronta'};
    player.inventory.food=(player.inventory.food||0)+4;this.plots[index]={plantedAt:null,readyAt:null};return{ok:true,msg:'Colheita concluída: +4 alimentos'};
  }
  draw(g,assets,player,clock,level=1){
    const now=this.now(clock),near=this.nearby(player);g.save();g.textAlign='center';g.font='bold 12px Segoe UI';
    for(const[id,p]of Object.entries(this.points)){const active=near===id;g.fillStyle=active?'#b7d35b':'#dce5df';g.globalAlpha=active?1:.72;g.beginPath();g.arc(p.x,p.y-82,active?9:6,0,Math.PI*2);g.fill();g.fillText(id==='storage'?'DEPÓSITO':'HORTA',p.x,p.y-98)}
    const farm=this.points.farm,open=this.unlocked(level);for(let i=0;i<3;i++){const plot=this.plots[i],locked=i>=open,state=locked||plot.readyAt==null?'empty':now>=plot.readyAt?'ready':'growing',x=farm.x+(i-1)*112,pic=assets.farm(state);g.globalAlpha=locked?.3:1;if(pic?.complete)g.drawImage(pic,x-66,farm.y-62,132,84);g.globalAlpha=1;if(!locked&&state==='growing'){g.fillStyle='#242b25';g.fillRect(x-39,farm.y+28,78,6);g.fillStyle='#b7d35b';g.fillRect(x-39,farm.y+28,78*this.progress(i,clock),6)}if(locked){g.fillStyle='#d5ddd7';g.font='bold 16px Segoe UI';g.fillText('🔒',x,farm.y-8)}}g.restore();
  }
  serialize(){return{storage:{...this.storage},plots:this.plots.map(plot=>({...plot}))}}
}

export{ITEMS as FACILITY_ITEMS,LABELS as FACILITY_LABELS};
