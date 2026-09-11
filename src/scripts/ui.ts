/**
 * ui.ts — Comportamiento de la interfaz: revelado al hacer scroll,
 * enlace activo de la navegación, progreso de lectura, menú móvil y
 * la luz que sigue al cursor sobre las tarjetas.
 *
 * Todo el trabajo por frame pasa por IntersectionObserver o por un
 * rAF con guarda, así que no hay listeners de scroll que hagan layout.
 */

/* ── Revelado progresivo ────────────────────────────────────────── */
function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (targets.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    for (const el of targets) el.classList.add("is-in");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );

  for (const el of targets) observer.observe(el);
}

/* ── Enlace activo de la navegación ─────────────────────────────── */
function initActiveNav(): void {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")
  );
  if (links.length === 0) return;

  /* Los enlaces son "/#seccion" para que también funcionen desde las
     páginas de notas; aquí sólo interesa el fragmento. */
  const sections = links
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter((el): el is HTMLElement => el !== null);

  /* En una página de nota no hay secciones que vigilar. */
  if (sections.length === 0) return;

  const visibility = new Map<string, number>();

  const setActive = (id: string): void => {
    for (const link of links) {
      const isActive = link.hash === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visibility.set(entry.target.id, entry.intersectionRatio);
      }
      let best = "";
      let bestRatio = 0;
      for (const [id, ratio] of visibility) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        }
      }
      if (best) setActive(best);
    },
    {
      /* Descontamos el header para que la sección "activa" sea la que
         realmente se está leyendo, no la que asoma bajo la barra. */
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0, 0.15, 0.35, 0.6, 1],
    }
  );

  for (const section of sections) observer.observe(section);
}

/* ── Progreso de lectura + estado del header ────────────────────── */
function initScrollChrome(): void {
  const header = document.querySelector<HTMLElement>("[data-header]");
  const progress = document.querySelector<HTMLElement>("[data-progress]");
  if (!header && !progress) return;

  let ticking = false;

  const update = (): void => {
    ticking = false;
    const y = window.scrollY;

    if (header) header.dataset.scrolled = String(y > 12);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, y / max) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );

  update();
}

/* ── Menú móvil ─────────────────────────────────────────────────── */
function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const panel = document.querySelector<HTMLElement>("[data-menu-panel]");
  if (!toggle || !panel) return;

  const setOpen = (open: boolean): void => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    panel.dataset.open = String(open);
    panel.hidden = !open;
    document.body.classList.toggle("is-locked", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  panel.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) setOpen(false);
  });

  setOpen(false);
}

/* ── Tarjetas con foco de luz que sigue al cursor ───────────────── */
function initSpotlight(): void {
  if (window.matchMedia("(hover: none)").matches) return;
  const cards = document.querySelectorAll<HTMLElement>("[data-spotlight]");
  if (cards.length === 0) return;

  for (const card of cards) {
    card.addEventListener(
      "pointermove",
      (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      },
      { passive: true }
    );
  }
}

/* ── Scroll suave, sólo después de cargar ───────────────────────── */
/* Si estuviera activo desde el principio, al llegar a "/#notas" desde
   una nota el navegador recorrería animada toda la página. */
function enableSmoothScroll(): void {
  const enable = (): void => {
    requestAnimationFrame(() =>
      document.documentElement.classList.add("is-ready")
    );
  };
  if (document.readyState === "complete") enable();
  else window.addEventListener("load", enable, { once: true });
}

export function initUI(): void {
  enableSmoothScroll();
  initReveal();
  initActiveNav();
  initScrollChrome();
  initMobileMenu();
  initSpotlight();
}
