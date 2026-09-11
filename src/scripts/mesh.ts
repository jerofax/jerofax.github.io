/**
 * mesh.ts — Malla geométrica que respira.
 *
 * Puntos sobre una retícula con jitter y profundidad `z`. La profundidad
 * controla el radio del vértice y el grosor de la arista, así que la malla
 * tiene volumen en lugar de ser plana.
 *
 * Movimiento: sólo una oscilación suave de cada nodo alrededor de su punto
 * de reposo ("respiración") y un barrido de entrada de derecha a izquierda.
 * No reacciona al cursor ni al scroll a propósito.
 *
 * Rendimiento: aristas por vecindad en la retícula (O(n), no O(n²)) y trazado
 * agrupado en cubetas color × profundidad, de modo que unas 2.500 aristas se
 * dibujan con ~16 llamadas a stroke() en vez de 2.500.
 */

interface Node {
  /** Posición de reposo sobre la retícula. */
  ox: number;
  oy: number;
  x: number;
  y: number;
  /** Profundidad 0..1 — tamaño, grosor y amplitud de la respiración. */
  z: number;
  radius: number;
  phase: number;
  colorIndex: number;
  bucket: number;
}

interface Edge {
  a: number;
  b: number;
  /** Segundos antes de que la arista empiece a trazarse. */
  delay: number;
  duration: number;
}

interface Bucket {
  edges: Edge[];
  nodes: number[];
  colorIndex: number;
  depth: number;
  color: string;
  lineWidth: number;
  lineAlpha: number;
  nodeAlpha: number;
}

const PALETTE_VARS = ["--mesh-1", "--mesh-2", "--mesh-3", "--mesh-4"] as const;
const DEPTH_BUCKETS = 4;
const BUCKET_COUNT = PALETTE_VARS.length * DEPTH_BUCKETS;

/** Respiración: velocidad angular (rad/s) y amplitud máxima (px). */
const BREATH_SPEED = 1.2;
const BREATH_AMPLITUDE = 2.2;

const clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export function initMesh(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return () => {};

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let width = 0;
  let height = 0;
  let nodes: Node[] = [];
  let buckets: Bucket[] = [];
  let palette: string[] = [];
  let lineAlphaScale = 0.5;
  let nodeAlphaScale = 0.85;

  let rafId = 0;
  let running = false;
  let startTime = 0;

  /* ── Paleta ─────────────────────────────────────────────────── */
  function readPalette(): void {
    const styles = getComputedStyle(document.documentElement);
    palette = PALETTE_VARS.map(
      (name) => styles.getPropertyValue(name).trim() || "#8b5cf6"
    );
    lineAlphaScale =
      parseFloat(styles.getPropertyValue("--mesh-line-alpha")) || 0.5;
    nodeAlphaScale =
      parseFloat(styles.getPropertyValue("--mesh-node-alpha")) || 0.85;
  }

  /* ── Construcción de la malla ───────────────────────────────── */
  function build(): void {
    const compact = width < 768;
    const spacing = compact ? 62 : 78;
    const jitter = spacing * 0.42;
    const maxDist = spacing * 1.62;
    const maxDistSq = maxDist * maxDist;

    /* Una fila/columna de margen a cada lado para que la respiración
       nunca destape los bordes. */
    const cols = Math.ceil(width / spacing) + 3;
    const rows = Math.ceil(height / spacing) + 3;

    nodes = [];
    buckets = Array.from({ length: BUCKET_COUNT }, (_, i) => {
      const colorIndex = Math.floor(i / DEPTH_BUCKETS);
      const depth = (i % DEPTH_BUCKETS) / (DEPTH_BUCKETS - 1);
      return {
        edges: [],
        nodes: [],
        colorIndex,
        depth,
        color: palette[colorIndex],
        lineWidth: 0.6 + depth * 1.5,
        lineAlpha: (0.22 + depth * 0.55) * lineAlphaScale * 2,
        nodeAlpha: (0.35 + depth * 0.65) * nodeAlphaScale,
      };
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = (c - 1) * spacing + (Math.random() - 0.5) * jitter;
        const oy = (r - 1) * spacing + (Math.random() - 0.5) * jitter;
        const z = 0.28 + Math.random() * 0.72;

        /* Un 9% son "hubs": vértices notablemente mayores. */
        const hub = Math.random() < 0.09;
        const radius = (0.9 + z * 2.3) * (hub ? 2.15 : 1);

        const colorIndex = (Math.random() * palette.length) | 0;
        const depthBucket = Math.min(
          DEPTH_BUCKETS - 1,
          (z * DEPTH_BUCKETS) | 0
        );
        const bucket = colorIndex * DEPTH_BUCKETS + depthBucket;

        nodes.push({
          ox,
          oy,
          x: ox,
          y: oy,
          z,
          radius,
          phase: Math.random() * Math.PI * 2,
          colorIndex,
          bucket,
        });
        buckets[bucket].nodes.push(nodes.length - 1);
      }
    }

    /* Barrido de entrada: las aristas de la derecha aparecen primero. */
    const sweepDelay = (x: number): number =>
      ((width - x) / Math.max(width, 1)) * 1.15;

    const addEdge = (ia: number, ib: number, slow: boolean): void => {
      const a = nodes[ia];
      buckets[a.bucket].edges.push({
        a: ia,
        b: ib,
        delay:
          (slow ? 0.4 : 0.15) + sweepDelay(a.ox) + Math.random() * (slow ? 0.5 : 0.35),
        duration: slow ? 0.6 + Math.random() * 0.4 : 0.35 + Math.random() * 0.3,
      });
    };

    /* Aristas: sólo los cuatro vecinos "hacia adelante" de la retícula.
       Cada par se visita una vez, sin duplicados y sin bucle cuadrático. */
    const neighbours: ReadonlyArray<readonly [number, number]> = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const index = r * cols + c;
        const a = nodes[index];

        for (const [dr, dc] of neighbours) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= rows || nc < 0 || nc >= cols) continue;
          const b = nodes[nr * cols + nc];
          const dx = a.ox - b.ox;
          const dy = a.oy - b.oy;
          if (dx * dx + dy * dy <= maxDistSq) addEdge(index, nr * cols + nc, false);
        }

        /* Algunas cuerdas largas rompen la regularidad de la retícula.
           Se saltan la comprobación de distancia a propósito. */
        if (Math.random() < 0.035) {
          const nr = r + 1 + ((Math.random() * 2) | 0);
          const nc = c + (Math.random() < 0.5 ? -2 : 2);
          if (nr < rows && nc >= 0 && nc < cols) addEdge(index, nr * cols + nc, true);
        }
      }
    }
  }

  /* ── Dimensionado ───────────────────────────────────────────── */
  function resize(): void {
    const nextWidth = window.innerWidth;
    const nextHeight = window.innerHeight;

    /* La barra de direcciones móvil cambia el alto constantemente;
       reconstruir por 60px de diferencia sería tirar trabajo a la basura. */
    const trivial =
      Math.abs(nextWidth - width) < 2 && Math.abs(nextHeight - height) < 90;

    width = nextWidth;
    height = nextHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    /* setTransform, no scale: scale() se acumula en cada resize. */
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";

    if (!trivial || nodes.length === 0) {
      build();
      startTime = performance.now();
    }

    /* Con movimiento reducido no hay bucle: se repinta a mano la malla
       completa y quieta. Con animación, el siguiente frame se encarga
       (pintar aquí haría parpadear la malla entera antes del barrido). */
    if (reduceMotion) draw(Number.POSITIVE_INFINITY);
  }

  /* ── Respiración ────────────────────────────────────────────── */
  function breathe(elapsed: number): void {
    const t = elapsed * BREATH_SPEED;
    for (const node of nodes) {
      const amp = BREATH_AMPLITUDE * node.z;
      node.x = node.ox + Math.sin(t + node.phase) * amp;
      node.y = node.oy + Math.cos(t * 0.8 + node.phase) * amp;
    }
  }

  /* ── Trazado ────────────────────────────────────────────────── */
  function draw(elapsed: number): void {
    ctx.clearRect(0, 0, width, height);

    /* Aristas, agrupadas por cubeta: un stroke() por cubeta. */
    for (const bucket of buckets) {
      if (bucket.edges.length === 0) continue;
      ctx.beginPath();
      let drawn = false;

      for (const edge of bucket.edges) {
        const progress = clamp((elapsed - edge.delay) / edge.duration, 0, 1);
        if (progress <= 0) continue;

        const a = nodes[edge.a];
        const b = nodes[edge.b];
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress);
        drawn = true;
      }

      if (!drawn) continue;
      ctx.strokeStyle = bucket.color;
      ctx.lineWidth = bucket.lineWidth;
      ctx.globalAlpha = bucket.lineAlpha;
      ctx.stroke();
    }

    /* Vértices, también por cubeta: un fill() por cubeta. */
    for (const bucket of buckets) {
      if (bucket.nodes.length === 0) continue;
      ctx.beginPath();

      for (const index of bucket.nodes) {
        const node = nodes[index];
        ctx.moveTo(node.x + node.radius, node.y);
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      }

      ctx.fillStyle = bucket.color;
      ctx.globalAlpha = bucket.nodeAlpha;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  /* ── Bucle ──────────────────────────────────────────────────── */
  function frame(now: number): void {
    if (!running) return;
    const elapsed = (now - startTime) / 1000;
    breathe(elapsed);
    draw(elapsed);
    rafId = requestAnimationFrame(frame);
  }

  function start(): void {
    if (running || reduceMotion) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }

  function stop(): void {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  /* ── Eventos ────────────────────────────────────────────────── */
  let resizeTimer = 0;
  const onResize = (): void => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 160);
  };

  const onVisibility = (): void => {
    if (document.hidden) stop();
    else start();
  };

  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  /* ── Arranque ───────────────────────────────────────────────── */
  /* La paleta se lee antes del primer build: build() reparte los nodos
     entre los colores disponibles, y con la paleta vacía todos caerían
     en el mismo. */
  readPalette();
  resize();

  /* Con movimiento reducido, resize() ya dejó pintado un único
     fotograma con la malla completa y quieta. */
  start();

  return () => {
    stop();
    window.clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
