export class HordeSystem{
  constructor(save={}){this.timer=save.timer??105;this.active=save.active??false;this.warning=0}
  update(dt,game){if(!this.active)this.timer-=dt;if(!this.active&&this.timer<12&&this.warning<=0){this.warning=4;game.alert('HORDA SE APROXIMANDO')}this.warning-=dt;if(!this.active&&this.timer<=0){this.active=true;game.alert('DEFENDA A BASE');for(let i=0;i<10;i++)game.spawnZombie(i%5===0?'brute':i%3===0?'runner':'walker',true)}if(this.active&&!game.zombies.some(z=>z.hordeSpawn&&!z.dead)){this.active=false;this.timer=120;game.toast('Horda repelida! +30 sucata');game.player.inventory.scrap+=30}}
  serialize(){return{timer:this.timer,active:this.active}}
}
