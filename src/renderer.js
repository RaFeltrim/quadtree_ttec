// Desenho no canvas. Só lê o estado da simulação, nunca o altera.

const COLOR_BACKGROUND = '#111';
const COLOR_PARTICLE = '#8cf';
const COLOR_COLLIDING = '#f44';
const COLOR_GRID = 'rgba(120, 255, 120, 0.35)';
const COLOR_SELECTED = '#fd3';

function draw(ctx, sim, showGrid, dragRect) {
  ctx.fillStyle = COLOR_BACKGROUND;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (showGrid && sim.tree) {
    ctx.strokeStyle = COLOR_GRID;
    ctx.lineWidth = 1;
    drawTree(ctx, sim.tree);
  }

  for (const p of sim.particles) {
    ctx.fillStyle = p.colliding ? COLOR_COLLIDING : COLOR_PARTICLE;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
    ctx.fill();

    // Selecionadas ganham um contorno, para não confundir com o vermelho da colisão.
    if (p.selected) {
      ctx.strokeStyle = COLOR_SELECTED;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  const selection = dragRect || sim.selection;
  if (selection) {
    ctx.strokeStyle = COLOR_SELECTED;
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
    ctx.setLineDash([]);
  }
}

// Desenha o retângulo de cada nó, descendo recursivamente pelos filhos.
function drawTree(ctx, node) {
  const b = node.boundary;
  ctx.strokeRect(b.x, b.y, b.w, b.h);
  if (node.children) {
    for (const child of node.children) drawTree(ctx, child);
  }
}

// ---------- Modo didático ----------

const COLOR_DIM = 'rgba(136, 204, 255, 0.35)';
const COLOR_FOCUS = '#fff';
const COLOR_NO_COLLISION = '#4f4';
const COLOR_OLD_TEST = 'rgba(200, 200, 200, 0.25)';
const COLOR_NODE_HIT = '#4f4';
const COLOR_NODE_PRUNED = 'rgba(255, 90, 90, 0.8)';

// Desenha o passo `index` do trace: o que o algoritmo está olhando agora
// e o caminho percorrido até ali para a partícula atual.
function drawTrace(ctx, sim, steps, index, showGrid) {
  ctx.fillStyle = COLOR_BACKGROUND;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (showGrid && sim.tree) {
    ctx.strokeStyle = COLOR_GRID;
    ctx.lineWidth = 1;
    drawTree(ctx, sim.tree);
  }

  // Partículas de colisões já encontradas até este passo ficam vermelhas; o resto, apagado.
  const found = new Set();
  for (let i = 0; i <= index; i++) {
    const s = steps[i];
    if (s.type === 'test' && s.overlap) {
      found.add(s.p);
      found.add(s.q);
    }
  }
  for (const p of sim.particles) {
    ctx.fillStyle = found.has(p) ? COLOR_COLLIDING : COLOR_DIM;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Volta até o passo 'particle' para saber onde começou a partícula atual.
  let start = index;
  while (start > 0 && steps[start].type !== 'particle') start--;
  const current = steps[index];
  const p = steps[start].p;

  // Região de busca (só Quadtree): o quadrado onde podem estar as vizinhas.
  const range = steps[start].range;
  if (range) {
    ctx.strokeStyle = COLOR_FOCUS;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(range.x, range.y, range.w, range.h);
    ctx.setLineDash([]);
  }

  // Nós visitados até agora: verde = tocou a região (a busca desce),
  // vermelho = descartado inteiro. O nó do passo atual fica mais grosso.
  for (let i = start; i <= index; i++) {
    const s = steps[i];
    if (s.type !== 'visit') continue;
    const b = s.node.boundary;
    ctx.strokeStyle = s.hit ? COLOR_NODE_HIT : COLOR_NODE_PRUNED;
    ctx.lineWidth = i === index ? 3 : 1;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
  }

  // Testes já feitos por esta partícula (cinza) e o teste atual (verde = não colide, vermelho = colide).
  for (let i = start; i <= index; i++) {
    const s = steps[i];
    if (s.type !== 'test') continue;
    const isCurrent = i === index;
    ctx.strokeStyle = isCurrent ? (s.overlap ? COLOR_COLLIDING : COLOR_NO_COLLISION) : COLOR_OLD_TEST;
    ctx.lineWidth = isCurrent ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(s.p.x, s.p.y);
    ctx.lineTo(s.q.x, s.q.y);
    ctx.stroke();
  }
  if (current.type === 'test') {
    ctx.strokeStyle = COLOR_FOCUS;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(current.q.x, current.q.y, current.q.r + 3, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // A partícula analisada ganha um anel branco.
  ctx.strokeStyle = COLOR_FOCUS;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r + 3, 0, 2 * Math.PI);
  ctx.stroke();
}
