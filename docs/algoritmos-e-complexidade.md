# ⚡ Algoritmos e Análise de Complexidade

Este documento detalha o comparativo teórico e experimental entre a abordagem ingênua (**Força Bruta**) e a abordagem espacial hierárquica (**Quadtree**) implementadas em [`src/simulation.js`](../src/simulation.js) e [`src/quadtree.js`](../src/quadtree.js).

---

## 📊 Comparativo Assintótico

| Estratégia | Construção / Frame | Consulta / Detecção | Complexidade Total por Frame | Uso Ideal |
| :--- | :---: | :---: | :---: | :--- |
| **Força Bruta** (`findPairsBruteForce`) | — | $\frac{N(N-1)}{2}$ pares | **$\mathcal{O}(N^2)$** | $N$ muito pequeno ($N \le 30$) |
| **Quadtree** (`findPairsQuadtree`) | $\mathcal{O}(N \log N)$ | $\mathcal{O}(N \log N)$ | **$\mathcal{O}(N \log N)$** | $N$ médio a grande (centenas/milhares) |

> **Critério de Eficiência Validado (`SC-002`):** Nos testes automatizados (`tests/simulation.test.js`), com **$N = 1.000$ partículas**, a Quadtree realiza **no máximo $1/10$ dos testes de colisão** em comparação à força bruta (redução $> 90\%$ de pares verificados).

---

## 🌳 Como Funciona a Quadtree (`src/quadtree.js`)

1. **Subdivisão Espacial (`Rect`):**
   * Cada nó cobre um retângulo alinhado aos eixos `(x, y, w, h)`.
   * O método `contains(px, py)` usa borda esquerda/superior inclusiva (`>=`) e direita/inferior exclusiva (`<`), garantindo que nenhum ponto na divisa pertença a dois quadrantes simultaneamente.
2. **Capacidade e Profundidade Máxima:**
   * `capacity = 4`: enquanto o nó folha possui menos de 4 itens, armazena diretamente em `this.items`.
   * Ao exceder a capacidade, `subdivide()` cria 4 quadrantes filhos (`NE`, `NW`, `SE`, `SW`) e redistribui os itens.
   * `maxDepth = 8`: impede recursão infinita caso várias partículas ocupem exatamente a mesma coordenada.
3. **Range Query & Rastreamento (`visited`):**
   * Para cada partícula $p$ de raio $r$, consulta-se o retângulo de busca centrado em $(p.x, p.y)$ com lado suficiente para capturar potenciais vizinhos (`2 * (r + maxRadius)`).
   * Nós cujo `boundary` não intersecta a região de busca (`!this.boundary.intersects(range)`) são **descartados inteiros** (poda espacial).
   * Quando `visited` é fornecido (no modo didático e testes), o algoritmo registra cada nó visitado e seu estado (`entered` vs. `pruned`) sem alterar o resultado final.

---

## 🔍 Modo Didático e `buildTrace()`

A função `buildTrace(particles, mode, width, height, maxRadius)` em `src/simulation.js` reproduz exatamente a mesma sequência de testes e pares da detecção normal, gerando um vetor `steps` estruturado:

* **Em Força Bruta:** Cada passo corresponde à inspeção de uma partícula $i$ contra $j > i$, registrando as linhas de teste (amarela = sem colisão, vermelha = colisão).
* **Em Quadtree:** Além dos testes de pares candidatos, cada passo intercala os nós da árvore visitados (ciano = região intersectada; vermelho = subárvore podada/descartada inteira).
