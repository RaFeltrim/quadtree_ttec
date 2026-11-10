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
