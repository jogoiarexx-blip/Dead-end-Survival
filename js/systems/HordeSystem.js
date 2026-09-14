export class HordeSystem{
  constructor(save={}){
    const legacy=save.completed==null;
    this.completed=save.completed??0;
    this.active=save.active??false;
    this.timer=this.active?0:(legacy?Math.max(300,save.timer??300):(save.timer??(this.completed===0?300:210)));
    this.wave=save.wave??(this.active?1:0);
    this.waveCooldown=save.waveCooldown??0;
    this.warningShown=false;
  }
  update(dt,game){
    if(game.maps.currentId!=='base')return;
    if(!this.active){
      this.timer=Math.max(0,this.timer-dt);
      if(this.timer<=20&&!this.warningShown){this.warningShown=true;game.alert('HORDA SE APROXIMANDO');}
      if(this.timer<=0){
        this.active=true;this.wave=1;this.waveCooldown=4.2;this.warningShown=false;
        game.alert('DEFENDA A BASE • ONDA 1/3');
        game.spawnHordeWave(this.wave);
      }
      return;
    }
    const alive=game.zombies.some(z=>z.hordeSpawn&&!z.dead);
    if(alive)return;
    if(this.wave<3){
      this.waveCooldown-=dt;
      if(this.waveCooldown<=0){
        this.wave++;this.waveCooldown=4.2;
        game.alert(`HORDA • ONDA ${this.wave}/3`);
        game.spawnHordeWave(this.wave);
      }
      return;
    }
    this.active=false;this.completed++;this.wave=0;this.waveCooldown=0;
    this.timer=this.completed===1?240:210;
    game.toast('Horda repelida! +30 sucata');
    game.player.inventory.scrap+=30;
  }
  serialize(){return{timer:this.timer,active:this.active,completed:this.completed,wave:this.wave,waveCooldown:this.waveCooldown}}
}
