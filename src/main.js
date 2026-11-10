// Liga a simulação à página: controles, eventos e o loop de animação.

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const countInput = document.getElementById('count');
const countValue = document.getElementById('countValue');
const radiusSelect = document.getElementById('radius');
const modeBtn = document.getElementById('modeBtn');
const showGridInput = document.getElementById('showGrid');
const stats = document.getElementById('stats');

const sim = new Simulation(innerWidth, innerHeight);

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

// Mudar quantidade, raio ou tamanho da janela sempre recomeça a simulação.
function restart() {
  sim.reset(Number(countInput.value), Number(radiusSelect.value), canvas.width, canvas.height);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  restart();
});
radiusSelect.addEventListener('change', restart);

// O slider mostra o valor enquanto arrasta e só recomeça ao soltar.
countInput.addEventListener('input', () => {
  countValue.textContent = countInput.value;
});
countInput.addEventListener('change', restart);

// Trocar o modo não recomeça: as mesmas partículas seguem, só muda a detecção.
modeBtn.addEventListener('click', () => {
  sim.mode = sim.mode === 'brute' ? 'quadtree' : 'brute';
  modeBtn.textContent = sim.mode === 'brute' ? 'Modo: força bruta' : 'Modo: Quadtree';
});

// Seleção com o mouse: arrastar desenha um retângulo e atualiza a range query na hora.
let dragStart = null;
let dragRect = null;

// Retângulo com largura e altura positivas, em qualquer direção de arrasto.
function rectFromPoints(x1, y1, x2, y2) {
  return new Rect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
}

canvas.addEventListener('mousedown', (e) => {
  dragStart = { x: e.offsetX, y: e.offsetY };
});

canvas.addEventListener('mousemove', (e) => {
  if (!dragStart) return;
  dragRect = rectFromPoints(dragStart.x, dragStart.y, e.offsetX, e.offsetY);
  sim.setSelection(dragRect);
});

window.addEventListener('mouseup', () => {
  if (!dragStart) return;
  // Clique sem arrastar (menos de 3 px) limpa a seleção.
  if (!dragRect || (dragRect.w < 3 && dragRect.h < 3)) sim.setSelection(null);
  dragStart = null;
  dragRect = null;
});

// FPS: média suavizada do tempo entre frames; o painel é atualizado ~4 vezes por segundo.
let lastTime = performance.now();
let fps = 60;
let lastStatsUpdate = 0;

function updateStats(now) {
  if (now - lastStatsUpdate < 250) return;
  lastStatsUpdate = now;
  stats.textContent =
    `FPS:        ${fps.toFixed(0)}\n` +
    `Partículas: ${sim.particles.length}\n` +
    `Testes:     ${sim.tests}\n` +
    `Modo:       ${sim.mode === 'brute' ? 'força bruta' : 'Quadtree'}` +
    (sim.selection ? `\nEncontradas: ${sim.selectedCount}` : '');
}

function loop(now) {
  const elapsed = now - lastTime;
  lastTime = now;
  if (elapsed > 0) fps = fps * 0.9 + (1000 / elapsed) * 0.1;

  sim.step();
  draw(ctx, sim, showGridInput.checked, dragRect);
  updateStats(now);
  requestAnimationFrame(loop);
}

resizeCanvas();
restart();
requestAnimationFrame(loop);
