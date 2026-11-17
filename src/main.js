// Liga a simulação à página: controles, eventos e o loop de animação.

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const countInput = document.getElementById('count');
const countValue = document.getElementById('countValue');
const radiusSelect = document.getElementById('radius');
const modeBtn = document.getElementById('modeBtn');
const stepBtn = document.getElementById('stepBtn');
const notice = document.getElementById('notice');
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

// Modo didático: a simulação para entre "mover + montar árvore" e "detectar + resolver",
// e o usuário percorre a detecção passo a passo com as setas.
const MAX_TRACE_PARTICLES = 200; // acima disso há passos demais para seguir à mão
const LIMIT_NOTICE = `Modo didático: reduza para até ${MAX_TRACE_PARTICLES} partículas`;
let trace = null; // null = desligado; senão { steps, index }

function rebuildTrace() {
  trace = { steps: buildTrace(sim.particles, sim.tree, sim.mode), index: 0 };
}

// Começa um frame: move as partículas, monta a árvore e para antes de detectar.
function startTraceFrame() {
  sim.moveAndBuildTree();
  rebuildTrace();
}

function updateStepBtn() {
  stepBtn.textContent = trace ? 'Modo didático: ligado' : 'Modo didático: desligado';
}

stepBtn.addEventListener('click', () => {
  if (trace) {
    sim.detectAndResolve(); // conclui o frame que estava pausado
    trace = null;
  } else if (sim.particles.length > MAX_TRACE_PARTICLES) {
    notice.textContent = LIMIT_NOTICE;
  } else {
    startTraceFrame();
    notice.textContent = '';
  }
  updateStepBtn();
  stepBtn.blur();
});

// → / ← : próximo / anterior passo.
window.addEventListener('keydown', (e) => {
  if (!trace || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
  e.preventDefault(); // a seta não deve mexer no slider em foco nem rolar a página
  if (e.key === 'ArrowRight') {
    trace.index = Math.min(trace.index + 1, trace.steps.length - 1);
  } else {
    trace.index = Math.max(trace.index - 1, 0);
  }
});

// Frase que explica o passo atual no painel.
function describeStep(s) {
  if (s.type === 'particle') {
    return sim.mode === 'brute'
      ? `Partícula #${s.p.id}: comparar com todas as de id maior`
      : `Partícula #${s.p.id}: buscar vizinhas na região tracejada`;
  }
  const dist = Math.hypot(s.q.x - s.p.x, s.q.y - s.p.y);
  const minDist = s.p.r + s.q.r;
  return s.overlap
    ? `Teste #${s.p.id} × #${s.q.id}: ${dist.toFixed(1)} < ${minDist} → COLISÃO`
    : `Teste #${s.p.id} × #${s.q.id}: ${dist.toFixed(1)} ≥ ${minDist} → sem colisão`;
}

function updateTraceStats() {
  const s = trace.steps[trace.index];
  stats.textContent =
    `MODO DIDÁTICO (${sim.mode === 'brute' ? 'força bruta' : 'Quadtree'})\n` +
    `Passo ${trace.index + 1} / ${trace.steps.length}\n` +
    `${describeStep(s)}\n` +
    `Testes até aqui:   ${s.tests}\n` +
    `Colisões até aqui: ${s.collisions}\n` +
    `→ ← passo   Shift+→ ← partícula`;
}

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

  if (trace) {
    drawTrace(ctx, sim, trace.steps, trace.index, showGridInput.checked);
    updateTraceStats();
  } else {
    sim.step();
    draw(ctx, sim, showGridInput.checked, dragRect);
    updateStats(now);
  }
  requestAnimationFrame(loop);
}

resizeCanvas();
restart();
requestAnimationFrame(loop);
