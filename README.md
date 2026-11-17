# Quadtree: colisão de partículas

Demo didática que compara a detecção de colisão entre partículas por **força bruta**
(todos contra todos) e por uma **Quadtree** implementada do zero.

## Como abrir

Abra o `index.html` direto no navegador. Não precisa de servidor, build nem instalação.

Controles:

- **Partículas**: quantidade (10–2000); ao soltar o slider a simulação recomeça.
- **Raio**: 2, 4, 8, 16 ou 32 px; recomeça a simulação.
- **Modo**: alterna entre força bruta e Quadtree sem recomeçar.
- **Mostrar grade**: desenha as subdivisões da Quadtree.
- **Arrastar o mouse**: seleciona uma região e destaca as partículas encontradas pela
  range query. Um clique simples limpa a seleção.

O painel mostra FPS, número de partículas, testes de colisão por frame e o modo atual.

## Modo didático

Mostra o algoritmo encontrando uma colisão, uma iteração por vez. Liga com o botão
**Modo didático** (até 200 partículas; com poucas, ~20, fica mais fácil acompanhar).

A animação continua rodando até duas partículas colidirem. Aí ela pausa, antes do
ricochete, e mostra a detecção daquele frame desde o primeiro passo. As duas partículas
que colidiram ficam **verdes** durante toda a apresentação.

- **→ / ←**: próximo / anterior passo.
- **Shift + → / ←**: próxima / anterior partícula.
- **Enter**: vai direto ao teste da colisão que disparou a pausa.
- **Esc** (ou → no último passo): encerra, resolve as colisões e retoma a animação.
- **Botão de modo**: refaz os passos do mesmo frame com o outro algoritmo.

Depois de encerrar, por 5 segundos as colisões não pausam (o painel mostra a contagem);
depois disso, a próxima colisão pausa de novo.

Na tela: a partícula analisada tem um anel branco; em Quadtree, o quadrado tracejado é
a região de busca, os nós em ciano tocaram a região (a busca desce por eles) e os
vermelhos foram descartados inteiros. Cada teste é uma linha entre as duas partículas:
amarela sem colisão, vermelha com colisão. Outras colisões encontradas no frame ficam
vermelhas. Durante a apresentação o mouse é ignorado.

## Como testar

```bash
node --test
```

Os testes cobrem só a lógica pura (`src/particle.js`, `src/quadtree.js`,
`src/simulation.js`), sem dependências externas.

## Estrutura

```text
index.html, style.css
src/particle.js     partícula, quique nas bordas e ricochete
src/quadtree.js     Rect e Quadtree (insert, subdivide, query)
src/simulation.js   passo do frame e detecção (força bruta / Quadtree)
src/renderer.js     desenho no canvas
src/main.js         controles, mouse e loop de animação
tests/              testes com node:test
```
