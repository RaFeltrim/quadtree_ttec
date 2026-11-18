# Quadtree — Colisão de Partículas & Modo Didático (2026)

[![JavaScript](https://img.shields.io/badge/Stack-Vanilla%20JS%20%2B%20Canvas-f7df1e.svg)](./index.html)
[![Dependencies](https://img.shields.io/badge/Dependências-Zero-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/Testes-31%2F31%20Passando-success.svg)](./tests)
[![Architecture](https://img.shields.io/badge/Graphify-294%20Nós%20%7C%20417%20Arestas-blue.svg)](./graphify-out/GRAPH_REPORT.md)

Aplicação web interativa e didática que compara a detecção de colisão entre partículas por **Força Bruta** ($\mathcal{O}(N^2)$) e por uma **Quadtree Espacial** ($\mathcal{O}(N \log N)$) implementada do zero em JavaScript puro, sem dependências externas, sem *bundler* e com inspeção passo a passo disparada por colisão.

---

## 📌 Informações Gerais

- **Objetivo:** Demonstrar visualmente o ganho de eficiência da subdivisão espacial por Quadtree frente à força bruta e permitir a inspeção didática de cada teste de colisão e poda de quadrantes.
- **Execução:** Direto no navegador abrindo [`index.html`](./index.html) (sem servidor ou instalação).
- **Restrições Arquiteturais:** Código em JS puro compatível simultaneamente com `<script>` clássico no navegador e `require`/`node --test` no Node.js (ver [Constituição do Projeto](./.specify/memory/constitution.md)).
- **Documentação & Grafo:** Central técnica em [`docs/`](./docs/README.md) e mapeamento completo em [`graphify-out/GRAPH_REPORT.md`](./graphify-out/GRAPH_REPORT.md).

---

## 🗂️ Estrutura Oficial do Repositório

```text
quadtree_ttec/
│
├── 📁 docs/                                              # Documentação Técnica (Padrão Gold)
│   ├── README.md                                         # Índice da documentação e links de especificação
│   ├── arquitetura.md                                    # Arquitetura em 5 módulos, contratos e diagramas Mermaid
│   └── algoritmos-e-complexidade.md                      # Análise assintótica: Força Bruta O(N²) vs Quadtree O(N log N)
│
├── 📁 src/                                               # Código-fonte modular (JS Puro, zero dependências)
│   ├── particle.js                                       # Física das partículas, bordas e ricochete elástico
│   ├── quadtree.js                                       # Estruturas Rect e Quadtree (insert, subdivide, query)
│   ├── simulation.js                                     # Passo de simulação, detecção e buildTrace() didático
│   ├── renderer.js                                       # Desenho no Canvas 2D (partículas, grade e trace)
│   └── main.js                                           # Controles da UI, mouse, loop e máquina de estados didática
│
├── 📁 tests/                                             # Suíte de testes unitários nativos (node --test)
│   ├── particle.test.js                                  # Testes de movimento, quique e resolução de colisão
│   ├── quadtree.test.js                                  # Testes de Rect, subdivisão, maxDepth e range query
│   └── simulation.test.js                                # Testes de equivalência, SC-002 (<= 1/10) e trace didático
│
├── 📁 specs/                                             # Especificações evolutivas (Spec-Kit)
│   ├── 📁 001-particle-collision-demo/                   # Spec, plano, contratos e modelo de dados da demo base
│   ├── 📁 002-didactic-step-mode/                        # Spec e contratos do modo didático passo a passo
│   └── 📁 003-collision-triggered-didactic/              # Spec da pausa automática por colisão e cooldown de 5s
│
├── 📁 graphify-out/                                      # Grafo de Conhecimento (/graphify)
│   ├── GRAPH_REPORT.md                                   # Relatório estrutural (294 nós, 417 arestas, 25 comunidades)
│   ├── graph.json                                        # Grafo completo em formato GraphRAG-ready
│   └── graph.html                                        # Visualização interativa no navegador
│
├── 📁 .specify/                                          # Constituição, templates e scripts de governança
├── index.html                                            # Ponto de entrada da demonstração web
├── style.css                                             # Estilização do canvas e painel de controles
├── .gitignore                                            # Filtro de arquivos temporários
└── README.md                                             # Portal central de navegação
```

---

## 🎮 Como Usar & Modo Didático

Abra o arquivo [`index.html`](./index.html) diretamente no navegador.

### Controles Principais
- **Partículas (`10–2000`):** Define a quantidade de partículas; ao soltar o *slider* a simulação recomeça.
- **Raio (`2, 4, 8, 16, 32 px`):** Altera o raio das partículas e reinicia a simulação.
- **Modo (`Força bruta` / `Quadtree`):** Alterna o algoritmo de detecção em tempo real sem reiniciar as posições.
- **Mostrar grade:** Exibe as subdivisões recursivas da Quadtree no Canvas.
- **Arrastar o mouse:** Realiza uma *range query* retangular destacando as partículas encontradas (clique simples limpa a seleção).

### Modo Didático (Inspeção Passo a Passo por Colisão)
Ative pelo botão **Modo didático** (disponível para até `200` partículas; valores próximos de `20` facilitam o acompanhamento).

A animação continua rodando até duas partículas colidirem — então pausa **antes do ricochete**, destacando o par colidido em **verde** e reconstruindo o *trace* completo daquele *frame*:

| Atalho / Ação | Efeito durante a apresentação (`presenting`) |
| :--- | :--- |
| **`→` / `←`** | Avança ou retrocede um passo da detecção |
| **`Shift + →` / `←`** | Salta para a próxima ou anterior partícula analisada |
| **`Enter`** | Vai direto para o teste da colisão que disparou a pausa |
| **`Esc`** *(ou `→` no último passo)* | Encerra o modo passo a passo, aplica os ricochetes e entra em *cooldown* de `5 s` |
| **Botão de Modo** | Recalcula os passos do mesmo *frame* usando o outro algoritmo |

**Legenda Visual no Canvas:**
- **Anel branco:** Partícula atualmente sob análise.
- **Quadrado tracejado (Quadtree):** Região da *range query*.
- **Nós em ciano / vermelho:** Quadrantes intersectados (descida na árvore) vs. descartados inteiros (poda espacial).
- **Linhas amarelas / vermelhas:** Pares testados sem colisão vs. com colisão; par causador da pausa destacado em **verde**.

---

## 🧪 Testes & Verificação

Execute a suíte completa de testes unitários com Node.js (sem dependências externas):

```bash
node --test
```

Os **31 testes** em [`tests/`](./tests) cobrem exclusivamente a lógica pura (`particle.js`, `quadtree.js`, `simulation.js`), validando equivalência exata entre Força Bruta e Quadtree, redução $\le 1/10$ no número de testes com 1.000 partículas (`SC-002`) e integridade do *trace* didático.

---

## 📚 Mapa de Especificações & Documentação

| Artefato | Conteúdo | Link |
| :--- | :--- | :--- |
| **Documentação Técnica** | Índice, arquitetura em 5 módulos e análise Big-O | [`docs/README.md`](./docs/README.md) |
| **Arquitetura & Contratos** | Diagramas Mermaid, máquina de estados e insights `/graphify` | [`docs/arquitetura.md`](./docs/arquitetura.md) |
| **Algoritmos & Complexidade** | Força Bruta $\mathcal{O}(N^2)$ vs. Quadtree $\mathcal{O}(N \log N)$ | [`docs/algoritmos-e-complexidade.md`](./docs/algoritmos-e-complexidade.md) |
| **Grafo de Conhecimento** | Relatório estrutural completo gerado via `/graphify` | [`graphify-out/GRAPH_REPORT.md`](./graphify-out/GRAPH_REPORT.md) |
| **Spec 001** | Demo de colisão de partículas com Quadtree | [`specs/001-particle-collision-demo/spec.md`](./specs/001-particle-collision-demo/spec.md) |
| **Spec 002** | Modo didático passo a passo | [`specs/002-didactic-step-mode/spec.md`](./specs/002-didactic-step-mode/spec.md) |
| **Spec 003** | Modo didático disparado por colisão e *cooldown* | [`specs/003-collision-triggered-didactic/spec.md`](./specs/003-collision-triggered-didactic/spec.md) |

---

## 👥 Autor

- **Rafael Feltrim** ([GitHub](https://github.com/RaFeltrim))
