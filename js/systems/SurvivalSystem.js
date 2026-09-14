export class SurvivalSystem {
  constructor(save = {}) {
    this.hunger = Math.max(0, Math.min(100, save.hunger ?? 100));
    this.damageTimer = 0;
  }

  update(dt, player) {
    this.hunger = Math.max(0, this.hunger - dt * .075 * (player.hungerMultiplier || 1));
    if (this.hunger > 0) {
      this.damageTimer = 0;
      return false;
    }
    this.damageTimer += dt;
    if (this.damageTimer < 4) return false;
    this.damageTimer = 0;
    player.hit(4);
    return true;
  }

  eat(player) {
    if (this.hunger >= 98) return { ok: false, msg: 'Você não está com fome' };
    if (player.inventory.food < 1) return { ok: false, msg: 'Nenhum alimento na mochila' };
    player.inventory.food--;
    this.hunger = Math.min(100, this.hunger + 34);
    player.stamina = Math.min(player.maxStamina || 100, player.stamina + 20);
    return { ok: true, msg: 'Alimento consumido: fome e energia recuperadas' };
  }

  recoverAfterDefeat() { this.hunger = Math.max(35, this.hunger); }
  serialize() { return { hunger: this.hunger }; }
}
