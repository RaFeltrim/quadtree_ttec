# 📚 Documentação Técnica — Quadtree: Colisão de Partículas

Bem-vindo à central de documentação técnica do projeto **Quadtree: Colisão de Partículas**. Esta pasta consolida a arquitetura em módulos, a análise algorítmica e os artefatos de mapeamento estrutural gerados via `/graphify`.

---

## 🗂️ Índice de Documentos

| Documento | Descrição |
| :--- | :--- |
| **[`arquitetura.md`](./arquitetura.md)** | Arquitetura em 5 módulos planos, contratos de dados, máquina de estados do modo didático e diagramas Mermaid |
| **[`algoritmos-e-complexidade.md`](./algoritmos-e-complexidade.md)** | Comparativo assintótico: Força Bruta $\mathcal{O}(N^2)$ vs. Quadtree $\mathcal{O}(N \log N)$, subdivisão espacial e *range query* |
| **[`GRAPH_REPORT.md`](../graphify-out/GRAPH_REPORT.md)** | Relatório completo do grafo de conhecimento gerado pelo `/graphify` (294 nós, 417 arestas, 25 comunidades) |
| **[`graph.html`](../graphify-out/graph.html)** | Visualização interativa do grafo de dependências e especificações |

---

## 🧭 Especificações de Origem (Spec-Kit)

O histórico evolutivo das funcionalidades encontra-se documentado em [`specs/`](../specs/):

1. **[`001-particle-collision-demo`](../specs/001-particle-collision-demo/spec.md)** — Simulação base, Quadtree de pontos e comparação com força bruta.
2. **[`002-didactic-step-mode`](../specs/002-didactic-step-mode/spec.md)** — Modo didático passo a passo com inspeção de *trace* e navegação por teclado.
3. **[`003-collision-triggered-didactic`](../specs/003-collision-triggered-didactic/spec.md)** — Pausa automática disparada por colisão com *cooldown* de 5 segundos.
