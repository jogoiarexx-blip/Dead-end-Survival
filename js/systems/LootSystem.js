const TABLES = {
  crate: [
    { item: 'wood', min: 2, max: 4 },
    { item: 'scrap', min: 1, max: 2, chance: .55 }
  ],
  dumpster: [
    { item: 'scrap', min: 2, max: 4 },
    { item: 'food', min: 1, max: 2, chance: .45 }
  ],
  sedan: [
    { item: 'scrap', min: 2, max: 4 },
    { item: 'fuel', min: 1, max: 2, chance: .65 },
    { item: 'lightAmmo', min: 5, max: 12, chance: .45 }
  ],
  pickup: [
    { item: 'fuel', min: 1, max: 3 },
    { item: 'wood', min: 1, max: 3, chance: .7 },
    { item: 'scrap', min: 1, max: 3, chance: .7 }
  ],
  'interior:house-furniture':[
    {item:'wood',min:2,max:5},{item:'meds',min:1,max:1,chance:.38},{item:'food',min:1,max:2,chance:.45}
  ],
  'interior:grocery-shelf':[
    {item:'food',min:2,max:5},{item:'meds',min:1,max:2,chance:.32},{item:'scrap',min:1,max:2,chance:.5}
  ],
  'interior:gas-counter':[
    {item:'fuel',min:2,max:4},{item:'scrap',min:2,max:4},{item:'lightAmmo',min:6,max:14,chance:.55}
  ]
};

const LABELS = { wood: 'madeira', scrap: 'sucata', food: 'comida', fuel: 'combustível', meds: 'medkit', lightAmmo: 'munição' };
const amount = ({ min, max }) => min + Math.floor(Math.random() * (max - min + 1));

export class LootSystem {
  open(container, player, night = false) {
    const rewards = [];
    for (const entry of TABLES[container.sprite] || TABLES.crate) {
      if (entry.chance && Math.random() > entry.chance) continue;
      rewards.push({ item: entry.item, amount: amount(entry) });
    }
    if (night && Math.random() < .28) rewards.push({ item: 'meds', amount: 1, rare: true });
    for (const reward of rewards) {
      if (reward.item === 'lightAmmo') player.weapon.reserves.light += reward.amount;
      else player.inventory[reward.item] = (player.inventory[reward.item] || 0) + reward.amount;
    }
    const text = rewards.map(r => `${r.rare ? '★ ' : ''}+${r.amount} ${LABELS[r.item]}`).join(' • ');
    return night ? `Busca noturna: ${text}` : `Encontrado: ${text}`;
  }
}
