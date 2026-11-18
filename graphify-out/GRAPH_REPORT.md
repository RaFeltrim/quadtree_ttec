# Graph Report - quadtree_ttec  (2026-11-18)

## Corpus Check
- 63 files · ~56,683 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 294 nodes · 417 edges · 25 communities (12 shown, 13 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Core Physics & Quadtree
- Speckit Skills & Governance
- Specify Workflow Config
- Specify Prerequisite Scripts
- Feature 001 Demo Specs
- Feature 002/003 Didactic State
- UI & Main Loop Controls
- Domain Contracts & Entities
- HTML Entry & Demo Page
- Feature 003 Collision Trigger Specs
- Feature Branch Automation
- Canvas Renderer & Trace
- Feature 001 Requirements
- Feature 002 Requirements
- Project Documentation & Polish
- Manual Validation & Timing
- Input Handling Constraints
- Step Button Control
- Trace Data Structure
- Frame Navigation Controls
- Collision Pause Feedback
- Didactic Status Indicator
- Headless Testability
- User Identification Criteria
- Initial Project Setup

## God Nodes (most connected - your core abstractions)
1. `Quadtree Constitution (v1.0.0)` - 19 edges
2. `speckit-specify Skill` - 12 edges
3. `Simulation` - 11 edges
4. `create-new-feature.sh script` - 10 edges
5. `steps` - 9 edges
6. `Quadtree` - 9 edges
7. `Feature 001: Demo de Colisão de Partículas com Quadtree` - 9 edges
8. `get_repo_root()` - 8 edges
9. `get_feature_paths()` - 8 edges
10. `setup-tasks.sh script` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Modo Didático (Step-by-Step Collision Inspection)` --conceptually_related_to--> `Principle II: Código Didático`  [INFERRED]
  README.md → .specify/memory/constitution.md
- `Pure Logic Tests via node --test` --implements--> `Principle IV: Testes Apenas na Lógica Pura`  [INFERRED]
  README.md → .specify/memory/constitution.md
- `Pure Logic Tests via node --test` --implements--> `Principle V: Zero Dependências Externas`  [INFERRED]
  README.md → .specify/memory/constitution.md
- `Technical Constraints: Pure JS, Direct index.html, Shared Node/Browser Module` --rationale_for--> `Classic Non-ESM Script Loader (particle, quadtree, simulation, renderer, main)`  [INFERRED]
  .specify/memory/constitution.md → index.html
- `Constitution Governance & SemVer Amendment Rules` --references--> `speckit-constitution Skill`  [EXTRACTED]
  .specify/memory/constitution.md → .claude/skills/speckit-constitution/SKILL.md

## Import Cycles
- None detected.

## Communities (25 total, 13 thin omitted)

### Community 0 - "Core Physics & Quadtree"
Cohesion: 0.07
Nodes (20): Particle, particlesOverlap(), resolveCollision(), Quadtree, Rect, buildTrace(), findPairsBruteForce(), findPairsQuadtree() (+12 more)

### Community 1 - "Speckit Skills & Governance"
Cohesion: 0.09
Nodes (31): 6 Cross-Artifact Detection Passes (Duplication, Ambiguity, Underspecification, Constitution, Coverage, Inconsistency), speckit-analyze Skill, speckit-checklist Skill, Unit Tests for Requirements Writing, 10-Category Spec Ambiguity & Coverage Taxonomy, Sequential Clarification Questioning Loop (Max 5 Questions), speckit-clarify Skill, Constitution Scope Guard (+23 more)

### Community 2 - "Specify Workflow Config"
Cohesion: 0.06
Nodes (30): args, inputs, integration, spec, default, prompt, type, any (+22 more)

### Community 3 - "Specify Prerequisite Scripts"
Cohesion: 0.16
Nodes (21): check-prerequisites.sh script, check_dir(), check_file(), find_specify_root(), format_speckit_command(), get_current_branch(), get_feature_paths(), get_invoke_separator() (+13 more)

### Community 4 - "Feature 001 Demo Specs"
Cohesion: 0.12
Nodes (22): Specification Quality Checklist (Feature 001), Contracts: API dos módulos e UI (Feature 001), Data Model (Feature 001), Arquitetura em 5 módulos planos (particle, quadtree, simulation, renderer, main), Implementation Plan (Feature 001), Quickstart e Validação Manual (Feature 001), Feature 001: Demo de Colisão de Partículas com Quadtree, US1: Partículas quicando e colidindo com ricochete (+14 more)

### Community 5 - "Feature 002/003 Didactic State"
Cohesion: 0.08
Nodes (21): Controles e painel (src/main.js), Contrato src/simulation.js (detect, resolve, detectAndResolve, findPairStepIndex), COOLDOWN_MS (5000 ms) e cooldownEnd, Estado didactic ('off' | 'waiting' | 'presenting' | 'cooldown'), findPairStepIndex(steps, a, b), Simulation.detect(), Simulation.detectAndResolve(), Simulation.resolve(pairs) (+13 more)

### Community 6 - "UI & Main Loop Controls"
Cohesion: 0.11
Nodes (20): canvas, countInput, countValue, ctx, describeStep(), lastTime, loop(), modeBtn (+12 more)

### Community 7 - "Domain Contracts & Entities"
Cohesion: 0.10
Nodes (14): Contrato src/particle.js: Particle, particlesOverlap, resolveCollision, Contrato src/quadtree.js: Rect, Quadtree, Contrato src/simulation.js: Simulation, findPairsBruteForce, findPairsQuadtree, Contrato src/renderer.js e src/main.js (Feature 001), Entidade Particle (id, x, y, vx, vy, r, colliding, selected), Entidade Quadtree (boundary, capacity, depth, maxDepth, items, children), Entidade Rect (x, y, w, h, contains, intersects), Entidade Simulation (particles, mode, tree, tests, selection, selectedCount) (+6 more)

### Community 8 - "HTML Entry & Demo Page"
Cohesion: 0.20
Nodes (9): Simulation Canvas (#canvas), Classic Non-ESM Script Loader (particle, quadtree, simulation, renderer, main), Control Panel (#panel: #count, #radius, #modeBtn, #stepBtn, #showGrid, #stats), index.html Demo Entry Page, Stylesheet Link (style.css), Brute Force vs Quadtree Collision Detection, Modo Didático (Step-by-Step Collision Inspection), Quadtree: Colisão de Partículas (README) (+1 more)

### Community 9 - "Feature 003 Collision Trigger Specs"
Cohesion: 0.35
Nodes (9): Specification Quality Checklist: Modo Didático Disparado por Colisão, Contracts: mudanças nas APIs e controles, Data Model: Modo Didático Disparado por Colisão, Implementation Plan: Modo Didático Disparado por Colisão, Quickstart: Modo Didático Disparado por Colisão, Research: Modo Didático Disparado por Colisão, Feature Specification: Modo Didático Disparado por Colisão, SC-004: Partículas em verde são de fato um par em colisão no frame pausado (+1 more)

### Community 10 - "Feature Branch Automation"
Cohesion: 0.44
Nodes (7): clean_branch_name(), fit_branch_name(), generate_branch_name(), get_highest_from_specs(), is_feature_number_in_range(), create-new-feature.sh script, spec_prefix_exists()

### Community 11 - "Canvas Renderer & Trace"
Cohesion: 0.60
Nodes (4): Contrato src/renderer.js (drawTrace com par em verde), draw(), drawTrace(), drawTree()

## Knowledge Gaps
- **54 isolated node(s):** `Brute Force vs Quadtree Collision Detection`, `Mouse Drag Range Query Selection`, `Simulation Canvas (#canvas)`, `Stylesheet Link (style.css)`, `Feature Specification Template` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 127 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `Brute Force vs Quadtree Collision Detection`, `Mouse Drag Range Query Selection`, `Simulation Canvas (#canvas)` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core Physics & Quadtree` be split into smaller, more focused modules?**
  _Cohesion score 0.07493061979648474 - nodes in this community are weakly interconnected._
- **Should `Speckit Skills & Governance` be split into smaller, more focused modules?**
  _Cohesion score 0.09103840682788052 - nodes in this community are weakly interconnected._
- **Should `Specify Workflow Config` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `Feature 001 Demo Specs` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Feature 002/003 Didactic State` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._
- **Should `UI & Main Loop Controls` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._