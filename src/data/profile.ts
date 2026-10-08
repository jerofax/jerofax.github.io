/**
 * profile.ts — Fuente única de contenido del portafolio.
 *
 * Los componentes sólo aportan estructura y estilo: para actualizar el
 * portafolio se edita este archivo y nada más.
 */

export const site = {
  name: "Jerónimo Restrepo",
  /** Nombre completo: título de la página, pie y datos para buscadores. */
  fullName: "Jerónimo Restrepo Ramírez",
  firstName: "Jerónimo",
  lastName: "Restrepo",
  roles: ["Matemático", "Científico de la computación", "Filósofo"],
  location: "Medellín, Colombia",
  email: "jeronimorestreporamirez2007@gmail.com",
  github: "https://github.com/jerofax",
  cv: "/cv.pdf",
  photo: "/foto.jpg",
  tagline:
    "Estudio la forma de las cosas: en las matemáticas, en el código y en las ideas.",
  description:
    "Portafolio de Jerónimo Restrepo Ramírez — matemático, científico de la computación y filósofo. Geometría, topología, machine learning científico y computación cuántica.",
} as const;

/* ── Vistas ─────────────────────────────────────────────────────── */

/** El portafolio tiene dos vistas, cada una en su propia ruta. */
export type Vista = "sobre-mi" | "academico";

export const vistas = {
  "sobre-mi": { nombre: "Sobre mí", href: "/" },
  /* Con barra final: el build genera /academico/index.html, y sin ella
     GitHub Pages respondería primero con una redirección. */
  academico: { nombre: "Académico", href: "/academico/" },
} as const satisfies Record<Vista, { nombre: string; href: string }>;

/* ── Sobre mí ───────────────────────────────────────────────────── */

export const intro =
  "Soy un apasionado por el conocimiento, curioso por naturaleza, me interesa entender cómo funcionan las cosas y explorar en lo más profundo hasta dónde pueden llevarse las ideas cuando se cruzan distintas formas de pensar.";

export const intereses = [
  "Matemáticas experimentales",
  "Análisis funcional y EDP",
  "Algoritmos",
  "Análisis numérico",
  "SciML",
  "Modelamiento y optimización",
  "Geometría y topología computacional",
  "Filosofía de la ciencia",
] as const;

/** Misma paleta que la malla geométrica: morado, amarillo, verde, azul. */
export const accents = ["#8b5cf6", "#eab308", "#22c55e", "#3b82f6"] as const;

/** Un ítem "en exploración" se muestra con una insignia junto al texto. */
export interface SkillItem {
  texto: string;
  enExploracion: true;
}

export interface Skill {
  num: string;
  titulo: string;
  items: readonly (string | SkillItem)[];
}

export const skills: readonly Skill[] = [
  {
    num: "01",
    titulo: "Programación y software",
    items: [
      "Python",
      "R",
      "MATLAB",
      "SQL (PostgreSQL)",
      "Git",
      "Linux",
      "Excel",
      "Diseño de bases de datos relacionales",
      "Sistemas multiagente con LLMs",
    ],
  },
  {
    num: "02",
    titulo: "Matemáticas aplicadas y computación científica",
    items: [
      "Modelamiento matemático",
      "Optimización lineal y no lineal",
      "Análisis de datos y estadística",
      "Computación científica (MATLAB, Python)",
      "Ecuaciones diferenciales",
      "Análisis de algoritmos",
      { texto: "Machine learning científico (PINNs)", enExploracion: true },
      { texto: "Computación cuántica", enExploracion: true },
    ],
  },
  {
    num: "03",
    titulo: "Competencias transversales",
    items: [
      "Comunicación técnica",
      "Pensamiento crítico y argumentación",
      "Liderazgo y trabajo en equipo",
      "Resolución de problemas",
      "Asertividad",
      "Inglés (B1)",
      "Latín clásico",
    ],
  },
];

export interface Education {
  ano: string;
  institucion: string;
  programa: string;
  tipo: string | null;
}

export const formacionAcademica: readonly Education[] = [
  {
    ano: "2024–presente",
    institucion: "Universidad Nacional de Colombia — Sede Medellín",
    programa: "Ciencias de la Computación",
    tipo: "Programa de pregrado",
  },
  {
    ano: "2024–presente",
    institucion: "Universidad Nacional de Colombia — Sede Medellín",
    programa: "Matemáticas",
    tipo: "Programa de pregrado",
  },
  {
    ano: "2026–presente",
    institucion: "Universidad de Antioquia",
    programa: "Filosofía",
    tipo: "Programa de pregrado",
  },
  {
    ano: "2023",
    institucion: "SENA",
    programa: "Análisis de Datos",
    tipo: "Técnica profesional",
  },
  {
    ano: "2023",
    institucion: "INEM José Félix de Restrepo",
    programa: "Bachillerato con profundización en Procesos Matemáticos",
    tipo: null,
  },
];

/* ── Proyectos ──────────────────────────────────────────────────── */

export interface ProjectLink {
  url: string;
  texto: string;
}

export interface Project {
  titulo: string;
  resumen: string;
  estado: "Terminado" | "En curso" | "Planeado";
  tags: readonly string[];
  /** Insignia destacada junto al título (p. ej. un premio). */
  destacado?: string;
  enlace?: ProjectLink;
}

/* El orden importa: los cuatro primeros se ven siempre y el resto se
   despliega con "Ver más" (ver PROYECTOS_VISIBLES en Projects.astro). */
export const proyectos: readonly Project[] = [
  {
    titulo: "Sistema multiagente para decisiones económicas",
    resumen:
      "Simulación de la toma de decisiones estratégicas de una empresa automotriz ficticia sobre precios, producción y personal. Agentes especializados (consumidor, Estado, inversores y analista de crecimiento) evalúan cada decisión desde su perspectiva con herramientas personalizadas de estimación de precios, demanda, producción e inteligencia competitiva. Un agente escritor consolida los resultados en un reporte en Markdown.",
    estado: "Terminado",
    tags: ["Python", "LLMs", "Sistemas multiagente"],
    destacado: "2.º lugar, hackathon UNAL",
    enlace: {
      url: "https://github.com/K4ztark/Sistema_Multiagentes-Hackathon",
      texto: "Ver repositorio",
    },
  },
  {
    titulo: "Base de datos relacional para operaciones bancarias",
    resumen:
      "Diseño e implementación de una base de datos para la gestión de operaciones bancarias. Modela clientes (personas naturales y jurídicas), cuentas, transacciones, sucursales y empleados. El modelo Entidad-Relación se transforma a un esquema relacional, implementado en PostgreSQL, con consultas formuladas también en álgebra y cálculo relacional.",
    estado: "Terminado",
    tags: ["Modelo E-R", "Modelo relacional", "PostgreSQL", "Álgebra relacional"],
    // TODO: reemplazar "#" por la URL del repositorio.
    enlace: { url: "#", texto: "Ver repositorio" },
  },
  {
    titulo: "Explog · Matemáticas experimentales",
    resumen:
      "Proyecto de investigación en matemáticas experimentales sobre Ricci Flow, la ecuación de evolución geométrica central en la demostración de la conjetura de Poincaré. Los resultados se publicarán en explog.xyz, con repositorio abierto.",
    estado: "En curso",
    tags: ["Flujo de Ricci", "Geometría diferencial", "Matemáticas experimentales"],
    enlace: { url: "https://github.com/jerofax/explog", texto: "Ver repositorio" },
  },
  {
    titulo: "Algoritmos: material de estudio",
    resumen:
      "Repositorio con textos de referencia, explicaciones de los métodos algorítmicos y resolución rigurosa de ejercicios, correspondiente a un curso de Algoritmos de nivel posgrado.",
    estado: "En curso",
    tags: ["Análisis de algoritmos", "Estructuras de datos", "Repositorio"],
    enlace: {
      url: "https://github.com/jerofax/algoritmos-material",
      texto: "Ver repositorio",
    },
  },
  {
    titulo: "Recuperación de energía con bombas como turbinas",
    resumen:
      "Formulación como problema de programación no lineal de la recuperación de energía hidráulica en una red de distribución de agua, reemplazando una válvula reductora de presión por una bomba operando como turbina (PAT). Parte de un caso de estudio publicado y explora la regulación híbrida de la máquina.",
    estado: "En curso",
    tags: ["Optimización no lineal", "Modelamiento matemático", "Energías renovables", "Python"],
    enlace: {
      url: "https://github.com/jerofax/pat-energy-recovery-nlp",
      texto: "Ver repositorio",
    },
  },
  {
    titulo: "Teoría de la computación: ejercicios",
    resumen:
      "Tres ejercicios de los parciales de Introducción a la Teoría de la Computación resueltos en Python: simulación de un autómata finito determinista, paso a Forma Normal de Chomsky con el algoritmo CYK y su árbol de derivación, y decisión de la equivalencia de dos autómatas por la diferencia simétrica.",
    estado: "Terminado",
    tags: ["Autómatas", "Gramáticas libres de contexto", "CYK", "Python"],
    enlace: {
      url: "https://github.com/jerofax/teoria-de-la-computacion",
      texto: "Ver repositorio",
    },
  },
  {
    titulo: "Gestor de información para asesores de seguros",
    resumen:
      "Aplicación web para asesores de seguros, con usuario y base de datos propios por asesor, acceso rápido a la información y búsqueda de clientes.",
    estado: "Planeado",
    tags: ["Aplicación web", "Bases de datos", "Multiusuario"],
    // TODO: reemplazar "#" por la URL del repositorio.
    enlace: { url: "#", texto: "Ver repositorio" },
  },
];

/* ── Experiencia laboral ────────────────────────────────────────── */

export interface WorkEntry {
  /** Encabezado de la entrada (área de trabajo o lugar). */
  titulo: string;
  lugar?: string;
  periodo: string;
  cargo?: string;
  funcion: string;
  /** Viñetas (lista) o un único párrafo, como en el original. */
  descripcion: string | readonly string[];
  habilidades: string;
}

export const experienciaLaboral: readonly WorkEntry[] = [
  {
    titulo: "Competencias digitales",
    lugar: "Biblioteca Efe Gómez",
    periodo: "feb 2026–presente",
    cargo: "Estudiante auxiliar",
    funcion:
      "Diseñar y dictar cursos de programación y herramientas digitales para toda la comunidad universitaria.",
    descripcion: [
      "~15 cursos diseñados desde cero en análisis de datos (Python, R, Excel) y computación científica (MATLAB, Python).",
      "Sesiones virtuales con 100–300 asistentes por curso.",
      "Mis cursos concentran más del 40% de las ~9000 asistencias del equipo en el semestre 2026-1.",
      "Produzco material y grabaciones para el repositorio y la plataforma Unvirtual, construidos en equipo.",
    ],
    habilidades:
      "Python, R, MATLAB, Excel; diseño instruccional; comunicación técnica con públicos heterogéneos; tutoría a gran escala; trabajo en equipo.",
  },
  {
    titulo: "Remedios Café y Arte",
    periodo: "jul–dic 2025",
    cargo: "Mesero",
    funcion: "Atención al cliente y operación de un entorno de servicio.",
    descripcion: [
      "Manejo de caja y dinero.",
      "Control de inventarios.",
      "Preparación de bebidas y cocina; barismo a nivel intermedio.",
    ],
    habilidades:
      "Orientación al cliente, responsabilidad en el manejo de efectivo, control de inventarios, barismo.",
  },
  {
    titulo: "Tutor académico independiente",
    periodo: "2022–presente",
    funcion:
      "Acompañar el aprendizaje de matemáticas universitarias y de colegio.",
    descripcion:
      "Más de 100 estudiantes atendidos de forma individual, en modalidad virtual y presencial. Materias principales: matemáticas básicas, geometría vectorial, analítica y euclidiana, ecuaciones diferenciales, fundamentos de matemáticas y matemáticas discretas.",
    habilidades:
      "Explicar conceptos abstractos, adaptarse al nivel de cada estudiante, autonomía y gestión del tiempo.",
  },
];

/* ── Académico ──────────────────────────────────────────────────── */

export const trayectoriaIntro =
  "Mi pasión por el conocimiento se ha construido desde muy pequeño a través de las personas y experiencias que me han rodeado. Mi familia, especialmente mis padres, fue un motor fundamental para impulsarme a explorar, aprender y participar en todo aquello que despertara mi curiosidad; mis profesores, amigos y compañeros han seguido enriqueciendo ese proceso con nuevas perspectivas, preguntas y formas de entender el mundo. Esta trayectoria reúne algunas de las experiencias que más han contribuido a mi formación y que considero fundamentales en la persona y el estudiante que soy actualmente.";

export interface TimelineImage {
  src: string;
  alt: string;
}

export interface TimelineEntry {
  ano: string;
  titulo: string;
  descripcion: readonly string[];
  destacado?: string;
  imagenes?: readonly TimelineImage[];
  linkText?: string;
  linkUrl?: string;
}

export const trayectoriaAcademica: readonly TimelineEntry[] = [
  {
    ano: "2015–2019",
    titulo: "Primeros acercamientos a la ciencia",
    descripcion: [
      "Desde la educación primaria comencé a participar en proyectos escolares de investigación y experimentación. A través del Programa Ondas desarrollé un proyecto relacionado con el aprovechamiento de materiales reciclables para la construcción de elementos prácticos y, luego, participé en proyectos de robótica, acercándome tempranamente a la investigación, el diseño y la experimentación tecnológica.",
    ],
    imagenes: [
      {
        src: "/assets/about/foto-programa-ondas.webp",
        alt: "Jerónimo con un proyecto de robótica escolar del Programa Ondas",
      },
    ],
  },
  {
    ano: "2019–2023",
    titulo: "Matemáticas, liderazgo y enseñanza",
    descripcion: [
      "Mi formación matemática comenzó a adquirir un carácter más especializado durante el bachillerato. En 2021, al ingresar a la rama académica del INEM, empecé a orientar mi formación hacia las matemáticas. Desde 2023 cursé la modalidad media académica de profundización en Procesos Matemáticos, complementando esta formación con mi participación y liderazgo en el semillero de matemáticas.",
      "Durante este periodo también comencé a acompañar a otros estudiantes en su aprendizaje, incluyendo tutorías de matemáticas y programación, y participé en actividades de divulgación como las Ferias de Ciencias y Matemáticas.",
    ],
  },
  {
    ano: "2023–2025",
    titulo: "Modelos de Naciones Unidas",
    descripcion: [
      "Desde 2023 participé activamente en Simulaciones de Modelos de Naciones Unidas en diferentes instituciones educativas, una experiencia que se convirtió en una parte importante de mi formación durante el bachillerato. La participación constante en estos espacios me permitió desarrollar una formación cultural y política amplia.",
      "A lo largo de esta experiencia fortalecí especialmente mi capacidad de argumentación, pensamiento crítico, comunicación oral, liderazgo, negociación y construcción de posiciones frente a problemas complejos. También aprendí a desenvolverme en entornos sociales diversos, defender ideas con claridad y comprender diferentes perspectivas mediante el diálogo y la confrontación respetuosa de argumentos.",
    ],
    destacado:
      "Mi participación estuvo acompañada de diversos reconocimientos obtenidos en los modelos en los que participé.",
    imagenes: [
      {
        src: "/assets/about/foto-modelo-onu.webp",
        alt: "Jerónimo con una medalla del CSMUN, evidencia fotográfica del Grupo ONU",
      },
    ],
    linkText: "Evidencia fotográfica del Grupo ONU",
    linkUrl: "https://www.instagram.com/inemun.official/",
  },
  {
    ano: "2025–2026",
    titulo: "Exploración científica y tecnológica",
    descripcion: [
      "Durante 2025 y 2026 amplié mi formación académica mediante la participación en diferentes espacios de exploración científica y tecnológica, principalmente en las áreas de inteligencia artificial, computación cuántica y aprendizaje automático científico.",
      "Participé en una hackathon de agentes de inteligencia artificial en la Universidad Nacional de Colombia, donde desarrollé un proyecto que obtuvo el segundo lugar. También participé en un workshop internacional de computación cuántica y en un meetup de Python enfocado en computación cuántica.",
      "Más recientemente, participé en un workshop de Machine Learning científico en la Universidad EAFIT, donde profundicé en el estudio de las Physics-Informed Neural Networks (PINNs), conocimiento en el que me encuentro interesado en seguir investigando.",
    ],
    destacado:
      "Estas experiencias han complementado mi formación universitaria mediante la participación práctica y el contacto con comunidades científicas y tecnológicas.",
    imagenes: [
      {
        src: "/assets/about/foto-hackathon-unal.webp",
        alt: "Equipo en la hackathon de agentes de inteligencia artificial en la Universidad Nacional de Colombia",
      },
      {
        src: "/assets/about/foto-workshop-eafit.webp",
        alt: "Grupo del workshop de Machine Learning científico en la Universidad EAFIT",
      },
    ],
    linkText: "Repositorio de la hackathon",
    linkUrl: "https://github.com/K4ztark/Sistema_Multiagentes-Hackathon",
  },
  {
    ano: "2024–presente",
    titulo: "Formación interdisciplinaria",
    descripcion: [
      "Actualmente desarrollo mi formación universitaria en los pregrados de Matemáticas, Ciencias de la Computación y Filosofía, disciplinas que he ido integrando progresivamente a través de mi formación académica, proyectos y experiencias de investigación.",
    ],
  },
];

/* Las notas viven en src/content/notas/ — un archivo .md por nota. */
