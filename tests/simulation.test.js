const test = require('node:test');
const assert = require('node:assert/strict');
const { Particle } = require('../src/particle.js');
const { Rect, Quadtree } = require('../src/quadtree.js');
const { Simulation, findPairsBruteForce, findPairsQuadtree } = require('../src/simulation.js');

// Cria `count` partículas aleatórias e uma Quadtree com elas.
function randomScene(count, radius, width, height) {
  const sim = new Simulation(width, height);
  sim.reset(count, radius, width, height);
  const tree = new Quadtree(new Rect(0, 0, width, height));
  for (const p of sim.particles) tree.insert(p);
  return { particles: sim.particles, tree };
}

// Chave de par independente da ordem, para comparar conjuntos de pares.
const pairKey = ([a, b]) => `${Math.min(a.id, b.id)}-${Math.max(a.id, b.id)}`;

test('findPairsBruteForce testa n(n-1)/2 pares', () => {
  const sim = new Simulation(800, 600);
  sim.reset(200, 4, 800, 600);
  assert.equal(findPairsBruteForce(sim.particles).tests, 19900);

  const one = findPairsBruteForce([new Particle(0, 10, 10, 0, 0, 4)]);
  assert.equal(one.tests, 0);
  assert.equal(one.pairs.length, 0);
});

test('findPairsBruteForce encontra exatamente os pares sobrepostos', () => {
  const particles = [
    new Particle(0, 10, 10, 0, 0, 5),
    new Particle(1, 15, 10, 0, 0, 5), // sobrepõe 0
    new Particle(2, 100, 100, 0, 0, 5),
    new Particle(3, 104, 100, 0, 0, 5), // sobrepõe 2
    new Particle(4, 300, 300, 0, 0, 5), // isolada
  ];
  const { pairs } = findPairsBruteForce(particles);
  assert.deepEqual(pairs.map(pairKey).sort(), ['0-1', '2-3']);
});

test('reset cria partículas com o raio pedido dentro da área', () => {
  const sim = new Simulation(800, 600);
  sim.reset(300, 16, 800, 600);
  assert.equal(sim.particles.length, 300);
  sim.particles.forEach((p, i) => {
    assert.equal(p.id, i);
    assert.equal(p.r, 16);
    assert.ok(p.x >= 16 && p.x <= 800 - 16);
    assert.ok(p.y >= 16 && p.y <= 600 - 16);
  });
});

test('step marca como colidindo só as partículas sobrepostas', () => {
  const sim = new Simulation(400, 400);
  sim.particles = [
    new Particle(0, 100, 100, 0, 0, 5),
    new Particle(1, 106, 100, 0, 0, 5),
    new Particle(2, 300, 300, 0, 0, 5),
  ];
  sim.step();
  assert.equal(sim.particles[0].colliding, true);
  assert.equal(sim.particles[1].colliding, true);
  assert.equal(sim.particles[2].colliding, false);
  assert.equal(sim.tests, 3);
});

test('findPairsQuadtree encontra os mesmos pares que a força bruta', () => {
  const { particles, tree } = randomScene(500, 8, 800, 600);
  const brute = findPairsBruteForce(particles);
  const quad = findPairsQuadtree(particles, tree);

  const quadKeys = quad.pairs.map(pairKey);
  assert.equal(new Set(quadKeys).size, quadKeys.length, 'sem pares duplicados');
  assert.deepEqual(quadKeys.sort(), brute.pairs.map(pairKey).sort());
  assert.ok(quad.tests < brute.tests);
});

test('com 1000 partículas a Quadtree faz no máximo 1/10 dos testes (SC-002)', () => {
  const { particles, tree } = randomScene(1000, 4, 1600, 900);
  const brute = findPairsBruteForce(particles);
  const quad = findPairsQuadtree(particles, tree);
  assert.ok(quad.tests <= brute.tests / 10, `${quad.tests} vs ${brute.tests}`);
});

test('step usa o modo escolhido', () => {
  const sim = new Simulation(1600, 900);
  sim.reset(1000, 4, 1600, 900);
  sim.mode = 'brute';
  sim.step();
  assert.equal(sim.tests, 499500);
  sim.mode = 'quadtree';
  sim.step();
  assert.ok(sim.tests < 49950);
});

test('seleção marca exatamente as partículas com centro dentro da região', () => {
  const sim = new Simulation(400, 400);
  sim.particles = [
    new Particle(0, 50, 50, 0, 0, 4),
    new Particle(1, 80, 60, 0, 0, 4),
    new Particle(2, 200, 200, 0, 0, 4),
    new Particle(3, 350, 30, 0, 0, 4),
  ];
  sim.setSelection(new Rect(40, 40, 100, 100));
  sim.step();
  assert.deepEqual(sim.particles.map((p) => p.selected), [true, true, false, false]);
  assert.equal(sim.selectedCount, 2);

  sim.setSelection(null);
  sim.step();
  assert.ok(sim.particles.every((p) => !p.selected));
  assert.equal(sim.selectedCount, 0);
});

test('reset limpa a seleção', () => {
  const sim = new Simulation(400, 400);
  sim.setSelection(new Rect(0, 0, 100, 100));
  sim.reset(10, 4, 400, 400);
  assert.equal(sim.selection, null);
});

test('step equivale a moveAndBuildTree + detectAndResolve', () => {
  const make = () => {
    const sim = new Simulation(400, 400);
    sim.particles = [
      new Particle(0, 100, 100, 1, 0, 8),
      new Particle(1, 112, 100, -1, 0, 8), // sobrepõe a 0 depois de mover
      new Particle(2, 300, 300, 0, 1, 8),
    ];
    return sim;
  };
  const a = make();
  a.step();
  const b = make();
  b.moveAndBuildTree();
  b.detectAndResolve();
  const state = (sim) => sim.particles.map((p) => [p.x, p.y, p.vx, p.vy, p.colliding]);
  assert.deepEqual(state(a), state(b));
  assert.equal(a.particles[0].colliding, true);
});
