# Dead End: Last Signal v1.0.0

Survival roguelite / auto-shooter original para navegador, criado por **Luis Paulo Alves**.

## Como iniciar

Use um servidor local na pasta do projeto. Exemplos:

- VS Code: extensão Live Server.
- Python: `python -m http.server 8080`.
- Node: `npx serve .`.

Abra o endereço exibido no navegador. Também funciona pelo GitHub Pages.

## Controles

- WASD ou setas: mover.
- Gamepad: analógico esquerdo; botão principal usa o especial.
- Celular: joystick virtual e botão Especial.
- Esc: pausar.

Os ataques básicos miram e disparam automaticamente.

## Conteúdo

- Seis personagens com atributos, armas, passivas e especiais distintos.
- Cinco áreas de campanha, cada uma com boss aos cinco minutos.
- Nove arquétipos de infectados, progressão de ondas e spawn fora da câmera.
- Seis armas iniciais com cadência, dano, projéteis, penetração e área próprios.
- Level-up com três escolhas, reroll e melhorias cumulativas.
- Laboratório permanente, arsenal, bestiário, estatísticas e conquistas.
- Dificuldades Normal, Difícil e Pesadelo.
- Qualidade automática/Baixa/Média/Alta, resolução adaptável e limite de 60/100/150 entidades.
- Object pooling, culling, carregamento por fase e descarregamento de imagens.
- Save com validação e backup no LocalStorage.
- PWA, teclado, gamepad e controles mobile.
- Áudio original sintetizado em tempo real com Web Audio.

## Fases

1. Bairro Abandonado — O Açougueiro.
2. Hospital Infectado — Paciente Zero.
3. Zona Industrial — Colosso Tóxico.
4. Floresta de Contenção — Predador Alfa.
5. Centro da Infecção — Paciente Ômega.

## Estrutura

- `js/core`: save e áudio.
- `js/data`: personagens, fases, inimigos, armas e melhorias.
- `js/game`: loop, entidades, pools, combate, IA, bosses e renderização.
- `assets`: sprites WebP, tiles, efeitos, itens e interface.
- `css`: interface responsiva.

O jogo não utiliza nomes, personagens, músicas ou artes de Vampire Survivors.