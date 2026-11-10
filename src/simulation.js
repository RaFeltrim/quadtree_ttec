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

  // Avança um frame.
  step() {
    // 1) Mover e quicar nas bordas.
    for (const p of this.particles) p.move(this.width, this.height);

    // 2) Reconstruir a Quadtree do zero (mais simples que atualizá-la).
    this.tree = new Quadtree(new Rect(0, 0, this.width, this.height));
    for (const p of this.particles) this.tree.insert(p);

    // 3) Detectar todos os pares com as posições congeladas.
    const { pairs, tests } = findPairsBruteForce(this.particles);
    this.tests = tests;

    // 4) Só depois resolver: separar, ricochetear e pintar de vermelho.
    for (const p of this.particles) p.colliding = false;
    for (const [a, b] of pairs) {
      resolveCollision(a, b);
      a.colliding = true;
      b.colliding = true;
    }
  }
}

if (typeof module !== 'undefined') module.exports = { Simulation, findPairsBruteForce };
