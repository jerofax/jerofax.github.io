/**
 * ui.ts — Comportamiento de la interfaz: revelado al hacer scroll,
 * progreso de lectura, menú móvil y la luz que sigue al cursor sobre
 * las tarjetas.
 *
 * Se ejecuta en cada "astro:page-load": al cambiar de vista, el
 * ClientRouter reemplaza el contenido sin recargar la página. Todo lo
 * que se registra cuelga de un AbortController que se aborta en la
 * siguiente navegación, así los listeners de window/document no se
 * acumulan vista tras vista.
 */

/* ── Revelado progresivo ────────────────────────────────────────── */
function initReveal(signal: AbortSignal): void {
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
  signal.addEventListener("abort", () => observer.disconnect());
}

/* ── Progreso de lectura + estado del header ────────────────────── */
function initScrollChrome(signal: AbortSignal): void {
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
    { passive: true, signal }
  );

  update();
}

/* ── Menú móvil ─────────────────────────────────────────────────── */
function initMobileMenu(signal: AbortSignal): void {
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

  toggle.addEventListener(
    "click",
    () => setOpen(toggle.getAttribute("aria-expanded") !== "true"),
    { signal }
  );

  panel.addEventListener(
    "click",
    (event) => {
      if ((event.target as HTMLElement).closest("a")) setOpen(false);
    },
    { signal }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") setOpen(false);
    },
    { signal }
  );

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth >= 900) setOpen(false);
    },
    { signal }
  );

  setOpen(false);
}

/* ── Tarjetas con foco de luz que sigue al cursor ───────────────── */
function initSpotlight(signal: AbortSignal): void {
  if (window.matchMedia("(hover: none)").matches) return;
  const cards = document.querySelectorAll<HTMLElement>("[data-spotlight]");

  for (const card of cards) {
    card.addEventListener(
      "pointermove",
      (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      },
      { passive: true, signal }
    );
  }
}

/* ── Botones "Ver más" / "Ver menos" ────────────────────────────── */
/* Un <button> real con aria-expanded y aria-controls: Enter y Espacio
   funcionan sin código extra. El panel se anima por CSS (data-open). */
function initShowMore(signal: AbortSignal): void {
  const toggles = document.querySelectorAll<HTMLButtonElement>("[data-more-toggle]");

  for (const toggle of toggles) {
    const panel = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
    const label = toggle.querySelector<HTMLElement>("[data-more-label]");
    if (!panel) continue;

    toggle.addEventListener(
      "click",
      () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        panel.dataset.open = String(open);
        if (label) {
          label.textContent =
            (open ? toggle.dataset.labelOpen : toggle.dataset.labelClosed) ?? label.textContent;
        }
      },
      { signal }
    );
  }
}

/* ── Scroll suave, sólo después de cargar ───────────────────────── */
/* Si estuviera activo desde el principio, al llegar a "#notas" desde
   una nota el navegador recorrería animada toda la página. Además, el
   ClientRouter reemplaza los atributos de <html> en cada navegación,
   así que la clase hay que volver a ponerla en cada vista. */
function enableSmoothScroll(signal: AbortSignal): void {
  const enable = (): void => {
    requestAnimationFrame(() => {
      if (!signal.aborted) document.documentElement.classList.add("is-ready");
    });
  };
  if (document.readyState === "complete") enable();
  else window.addEventListener("load", enable, { once: true, signal });
}

let current: AbortController | null = null;

export function initUI(): void {
  current?.abort();
  current = new AbortController();
  const { signal } = current;

  enableSmoothScroll(signal);
  initReveal(signal);
  initScrollChrome(signal);
  initMobileMenu(signal);
  initSpotlight(signal);
  initShowMore(signal);
}
