// Desenho no canvas. Só lê o estado da simulação, nunca o altera.

const COLOR_BACKGROUND = '#111';
const COLOR_PARTICLE = '#8cf';
const COLOR_COLLIDING = '#f44';

function draw(ctx, sim, showGrid, dragRect) {
  ctx.fillStyle = COLOR_BACKGROUND;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const p of sim.particles) {
    ctx.fillStyle = p.colliding ? COLOR_COLLIDING : COLOR_PARTICLE;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}
