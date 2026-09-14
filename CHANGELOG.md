# Dead End Survival — Changelog

## 0.3.0 — Interiores exploráveis

- Casa abandonada acessível pelo Bairro Residencial.
- Mercado e loja do posto acessíveis pela Zona Comercial.
- Cada prédio é um mapa independente com loading de entrada e saída.
- Três pisos inéditos em WebP: madeira gasta, cerâmica comercial e vinil xadrez.
- Três props inéditos com transparência: móveis destruídos, prateleira e balcão do posto.
- Paredes internas limitam o movimento e evitam saída pelas bordas do mapa.
- Objetos grandes possuem colisão coerente com o sprite.
- Casa fornece madeira, comida e chance de medkit.
- Mercado prioriza comida e suprimentos médicos.
- Posto prioriza combustível, sucata e chance de munição.
- Props pesquisáveis permanecem visíveis depois do loot e o estado vasculhado fica salvo.
- População interna reduzida para manter o ritmo e o desempenho em áreas pequenas.
- Construção bloqueada dentro de prédios, evitando defesas sobre móveis e paredes.
- Entradas e saídas externas também rejeitam construções para nunca bloquear a passagem.
- Assets internos são descarregados ao retornar para a rua.
- Saves anteriores continuam compatíveis e recebem os novos mapas sob demanda.

## 0.2.9 — Sprites da horta

- O antigo canteiro decorativo único foi substituído por três canteiros reais no cenário.
- Sprite WebP exclusivo para canteiro vazio com terra preparada.
- Sprite WebP exclusivo para plantação crescendo com mudas em fileiras.
- Sprite WebP exclusivo para colheita pronta com vegetais maduros.
- Canteiros bloqueados continuam visíveis, porém escurecidos, até a evolução da base.
- Barras de crescimento agora complementam os sprites em vez de representar a horta inteira.
- A interface da horta exibe o sprite correspondente ao estado de cada plantação.
- Novos sprites têm transparência real, recorte limpo e tamanho reduzido para o jogo.
- O depósito continua usando seu sprite de caixa e os recursos mantêm ícones próprios.
- Carregamento sob demanda inclui os canteiros somente no mapa do Refúgio.

## 0.2.8 — Base viva

- Caixa próxima à casa agora funciona como depósito persistente de recursos.
- Madeira, sucata, comida, medkits e combustível podem ser guardados ou retirados individualmente.
- Ações rápidas permitem guardar ou retirar todos os recursos disponíveis.
- Capacidade do depósito escala com a base: 40, 80 e 140 itens.
- Horta do Refúgio transformada em sistema funcional com três canteiros.
- Cada plantio consome 1 alimento como sementes, amadurece em 12 horas e rende 4 alimentos.
- Segundo e terceiro canteiros são liberados ao melhorar a base com Rook.
- Interface mostra estado vazio, progresso, horas restantes, colheita pronta e bloqueios.
- Indicadores leves são desenhados diretamente no cenário sem adicionar novos assets ao carregamento.
- Conteúdo do depósito e cronômetros dos canteiros são preservados pelo save automático.
- Saves das versões anteriores recebem instalações vazias automaticamente, sem perder progresso.
- Interface das instalações se adapta a telas pequenas e controles por toque.

## 0.2.7 — Mundo dividido e streaming de áreas

- Mundo separado em três mapas funcionais: Refúgio, Bairro Residencial e Zona Comercial.
- Passagens nas bordas permitem viajar entre mapas com posição de chegada segura.
- Loading real aparece em toda troca e carrega somente os assets da próxima área.
- Assets exclusivos do mapa anterior são descarregados após uma transição concluída.
- Save agora preserva mapa atual, contêineres vasculhados e construções por área.
- Saves antigos são migrados automaticamente para o novo mapa do Refúgio.
- Três tiles de chão inéditos foram gerados, integrados e otimizados em WebP.
- Tiles de grama/terra, asfalto rachado e concreto comercial usam repetição sem emendas.
- Animações do jogador agora usam direção, espelhamento, balanço suave, dano, interação e coleta.
- Zumbis ganharam direção visual, quadro de ataque, reação ao dano e movimento mais fluido.
- Quantidade de zumbis, frequência da IA distante e população inicial respeitam a qualidade gráfica.
- Renderização evita novas listas filtradas desnecessárias e mantém culling por câmera.
- Limites do mapa corrigidos para impedir entidades de ultrapassarem as bordas em movimentos rápidos.
- Hordas e NPCs são atualizados somente no Refúgio, evitando processamento fora da área ativa.
- Saídas do Refúgio ficam bloqueadas durante hordas para impedir abandono ou recompensa indevida.
- Kit de reparo agora informa corretamente quando o jogador está longe da base.

## 0.2.6 — Evolução do sobrevivente

- Cada nível conquistado agora concede um ponto de melhoria permanente.
- Nova interface funcional de progressão, acessível pelo botão de seta ou tecla U.
- Seis melhorias com três níveis: vitalidade, vigor, força, recarga, mobilidade e metabolismo.
- Vitalidade aumenta a vida máxima e vigor aumenta stamina máxima e regeneração.
- Força aumenta o dano real de armas corpo a corpo e de fogo.
- Recarga reduz o tempo real dos carregadores; mobilidade aumenta a velocidade de movimento.
- Metabolismo reduz gradualmente a velocidade de perda de fome.
- Progressão e pontos não gastos agora são persistidos no save.
- Saves antigos recebem automaticamente os pontos correspondentes ao nível já alcançado.
- Ganhos grandes de XP agora podem subir múltiplos níveis corretamente.
- HUD mostra pontos disponíveis e calcula vida/stamina proporcionalmente aos novos limites.
- Medkits e recuperação após derrota agora respeitam a vida máxima melhorada.

## 0.2.5 — Sobrevivência e exploração

- Sistema gradual de fome com dano controlado apenas no nível crítico.
- Comida agora pode ser consumida pela mochila para restaurar fome e stamina.
- Indicador de fome funcional adicionado ao HUD, com alerta visual crítico.
- Caixas, lixeiras, sedans e pickups agora possuem tabelas de loot próprias.
- Exploração noturna pode conceder loot médico raro.
- Drops no chão agora usam seus sprites WebP em vez de círculos provisórios.
- Sedans e pickups tornaram-se contêineres exploráveis e permanecem salvos após a busca.
- Reparo manual corrigido para respeitar a vida máxima das bases de nível 2 e 3.
- Dia atual agora persiste corretamente no save, mantendo compatibilidade com saves antigos.
- Cache de colisões reduz alocações repetidas durante a atualização dos zumbis.
- Culling de objetos, construções e drops reduz draw calls fora da câmera.
- Três cópias antigas e sem uso dos sprites da base foram removidas do pacote.

## 0.2.4 — Correção de estabilidade

- Corrigida falha da IA ao atingir um zumbi fora do campo de visão.
- Estados de perseguição e investigação agora validam o alvo antes de acessar sua posição.
- Zumbis alertados por dano passam a perseguir o jogador com um alvo válido.
- Favicon local adicionado para eliminar erros 404 no navegador.

## 0.2.3 — Sobreviventes da base

- Mara, Rook e Eli adicionados com sprites e animações próprios.
- Sistema modular de NPCs, proximidade e diálogos interativos.
- Três missões secundárias com aceite, progresso, conclusão e recompensas.
- Mara troca alimentos por medkits.
- Rook troca sucata por munição e gerencia melhorias da base.
- Eli troca alimentos por munição de rifle.
- Base agora possui três níveis funcionais e visuais.
- Níveis superiores aumentam a vida máxima da casa para 145 e 210.
- Novos sprites WebP transparentes para cada estágio da base.
- Indicadores visuais distinguem missões disponíveis e prontas para concluir.
- Objetivo do HUD acompanha a missão secundária ativa.
- Estado das missões e nível da base incluídos no save automático.
- Kit de reparo corrigido para respeitar a vida máxima do nível atual.

## 0.2.2 — Arsenal do sobrevivente

- Machado, machete, shotgun e rifle implementados de verdade.
- Novas armas precisam ser fabricadas e respeitam requisito de nível.
- Seis armas com dano, alcance, cadência, ruído, stamina e recuo próprios.
- Shotgun com seis projéteis e dispersão; rifle com alto dano e longo alcance.
- Munições leves, cartuchos e munições de rifle independentes.
- Carregadores e tempos de recarga individuais, salvos entre sessões.
- Arsenal visual com bloqueio, seleção por mouse/toque e atalhos de 1 a 6.
- Dezesseis novos quadros WebP do protagonista usando as novas armas.
- Dezesseis efeitos WebP para muzzle flash, tiro pesado, corte e impacto.
- Knockback nos zumbis e golpes corpo a corpo capazes de atingir vários alvos.
- Migração compatível com os saves da v0.2.1.
- Sons procedurais diferenciados para pistola, shotgun e rifle.

## 0.2.1 — Fortificação e combate

- Colisão real com prédios, carros, cercas e construções.
- Movimento com deslizamento lateral para evitar travamentos em quinas.
- Modo construção com preview, grade, alcance e validação de posição.
- Barricadas, cercas e armadilhas com custos e durabilidade próprios.
- Zumbis atacam e destroem defesas; armadilhas causam dano e são consumidas.
- Durante hordas, parte dos inimigos prioriza atacar a base.
- Crafting funcional de munição e medkits.
- Construções e contêineres vasculhados agora permanecem salvos.
- Animações WebP de dano, queda e morte para os três tipos de zumbi.
- Ícones WebP próprios para armas, munição e recursos no inventário e HUD.
- Hordas identificam seus próprios inimigos e terminam corretamente.
- Correções no ponto inicial, persistência e recompensa de eliminações.

## 0.2.0 — Reconstrução jogável

- Substituição dos desenhos provisórios por assets raster WebP.
- 16 quadros do sobrevivente, 12 quadros de zumbis e 16 props recortados.
- Walker, Runner e Brute com visual, velocidade, vida, dano, visão e XP próprios.
- Novo bairro de 2200 × 1400 com câmera suave e culling de inimigos.
- IA com patrulha, visão, audição, investigação, perseguição e ataque.
- Pistola e taco com dano, alcance, cadência, stamina, munição e ruído.
- Rastros de tiro, loot, contêineres, inventário, medkit e recursos.
- Base reparável, barricadas construíveis e sequência inicial de objetivos.
- Níveis, XP, ciclo dia/noite, hordas, aviso e recompensa.
- Menu com background próprio, loading real, pausa, créditos e HUD responsivo.
- Resoluções 1080p, 720p e 480p e perfis gráficos baixo, médio, alto e automático.
- Controles para teclado, mouse e dispositivos móveis.
- Save automático de posição, vida, inventário, nível, XP, armas, base e horário.
- Áudio procedural centralizado para ações essenciais, sem dependências externas.

## 0.1.0 — Protótipo recuperado

- Movimento básico, tiro, coleta, reparo e dois tipos iniciais de zumbi.
