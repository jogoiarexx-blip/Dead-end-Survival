import {World} from './World.js';
import {MAPS,validMap} from './MapData.js';

export class MapManager{
  constructor(save={}){this.currentId=validMap(save.currentArea)?save.currentArea:'base';this.saved={...(save.areas||{})};if(save.legacyWorld&&!this.saved.base)this.saved.base=save.legacyWorld;this.worlds=new Map()}
  enter(id=this.currentId){if(!validMap(id))id='base';this.currentId=id;if(!this.worlds.has(id))this.worlds.set(id,new World(this.saved[id]||{},id));return this.worlds.get(id)}
  store(world){if(world)this.saved[world.area]=world.serialize()}
  transitionAt(player){return MAPS[this.currentId].exits.find(exit=>player.x>=exit.x&&player.x<=exit.x+exit.w&&player.y>=exit.y&&player.y<=exit.y+exit.h)||null}
  name(id=this.currentId){return MAPS[id]?.name||id}
  baseSnapshot(current){if(current?.area==='base'&&current.base)return current.base;const live=this.worlds.get('base');if(live?.base)return live.base;const saved=this.saved.base||{};return{hp:saved.baseHp??55,maxHp:[0,100,145,210][saved.baseLevel??1]}}
  serialize(current){this.store(current);return{currentArea:this.currentId,areas:{...this.saved}}}
}
