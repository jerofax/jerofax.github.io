# Portafolio de Jerónimo Restrepo Ramírez

Sitio web personal: perfil, formación, proyectos, experiencia, trayectoria académica y notas. Se publica en **<https://jerofax.github.io>**.

El fondo es una malla geométrica dibujada en un `<canvas>` que "respira" suavemente y permanece visible mientras se recorre la página. El contenido va en hojas grises sobre esa malla.

## Qué incluye

La página tiene dos vistas que comparten el hero, el menú, el fondo y el pie de página:

| Vista | Ruta | Secciones |
|---|---|---|
| Sobre mí | `/` | Sobre mí (intereses y skills) · Formación académica · Proyectos · Experiencia laboral · Contacto |
| Académico | `/academico/` | Trayectoria académica · Notas · Contacto |

Además:

- **Notas** escritas en Markdown, con soporte para **LaTeX** (`$...$` en línea y `$$...$$` en bloque). Las publicadas tienen su propia página en `/notas/<nombre-del-archivo>`.
- **Proyectos**: se ven los cuatro primeros y un botón "Ver más" despliega el resto.
- Botón **"Ver CV"**, que abre `public/cv.pdf` en otra pestaña.
- **SEO**: `sitemap-index.xml` generado en cada build, `robots.txt`, metadatos Open Graph y datos estructurados `schema.org/Person` en formato JSON-LD.

## Cómo ejecutarlo

Requiere **Node.js 22.12 o superior** (así lo declara `engines` en `package.json`).

```bash
git clone https://github.com/jerofax/jerofax.github.io.git
cd jerofax.github.io
npm install
npm run dev
```

Abre <http://localhost:4321>.

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera el sitio estático en `./dist/` |
| `npm run preview` | Sirve localmente el resultado de `build` |
| `npm run astro -- --help` | Ayuda de la CLI de Astro |

El proyecto no tiene pruebas automáticas ni linter configurados: `npm run build` es la comprobación de que todo compila.

## Tecnologías

- **[Astro](https://astro.build) 7**: sitio estático, componentes `.astro` y colecciones de contenido.
- **TypeScript** (configuración `strict` de Astro) para los scripts, los datos y la colección de notas.
- **Tailwind CSS 4** vía `@tailwindcss/vite`. Se carga en `global.css` por su reset base y el bloque `@theme`; los componentes están escritos con CSS propio y variables, sin clases utilitarias en el HTML.
- **Canvas 2D** (sin librerías) para la malla de fondo.
- **KaTeX**, con `remark-math` y `rehype-katex`, para las fórmulas de las notas (`@astrojs/markdown-remark` es el procesador de Markdown que esos plugins requieren en Astro 7).
- **`@astrojs/sitemap`** para el sitemap.
- **Tipografías** [Newsreader](https://fonts.google.com/specimen/Newsreader) y [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), cargadas desde Google Fonts. Es el único recurso externo de la página.
- **GitHub Actions + GitHub Pages** para el despliegue.

## Estructura

```text
.
├── .github/workflows/astro.yml   # build y despliegue a GitHub Pages
├── public/
│   ├── assets/about/             # fotos de la trayectoria (.webp)
│   ├── cv.pdf                    # el que abre "Ver CV"
│   ├── favicon.svg
│   ├── foto.jpg                  # retrato del hero
│   └── robots.txt
├── src/
│   ├── components/               # Header, Hero, About, Projects, ProjectCard,
│   │                             # Experience, Trajectory, Notes, Contact,
│   │                             # Footer, SectionHeading, GeometricMesh
│   ├── content/notas/            # una nota por archivo .md
│   ├── content.config.ts         # esquema de las notas
│   ├── data/profile.ts           # TODO el contenido del portafolio
│   ├── layouts/BaseLayout.astro  # <head>, SEO, malla persistente, menú y pie
│   ├── lib/notas.ts              # filtrado, orden y fechas de las notas
│   ├── pages/
│   │   ├── index.astro           # vista "Sobre mí"
│   │   ├── academico.astro       # vista "Académico"
│   │   └── notas/[slug].astro    # página de cada nota
│   ├── scripts/
│   │   ├── mesh.ts               # la malla del canvas
│   │   └── ui.ts                 # revelado, menú móvil, "Ver más", etc.
│   └── styles/global.css         # variables de diseño y estilos base
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Cómo editar el contenido

**Perfil, proyectos, experiencia y trayectoria:** todo está en [`src/data/profile.ts`](src/data/profile.ts); los componentes solo aportan estructura y estilo. El orden de `proyectos` es el orden en pantalla, y los cuatro primeros son los que se ven sin pulsar "Ver más" (constante `PROYECTOS_VISIBLES` en `Projects.astro`).

**Notas:** crea un archivo `.md` en `src/content/notas/`. El nombre del archivo será su dirección. Cada nota empieza con este encabezado:

```markdown
---
titulo: Título de la nota
resumen: Una o dos frases para la portada.
categoria: Matemáticas
fecha: 2026-09-20        # opcional mientras sea borrador
estado: publicada        # publicada | borrador | oculta
---
```

| `estado` | En el sitio publicado | En `localhost` |
|---|---|---|
| `publicada` | Con fecha y página propia | Igual |
| `borrador` | "Próximamente", sin enlace ni página | Se puede abrir para ver cómo queda |
| `oculta` | No aparece | Visible, para plantillas y pruebas |

[`guia-para-escribir-notas.md`](src/content/notas/guia-para-escribir-notas.md) (estado `oculta`) muestra todo lo que admite una nota, incluido LaTeX.

## Cómo funciona por dentro

- **Dos vistas sin recargar:** `BaseLayout.astro` usa el `ClientRouter` de Astro y marca la malla con `transition:persist`, así que al cambiar de vista solo se reemplaza el contenido y el canvas sigue animándose sin reiniciarse. `ui.ts` se vuelve a ejecutar en cada `astro:page-load` y limpia sus listeners con un `AbortController`.
- **La malla** (`mesh.ts`): puntos sobre una retícula con perturbación y una profundidad que fija su tamaño y el grosor de sus aristas. Se mueven solo con una oscilación suave; no reaccionan al cursor ni al scroll. Las aristas se calculan por vecindad en la retícula y se dibujan agrupadas por color y profundidad. Los colores salen de las variables CSS `--mesh-1` a `--mesh-4`, y la animación se detiene si la pestaña no está visible.
- **Accesibilidad:** enlace para saltar al contenido, `aria-current` en el menú, botón "Ver más" con `aria-expanded` y `aria-controls`, y respeto de `prefers-reduced-motion`.

## Despliegue

Cada push a `main` ejecuta [`.github/workflows/astro.yml`](.github/workflows/astro.yml): instala con `npm ci`, compila con Node 22 y publica `dist/` en GitHub Pages. También se puede lanzar a mano desde la pestaña *Actions*.
