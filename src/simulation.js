// Estado da simulação e o passo de cada frame: mover, detectar colisões e resolvê-las.

// No navegador, Particle, Quadtree etc. já são globais (scripts carregados antes).
// No Node (testes) precisamos carregá-los e torná-los globais do mesmo jeito.
// Não dá para usar `var { Quadtree } = require(...)`: no navegador esse `var`
// colidiria com a classe global já declarada.
if (typeof require !== 'undefined') {
  Object.assign(globalThis, require('./particle.js'), require('./quadtree.js'));
}

// Força bruta: compara cada par (i, j) com i < j uma única vez.
// Sempre faz n(n-1)/2 testes, por isso cresce com o quadrado de n.
function findPairsBruteForce(particles) {
  const pairs = [];
  let tests = 0;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      tests++;
      if (particlesOverlap(particles[i], particles[j])) {
        pairs.push([particles[i], particles[j]]);
      }
    }
  }
  return { pairs, tests };
}

// Quadtree: cada partícula só é comparada com as vizinhas.
// Como todas têm o mesmo raio r, quem pode tocar `p` tem o centro a no máximo 2r
// de distância, ou seja, dentro de um quadrado de lado 4r centrado em `p`.
function findPairsQuadtree(particles, tree) {
  const pairs = [];
  let tests = 0;
  for (const p of particles) {
    const range = new Rect(p.x - 2 * p.r, p.y - 2 * p.r, 4 * p.r, 4 * p.r);
    for (const q of tree.query(range)) {
      // q.id > p.id: cada par é testado (e contado) uma só vez, como na força bruta.
      if (q.id <= p.id) continue;
      tests++;
      if (particlesOverlap(p, q)) pairs.push([p, q]);
    }
  }
  return { pairs, tests };
}

class Simulation {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.radius = 4;
    this.particles = [];
    this.mode = 'brute'; // 'brute' | 'quadtree'
    this.tree = null; // Quadtree do último frame (usada pela grade e pela seleção)
    this.tests = 0; // testes de colisão do último frame
    this.selection = null;
    this.selectedCount = 0;
  }

  // Recomeça do zero: posições e direções aleatórias dentro da área.
  reset(count, radius, width, height) {
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const x = radius + Math.random() * (width - 2 * radius);
      const y = radius + Math.random() * (height - 2 * radius);
      const angle = Math.random() * 2 * Math.PI;
      const speed = 0.5 + Math.random() * 1.5; // entre 0.5 e 2 px por frame
      this.particles.push(new Particle(i, x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, radius));
    }
    this.tests = 0;
    this.selection = null;
    this.selectedCount = 0;
  }

  // Define (Rect) ou limpa (null) a região de seleção; aplicada no próximo step().
  setSelection(rect) {
    this.selection = rect;
  }

  // Avança um frame. Dividido em duas metades para o modo didático poder
  // parar entre elas e mostrar a detecção passo a passo.
  step() {
    this.moveAndBuildTree();
    this.detectAndResolve();
  }

  moveAndBuildTree() {
    // 1) Mover e quicar nas bordas.
    for (const p of this.particles) p.move(this.width, this.height);

    // 2) Reconstruir a Quadtree do zero (mais simples que atualizá-la).
    this.tree = new Quadtree(new Rect(0, 0, this.width, this.height));
    for (const p of this.particles) this.tree.insert(p);
  }

  // Detectar e resolver também ficam separados: assim o modo didático pode olhar
  // se houve colisão neste frame e pausar antes do ricochete.
  detectAndResolve() {
    this.resolve(this.detect().pairs);
  }

  // 3) Detectar todos os pares com as posições congeladas (não altera as partículas).
  detect() {
    const result = this.mode === 'brute'
      ? findPairsBruteForce(this.particles)
      : findPairsQuadtree(this.particles, this.tree);
    this.tests = result.tests;
    return result;
  }

  resolve(pairs) {
    // 4) Só depois resolver: separar, ricochetear e pintar de vermelho.
    for (const p of this.particles) p.colliding = false;
    for (const [a, b] of pairs) {
      resolveCollision(a, b);
      a.colliding = true;
      b.colliding = true;
    }

    // 5) Range query: marcar as partículas dentro da região selecionada.
    // Usa a árvore deste frame (posições de antes do ricochete; diferença imperceptível).
    for (const p of this.particles) p.selected = false;
    this.selectedCount = 0;
    if (this.selection) {
      const found = this.tree.query(this.selection);
      for (const p of found) p.selected = true;
      this.selectedCount = found.length;
    }
  }
}

// Modo didático: refaz a detecção do frame anotando cada iteração como um "passo",
// para a tela poder mostrar o algoritmo trabalhando. Faz exatamente os mesmos testes
// que findPairsBruteForce / findPairsQuadtree; a diferença é que guarda o que aconteceu.
//   { type: 'particle', p, range }           começa a analisar a partícula p
//   { type: 'visit', p, range, node, hit }   (Quadtree) visitou um nó; hit = tocou a região?
//   { type: 'test', p, q, overlap }          testou o par (p, q); overlap = colidem?
// Cada passo também leva os totais acumulados `tests` e `collisions`.
function buildTrace(particles, tree, mode) {
  const steps = [];
  let tests = 0;
  let collisions = 0;

  function addTest(p, q) {
    tests++;
    const overlap = particlesOverlap(p, q);
    if (overlap) collisions++;
    steps.push({ type: 'test', p, q, overlap, tests, collisions });
  }

  if (mode === 'brute') {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      steps.push({ type: 'particle', p, range: null, tests, collisions });
      for (let j = i + 1; j < particles.length; j++) addTest(p, particles[j]);
    }
    return steps;
  }

  for (const p of particles) {
    const range = new Rect(p.x - 2 * p.r, p.y - 2 * p.r, 4 * p.r, 4 * p.r);
    steps.push({ type: 'particle', p, range, tests, collisions });

    // Percorre o caminho da busca: cada nó visitado e, logo em seguida,
    // os testes com as partículas que a busca encontrou nele.
    const visited = [];
    tree.query(range, [], visited);
    for (const { node, hit, found } of visited) {
      steps.push({ type: 'visit', p, range, node, hit, tests, collisions });
      for (const q of found) {
        if (q.id > p.id) addTest(p, q);
      }
    }
  }
  return steps;
}

if (typeof module !== 'undefined') module.exports = { Simulation, findPairsBruteForce, findPairsQuadtree, buildTrace };
