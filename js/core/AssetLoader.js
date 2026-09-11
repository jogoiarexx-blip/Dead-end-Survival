const pad=n=>String(n).padStart(2,'0');
const weaponNames=['axe','machete','shotgun','rifle'],effectNames=['pistol','heavy','slash','impact'];
const manifest={
  player:Array.from({length:16},(_,i)=>`assets/characters/survivor/frame-${pad(i)}.webp`),
  playerWeapons:weaponNames.flatMap(w=>[0,1,2,3].map(i=>`assets/characters/survivor/weapons/${w}/frame-${i}.webp`)),
  walker:[0,1,2,3].map(i=>`assets/zombies/walker/z-${pad(i)}.webp`),runner:[4,5,6,7].map(i=>`assets/zombies/runner/z-${pad(i)}.webp`),brute:[8,9,10,11].map(i=>`assets/zombies/brute/z-${pad(i)}.webp`),
  deaths:['walker','runner','brute'].flatMap(t=>[0,1,2,3].map(i=>`assets/zombies/${t}/death/frame-${i}.webp`)),
  props:['base','ruined-house','grocery','gas-station','sedan','pickup','barricade','fence','crate','dumpster','dead-tree','tree','lamp','workbench','garden','trap'].map(n=>`assets/props/${n}.webp`),
  items:['bat','axe','machete','pistol','shotgun','rifle','ammo','wood','scrap','food','medkit','fuel'].map(n=>`assets/items/${n}.webp`),
  effects:effectNames.flatMap(e=>[0,1,2,3].map(i=>`assets/effects/${e}/frame-${i}.webp`)),
  npcs:['mara','rook','eli'].flatMap(n=>[0,1,2,3].map(i=>`assets/npcs/${n}/frame-${i}.webp`)),
  bases:[1,2,3].map(i=>`assets/buildings/base-level-${i}.webp`)
};
export class AssetLoader{
  constructor(){this.images=new Map()}
  async load(progress=()=>{}){const files=Object.values(manifest).flat();let done=0;await Promise.all(files.map(src=>new Promise(resolve=>{const im=new Image();im.onload=im.onerror=()=>{progress(Math.round(++done/files.length*100));resolve()};im.src=src;this.images.set(src,im)})))}
  get(path){return this.images.get(path)}player(i){return this.get(manifest.player[i%16])}playerWeapon(w,i){return this.get(`assets/characters/survivor/weapons/${w}/frame-${i%4}.webp`)}zombie(t,i){return this.get(manifest[t][i%4])}death(t,i){return this.get(`assets/zombies/${t}/death/frame-${i%4}.webp`)}prop(n){return this.get(`assets/props/${n}.webp`)}item(n){return this.get(`assets/items/${n}.webp`)}effect(n,i){return this.get(`assets/effects/${n}/frame-${i%4}.webp`)}npc(n,i){return this.get(`assets/npcs/${n}/frame-${i%4}.webp`)}base(level){return this.get(`assets/buildings/base-level-${level}.webp`)}
}
