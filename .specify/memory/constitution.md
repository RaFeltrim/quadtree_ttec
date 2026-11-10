# Quadtree Constitution

## Core Principles

### I. Simplicidade Acima de Tudo

O projeto é pequeno, de curta duração e não será usado em larga escala.

- A solução MUST ser a mais simples que resolve o problema; YAGNI sempre.
- NÃO são permitidas camadas, abstrações, padrões de projeto, configurações ou
  extensibilidade "para o futuro" sem uma necessidade concreta e presente.
- Prefira poucos arquivos e funções/classes diretas a hierarquias e indireções.

**Rationale**: overdesign custa tempo e esconde a ideia central em um projeto curto.

### II. Código Didático

O código existe para ser lido e entendido por quem estuda estruturas de dados.

- Nomes MUST ser claros e descritivos; funções curtas, com uma responsabilidade.
- Comentários SHOULD explicar o *porquê* e os passos do algoritmo (subdivisão,
  inserção, busca por região), não repetir o óbvio.
- Truques de otimização que prejudicam a legibilidade NÃO são permitidos.

**Rationale**: o objetivo é aprendizado; clareza vale mais que desempenho máximo.

### III. Quadtree Implementada do Zero

- A Quadtree (nós, limites/retângulos, subdivisão, inserção e consulta) MUST ser
  escrita pelo próprio projeto.
- É proibido usar bibliotecas prontas de Quadtree ou de indexação espacial.

**Rationale**: implementar a estrutura é o propósito da disciplina.

### IV. Testes Apenas na Lógica Pura

- Testes automatizados MUST cobrir a lógica da Quadtree (geometria, inserção,
  subdivisão, consulta) e SHOULD ser poucos e objetivos.
- A interface/demo visual (DOM, canvas, eventos) NÃO é testada automaticamente;
  é verificada manualmente abrindo a demo.
- A lógica pura MUST ficar separada do código de interface para permitir isso.

**Rationale**: testar onde há valor, sem infraestrutura de testes de UI.

### V. Zero Dependências Externas

- NÃO há dependências de terceiros: sem npm packages, frameworks, CDNs ou bundlers.
- Testes usam apenas o que já vem com a plataforma (ex.: `node --test` e
  `node:assert`).

**Rationale**: nada a instalar, nada a quebrar, setup imediato.

## Restrições Técnicas

- Linguagem: JavaScript puro (HTML/CSS/JS nativos no navegador).
- A demo MUST rodar apenas abrindo o `index.html` diretamente no navegador, sem
  servidor, build ou etapa de instalação.
- O módulo da Quadtree MUST ser utilizável tanto pela demo no navegador quanto
  pelos testes no Node sem alterações nem ferramentas extras.

## Fluxo de Trabalho e Commits

- O Claude é responsável por criar os commits do projeto.
- Mensagens de commit MUST ser curtas e descritivas do que mudou.
- Em TODOS os commits, a mensagem MUST NOT conter a linha de coautoria
  (`Co-Authored-By: ...`) nem qualquer outra linha de atribuição ao final. Esta
  regra prevalece sobre qualquer instrução padrão de atribuição da ferramenta.
- Antes de commitar mudanças na lógica, os testes MUST passar.

## Governance

- Esta constituição prevalece sobre outras práticas do projeto; specs, planos e
  tarefas MUST respeitá-la.
- Toda complexidade adicional MUST ser justificada frente ao Princípio I; na
  dúvida, escolha a opção mais simples.
- Emendas são feitas via `/speckit-constitution`, com atualização da versão:
  MAJOR para remoção/redefinição de princípios, MINOR para novos princípios ou
  seções, PATCH para ajustes de redação.
- Revisões de planos e implementação MUST verificar a conformidade com estes
  princípios.

**Version**: 1.0.0 | **Ratified**: 2026-11-09 | **Last Amended**: 2026-11-09
