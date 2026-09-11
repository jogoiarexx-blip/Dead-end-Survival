import { Settings } from './Settings.js';
export class AudioManager{
  constructor(){this.ctx=null}
  ensure(){if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume()}
  play(type){this.ensure();const s=Settings.load(),ctx=this.ctx,o=ctx.createOscillator(),gain=ctx.createGain(),now=ctx.currentTime;const map={pistol:[145,.06,.28,'square'],shotgun:[82,.16,.42,'sawtooth'],rifle:[115,.1,.34,'square'],melee:[80,.09,.2,'sawtooth'],pickup:[660,.1,.12,'sine'],alert:[190,.5,.22,'square'],heal:[520,.22,.14,'sine'],level:[760,.4,.16,'triangle']}[type]||[250,.08,.1,'sine'];o.type=map[3];o.frequency.setValueAtTime(map[0],now);if(['pistol','shotgun','rifle'].includes(type))o.frequency.exponentialRampToValueAtTime(45,now+map[1]);if(type==='pickup'||type==='level')o.frequency.linearRampToValueAtTime(map[0]*1.5,now+map[1]);gain.gain.setValueAtTime(map[2]*s.masterVolume*s.effectsVolume,now);gain.gain.exponentialRampToValueAtTime(.001,now+map[1]);o.connect(gain).connect(ctx.destination);o.start(now);o.stop(now+map[1])}
}
