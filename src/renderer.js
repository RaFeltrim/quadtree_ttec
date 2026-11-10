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
