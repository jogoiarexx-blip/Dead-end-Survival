import { Player } from '../player/Player.js';
import { Zombie } from '../enemies/Zombie.js';
import { World } from '../world/World.js';
import { SaveSystem } from './SaveSystem.js';
import { Input } from './Input.js';
import { Camera } from './Camera.js';
import { AudioManager } from './AudioManager.js';
import { Settings } from './Settings.js';
import { DayNightSystem } from '../systems/DayNightSystem.js';
import { HordeSystem } from '../systems/HordeSystem.js';
import { BuildingSystem } from '../systems/BuildingSystem.js';
import { CraftingSystem, RECIPES } from '../systems/CraftingSystem.js';
import { NPCSystem } from '../systems/NPCSystem.js';
import { QuestSystem, QUESTS } from '../systems/QuestSystem.js';
import { BaseUpgradeSystem } from '../systems/BaseUpgradeSystem.js';
import { WEAPONS } from '../weapons/WeaponSystem.js';
const $ = id => document.getElementById(id);

export class Game {
  constructor(canvas, assets) {
    this.c = canvas;this.a = assets;this.settings = Settings.load();
    const [width,height] = this.settings.resolution.split('x').map(Number);canvas.width=width;canvas.height=height;
    this.quality=this.settings.quality==='auto'?(navigator.hardwareConcurrency<=4?'low':'medium'):this.settings.quality;
    this.g=canvas.getContext('2d',{alpha:false});this.audio=new AudioManager();this.input=new Input(canvas);this.camera=new Camera(width,height);
    this.save=SaveSystem.load();const worldSave=this.save.world||{baseHp:this.save.baseHp};this.world=new World(worldSave);this.player=new Player(1100,860,this.save.player);
    this.dayNight=new DayNightSystem(this.save.worldTime);this.horde=new HordeSystem(this.save.horde);this.building=new BuildingSystem();this.crafting=new CraftingSystem();this.npcs=new NPCSystem();this.quests=new QuestSystem(this.save.quests);this.baseUpgrades=new BaseUpgradeSystem();
    this.zombies=[];this.kills=this.save.kills||0;this.spawnTimer=0;this.paused=false;this.toastTimer=0;this.alertTimer=0;this.saveTimer=0;
    for(let i=0;i<(this.quality==='low'?7:10);i++)this.spawnZombie(i===6?'brute':i%4===0?'runner':'walker');
    if(this.horde.active)for(let i=0;i<8;i++)this.spawnZombie(i%4===0?'brute':i%3===0?'runner':'walker',true);
    addEventListener('beforeunload',()=>this.persist());
  }
  start(){this.last=performance.now();requestAnimationFrame(time=>this.loop(time))}
  loop(time){const dt=Math.min((time-this.last)/1000,.033);this.last=time;if(!this.paused)this.update(dt);this.draw();requestAnimationFrame(next=>this.loop(next))}
  spawnZombie(type,hordeSpawn=false){const edge=Math.floor(Math.random()*4);const x=edge===1?this.world.w-35:edge===3?35:Math.random()*this.world.w;const y=edge===0?35:edge===2?this.world.h-35:Math.random()*this.world.h;const z=new Zombie(x,y,type||Math.random()<.12?'brute':Math.random()<.32?'runner':'walker');z.hordeSpawn=hordeSpawn;this.zombies.push(z)}
  selectBuild(type){this.building.toggle(type);this.paused=false;$('buildHint').classList.toggle('show',!!this.building.mode);$('buildToolbar').classList.toggle('show',!!this.building.mode)}
  update(dt){
    this.spawnTimer+=dt;this.saveTimer+=dt;this.toastTimer-=dt;this.alertTimer-=dt;
    if(this.spawnTimer>(this.dayNight.night?3.5:6)&&this.zombies.length<18&&!this.horde.active){this.spawnTimer=0;this.spawnZombie()}
    this.world.update(dt);this.npcs.update(dt);this.dayNight.update(dt);this.player.update(dt,this.input,this.world);this.camera.follow(this.player,this.world,dt);
    const weaponKeys=['bat','pistol','axe','machete','shotgun','rifle'];for(let i=0;i<weaponKeys.length;i++)if(this.input.consume(String(i+1)))this.player.weapon.switch(weaponKeys[i]);if(this.input.consume('r'))this.player.weapon.reload();
    if(this.input.consume('i'))this.toggleInventory(true);if(this.input.consume('c'))this.toggleCrafting(true);if(this.input.consume('q'))this.toggleArsenal(true);
    if(this.input.consume('e')){const npc=this.npcs.nearest(this.player);if(npc)this.openNPC(npc);else{const msg=this.world.interact(this.player);if(msg){this.audio.play('pickup');this.toast(msg)}}}
    if(this.input.consume('b'))this.selectBuild(this.building.mode||'barricade');
    const target=this.camera.screenToWorld(this.input.mouse.x,this.input.mouse.y);this.building.update(target,this.player,this.world);
    if(this.building.mode&&this.input.mouse.pressed){const result=this.building.confirm(this.player,this.world);this.toast(result.msg);if(result.ok)this.audio.play('pickup')}
    for(const z of this.zombies){const far=Math.hypot(z.x-this.player.x,z.y-this.player.y)>900;if(far){z.farAccum+=dt;if(z.farAccum<.22)continue;z.update(z.farAccum,this.player,this.world,this.horde.active);z.farAccum=0}else z.update(dt,this.player,this.world,this.horde.active)}
    if(!this.building.mode&&(this.input.mouse.down||this.input.keys[' '])&&this.player.attackCooldown<=0){const melee=this.player.weapon.config.melee,hits=this.player.weapon.attack(target,this.zombies,this.world);this.audio.play(melee?'melee':this.player.weapon.current);for(const hit of hits)this.rewardDeath(hit);this.input.keys[' ']=false}
    for(const z of this.zombies)this.rewardDeath(z);this.zombies=this.zombies.filter(z=>!z.dead);this.horde.update(dt,this);
    if(this.world.base.hp<=0){this.world.base.hp=30;this.player.inventory.scrap=Math.max(0,this.player.inventory.scrap-5);this.alert('A BASE FOI INVADIDA')}
    if(this.player.hp<=0){this.player.hp=100;this.player.x=1100;this.player.y=860;this.player.inventory.food=Math.max(0,this.player.inventory.food-1);this.toast('Você retornou ferido à base')}
    if(this.saveTimer>12){this.persist();this.saveTimer=0}this.updateHUD();this.input.endFrame();
  }
  rewardDeath(z){if(!z.dying||z.rewarded)return;z.rewarded=true;this.kills++;this.world.spawnDrop(z.x,z.y);if(this.player.gainXP(z.xp)){this.audio.play('level');this.toast(`Nível ${this.player.level}! Vida restaurada`)}}
  mission(){const side=this.quests.currentText(this);if(side)return side;if(this.kills<5)return`Elimine zumbis (${this.kills}/5)`;if(this.player.inventory.wood<5)return`Colete madeira (${this.player.inventory.wood}/5)`;if(this.world.base.hp<75)return'Repare a base com E';if(this.world.constructions.length<2)return`Construa defesas (${this.world.constructions.length}/2)`;return'Converse com os sobreviventes na base'}
  updateHUD(){const p=this.player,w=p.weapon;$('hpBar').style.width=`${p.hp}%`;$('stBar').style.width=`${p.stamina}%`;$('wood').textContent=p.inventory.wood;$('scrap').textContent=p.inventory.scrap;$('food').textContent=p.inventory.food;$('meds').textContent=p.inventory.meds;$('ammo').textContent=w.config.melee?'∞':w.ammo;$('reserve').textContent=w.config.melee?'':w.reserve;$('weaponName').textContent=w.reloadLeft>0?'RECARREGANDO…':WEAPONS[w.current].name;$('weaponName').classList.toggle('reload-state',w.reloadLeft>0);$('weaponIcon').src=`assets/items/${w.current}.webp`;$('level').textContent=p.level;$('xpBar').style.width=`${p.xp/(p.level*100)*100}%`;$('clock').textContent=this.dayNight.label();$('missionText').textContent=this.mission();$('toast').classList.toggle('show',this.toastTimer>0);$('hordeAlert').style.opacity=this.alertTimer>0?1:0}
  toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');this.toastTimer=2.3}
  alert(msg){$('hordeAlert').innerHTML=`${msg}<small>Fortifique e defenda a casa</small>`;this.alertTimer=3.4;this.audio.play('alert')}
  toggleInventory(show){this.paused=show;const box=$('inventory'),icons={wood:'wood',scrap:'scrap',food:'food',meds:'medkit',fuel:'fuel'};box.classList.toggle('active',show);$('inventoryGrid').innerHTML=Object.entries(this.player.inventory).map(([key,value])=>`<div class="slot"><img src="assets/items/${icons[key]||key}.webp" alt=""><span>${key.toUpperCase()}</span><b>${value}</b></div>`).join('');box.querySelector('[data-close]').onclick=()=>{box.classList.remove('active');this.paused=false}}
  toggleCrafting(show){this.paused=show;const box=$('crafting');box.classList.toggle('active',show);$('craftingGrid').innerHTML=Object.entries(RECIPES).map(([id,r])=>`<button class="recipe" data-recipe="${id}"><img src="assets/items/${r.icon}.webp" alt=""><b>${r.label}</b><span>Nível ${r.level} • ${Object.entries(r.cost).map(([k,v])=>`${v} ${k}`).join(' + ')}</span></button>`).join('');box.querySelectorAll('[data-recipe]').forEach(button=>button.onclick=()=>{const result=this.crafting.craft(button.dataset.recipe,this);this.toast(result.msg);if(result.ok){this.audio.play('pickup');this.toggleCrafting(true)}});box.querySelector('[data-close]').onclick=()=>{box.classList.remove('active');this.paused=false}}
  toggleArsenal(show){this.paused=show;const box=$('arsenal'),order=['bat','pistol','axe','machete','shotgun','rifle'];box.classList.toggle('active',show);$('weaponGrid').innerHTML=order.map(name=>{const unlocked=this.player.weapon.unlocked[name];return`<button class="weapon-choice ${unlocked?'':'locked'} ${name===this.player.weapon.current?'active':''}" data-weapon="${name}" ${unlocked?'':'disabled'}><img src="assets/items/${name}.webp" alt=""><b>${WEAPONS[name].name}</b><small>${unlocked?'EQUIPAR':'BLOQUEADA'}</small></button>`}).join('');box.querySelectorAll('[data-weapon]').forEach(button=>button.onclick=()=>{if(this.player.weapon.switch(button.dataset.weapon)){this.audio.play('pickup');this.toggleArsenal(false)}});box.querySelector('[data-close]').onclick=()=>{box.classList.remove('active');this.paused=false}}
  openNPC(npc){this.paused=true;const box=$('npcDialog'),quest=QUESTS[npc.quest],state=this.quests.state(npc.quest),ready=this.quests.canComplete(npc.quest,this);$('npcName').textContent=`${npc.name} • ${npc.role}`;$('npcText').innerHTML=`${npc.greeting}<br><br><b>${quest.title}</b><br>${quest.description}<br><small>Recompensa: ${quest.reward}</small>`;const actions=[];if(state==='available')actions.push(`<button data-action="accept" class="primary">ACEITAR MISSÃO</button>`);if(ready)actions.push(`<button data-action="complete" class="primary">CONCLUIR MISSÃO</button>`);if(state==='active'&&!ready){const[p,g]=this.quests.progress(npc.quest,this);actions.push(`<button disabled>EM PROGRESSO ${p}/${g}</button>`)}actions.push(`<button data-action="trade">TROCAR RECURSOS</button>`);if(npc.id==='rook')actions.push(`<button data-action="upgrade">MELHORAR BASE • ${this.baseUpgrades.costText(this.world.base)}</button>`);$('npcActions').innerHTML=actions.join('');box.classList.add('active');const accept=box.querySelector('[data-action="accept"]'),complete=box.querySelector('[data-action="complete"]'),trade=box.querySelector('[data-action="trade"]'),upgrade=box.querySelector('[data-action="upgrade"]');if(accept)accept.onclick=()=>{const r=this.quests.accept(npc.quest,this);this.toast(r.msg);this.openNPC(npc)};if(complete)complete.onclick=()=>{const r=this.quests.complete(npc.quest,this);if(r.ok)this.audio.play('level');this.toast(r.msg);this.openNPC(npc)};if(trade)trade.onclick=()=>{const r=this.tradeNPC(npc.id);if(r.ok)this.audio.play('pickup');this.toast(r.msg);this.openNPC(npc)};if(upgrade)upgrade.onclick=()=>{const r=this.baseUpgrades.upgrade(this);if(r.ok)this.audio.play('level');this.toast(r.msg);this.openNPC(npc)};box.querySelector('[data-close]').onclick=()=>{box.classList.remove('active');this.paused=false}}
  tradeNPC(id){const p=this.player;if(id==='mara'){if(p.inventory.food<2)return{ok:false,msg:'Mara pede 2 alimentos'};p.inventory.food-=2;p.inventory.meds++;return{ok:true,msg:'Troca concluída: +1 medkit'}}if(id==='rook'){if(p.inventory.scrap<3)return{ok:false,msg:'Rook pede 3 sucatas'};p.inventory.scrap-=3;p.weapon.reserves.light+=18;return{ok:true,msg:'Troca concluída: +18 munições'}}if(p.inventory.food<2)return{ok:false,msg:'Eli pede 2 alimentos'};p.inventory.food-=2;p.weapon.reserves.rifle+=3;return{ok:true,msg:'Troca concluída: +3 munições de rifle'}}
  useMedkit(){if(this.player.inventory.meds>0&&this.player.hp<100){this.player.inventory.meds--;this.player.hp=Math.min(100,this.player.hp+45);this.audio.play('heal');this.toast('Medkit usado');this.toggleInventory(false);this.paused=false}}
  persist(){SaveSystem.save({version:'0.2.3',player:this.player.serialize(),kills:this.kills,world:this.world.serialize(),worldTime:this.dayNight.time,horde:this.horde.serialize(),quests:this.quests.serialize()})}
  draw(){const g=this.g;g.clearRect(0,0,this.c.width,this.c.height);g.save();g.translate(-this.camera.x,-this.camera.y);this.world.drawGround(g);this.world.drawObjects(g,this.a);this.building.draw(g,this.a);this.npcs.draw(g,this.a,this.quests,this);const pad=180,actors=[...this.zombies,this.player].filter(o=>o.x>this.camera.x-pad&&o.x<this.camera.x+this.camera.w+pad&&o.y>this.camera.y-pad&&o.y<this.camera.y+this.camera.h+pad).sort((u,v)=>u.y-v.y);for(const actor of actors)actor.draw(g,this.a);this.player.weapon.draw(g,this.a);g.restore();this.dayNight.draw(g,this.c.width,this.c.height)}
}
