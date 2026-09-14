const pad=n=>String(n).padStart(2,'0');
const player=Array.from({length:16},(_,i)=>`assets/characters/survivor/frame-${pad(i)}.webp`);
const playerWeapons=['axe','machete','shotgun','rifle'].flatMap(w=>[0,1,2,3].map(i=>`assets/characters/survivor/weapons/${w}/frame-${i}.webp`));
const zombies={walker:[0,1,2,3].map(i=>`assets/zombies/walker/z-${pad(i)}.webp`),runner:[4,5,6,7].map(i=>`assets/zombies/runner/z-${pad(i)}.webp`),brute:[8,9,10,11].map(i=>`assets/zombies/brute/z-${pad(i)}.webp`)};
const deaths=['walker','runner','brute'].flatMap(t=>[0,1,2,3].map(i=>`assets/zombies/${t}/death/frame-${i}.webp`));
const items=['bat','axe','machete','pistol','shotgun','rifle','ammo','wood','scrap','food','medkit','fuel'].map(n=>`assets/items/${n}.webp`);
const effects=['pistol','heavy','slash','impact'].flatMap(e=>[0,1,2,3].map(i=>`assets/effects/${e}/frame-${i}.webp`));
const sharedProps=['barricade','fence','trap','crate','dumpster','tree','dead-tree','lamp'].map(n=>`assets/props/${n}.webp`);
const GROUPS={
  common:[...player,...playerWeapons,...Object.values(zombies).flat(),...deaths,...items,...effects,...sharedProps],
  base:['base','workbench'].map(n=>`assets/props/${n}.webp`).concat(['empty','growing','ready'].map(n=>`assets/props/farm/garden-${n}.webp`),['mara','rook','eli'].flatMap(n=>[0,1,2,3].map(i=>`assets/npcs/${n}/frame-${i}.webp`)),[1,2,3].map(i=>`assets/buildings/base-level-${i}.webp`),['assets/tiles/base-ground.webp']),
  residential:['ruined-house','sedan'].map(n=>`assets/props/${n}.webp`).concat(['assets/tiles/residential-asphalt.webp']),
  commercial:['grocery','gas-station','pickup'].map(n=>`assets/props/${n}.webp`).concat(['assets/tiles/commercial-concrete.webp']),
  houseInterior:['assets/props/interiors/house-furniture.webp','assets/tiles/interior-house.webp'],
  groceryInterior:['assets/props/interiors/grocery-shelf.webp','assets/tiles/interior-grocery.webp'],
  gasInterior:['assets/props/interiors/gas-counter.webp','assets/tiles/interior-gas.webp']
};

export class AssetLoader{
  constructor(){this.images=new Map();this.currentArea=null;this.failed=[]}
  async loadFiles(files,progress=()=>{}){const missing=[...new Set(files)].filter(src=>!this.images.has(src));if(!missing.length){progress(100);return}let done=0;await Promise.all(missing.map(src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{progress(Math.round(++done/missing.length*100));resolve()};im.onerror=()=>{this.images.delete(src);this.failed.push(src);reject(new Error(`Asset ausente: ${src}`))};im.src=src;this.images.set(src,im)})))}
  async loadInitial(area='base',progress=()=>{}){await this.loadFiles([...GROUPS.common,...(GROUPS[area]||GROUPS.base)],progress);this.currentArea=area}
  async loadArea(area,progress=()=>{}){await this.loadFiles(GROUPS[area]||[],progress)}
  activateArea(area){const previous=this.currentArea;if(previous&&previous!==area){const keep=new Set([...GROUPS.common,...(GROUPS[area]||[])]);for(const src of GROUPS[previous]||[])if(!keep.has(src))this.images.delete(src)}this.currentArea=area}
  load(progress=()=>{}){return this.loadInitial('base',progress)}
  get(path){return this.images.get(path)}
  player(i){return this.get(player[i%16])}
  playerWeapon(w,i){return this.get(`assets/characters/survivor/weapons/${w}/frame-${i%4}.webp`)}
  zombie(t,i){return this.get(zombies[t][i%4])}
  death(t,i){return this.get(`assets/zombies/${t}/death/frame-${i%4}.webp`)}
  prop(n){return n.startsWith('interior:')?this.get(`assets/props/interiors/${n.slice(9)}.webp`):this.get(`assets/props/${n}.webp`)}farm(state){return this.get(`assets/props/farm/garden-${state}.webp`)}item(n){return this.get(`assets/items/${n}.webp`)}effect(n,i){return this.get(`assets/effects/${n}/frame-${i%4}.webp`)}npc(n,i){return this.get(`assets/npcs/${n}/frame-${i%4}.webp`)}base(level){return this.get(`assets/buildings/base-level-${level}.webp`)}tile(name){return this.get(`assets/tiles/${name}.webp`)}
  stats(){return{loaded:this.images.size,area:this.currentArea,common:GROUPS.common.length,areaFiles:(GROUPS[this.currentArea]||[]).length}}
}
