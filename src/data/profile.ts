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

/** Con "/" delante para que también funcionen desde las páginas de notas. */
export const navItems = [
  { name: "Inicio", href: "/#inicio" },
  { name: "Sobre mí", href: "/#sobre-mi" },
  { name: "Proyectos", href: "/#proyectos" },
  { name: "Notas", href: "/#notas" },
  { name: "Contacto", href: "/#contacto" },
] as const;

/* ── Sobre mí ───────────────────────────────────────────────────── */

export const intro =
  "Soy un apasionado por el conocimiento, curioso por naturaleza, me interesa entender cómo funcionan las cosas y explorar en lo más profundo hasta dónde pueden llevarse las ideas cuando se cruzan distintas formas de pensar.";

export const intereses = [
  "Geometría",
  "Topología",
  "Modelamiento matemático",
  "Machine Learning",
  "Computación cuántica",
  "Filosofía de la ciencia",
] as const;

/** Misma paleta que la malla geométrica: morado, amarillo, verde, azul. */
export const accents = ["#8b5cf6", "#eab308", "#22c55e", "#3b82f6"] as const;

export interface Skill {
  num: string;
  titulo: string;
  items: readonly string[];
}

export const skills: readonly Skill[] = [
  {
    num: "01",
    titulo: "Programación y Software",
    items: ["Algoritmos", "Python", "MATLAB", "SQL", "Git", "Linux", "Excel"],
  },
  {
    num: "02",
    titulo: "Matemáticas",
    items: ["Análisis", "Topología", "Álgebra", "Geometría", "Modelación"],
  },
  {
    num: "03",
    titulo: "Computación",
    items: [
      "Machine Learning",
      "PINNs",
      "Computación cuántica",
      "Optimización",
      "Computación científica",
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

export interface WorkEntry {
  ano: string;
  rol: string;
  empresa: string | null;
  descripcion: string;
}

export const trayectoriaLaboral: readonly WorkEntry[] = [
  {
    ano: "2026–presente",
    rol: "Competencias digitales",
    empresa: "Biblioteca Efe Gómez",
    descripcion:
      "Acompañamiento a estudiantes mediante tutorías, talleres y actividades de formación en competencias digitales enfocadas en la programación.",
  },
  {
    ano: "2025",
    rol: "Atención y servicio",
    empresa: "Remedios Café y Arte",
    descripcion:
      "Experiencia laboral en atención al cliente y operación de un entorno de servicio.",
  },
  {
    ano: "2022",
    rol: "Tutor académico",
    empresa: null,
    descripcion:
      "Desarrollo de tutorías remuneradas en matemáticas y programación, acompañando procesos de aprendizaje y resolución de problemas.",
  },
];

/* ── Proyectos ──────────────────────────────────────────────────── */

export interface Project {
  titulo: string;
  resumen: string;
  ano: string;
  estado: "Terminado" | "En curso" | "Explorando";
  tags: readonly string[];
  destacado?: string;
  linkUrl?: string;
  linkText?: string;
}

export const proyectos: readonly Project[] = [
  {
    titulo: "Sistema multiagente de IA",
    resumen:
      "Arquitectura de agentes de inteligencia artificial coordinados para resolver tareas complejas por descomposición. Desarrollado en equipo durante la hackathon de agentes de la Universidad Nacional de Colombia.",
    ano: "2025",
    estado: "Terminado",
    tags: ["Python", "Agentes", "LLMs"],
    destacado: "2.º lugar",
    linkUrl: "https://github.com/K4ztark/Sistema_Multiagentes-Hackathon",
    linkText: "Ver repositorio",
  },
  {
    titulo: "Este portafolio",
    resumen:
      "Sitio estático construido con Astro, con una malla geométrica en canvas que respira de fondo y notas escritas en Markdown con soporte para LaTeX.",
    ano: "2026",
    estado: "En curso",
    tags: ["Astro", "TypeScript", "Canvas"],
  },
  /* Plantillas: reemplázalas por proyectos reales o bórralas. */
  {
    titulo: "Ejemplo de proyecto 1",
    resumen:
      "Descripción breve del proyecto: qué problema aborda, cómo lo trabajaste y qué aprendiste en el proceso.",
    ano: "2026",
    estado: "Explorando",
    tags: ["Etiqueta", "Etiqueta"],
  },
  {
    titulo: "Ejemplo de proyecto 2",
    resumen:
      "Descripción breve del proyecto: qué problema aborda, cómo lo trabajaste y qué aprendiste en el proceso.",
    ano: "2026",
    estado: "Explorando",
    tags: ["Etiqueta", "Etiqueta"],
  },
];

/* Las notas viven en src/content/notas/ — un archivo .md por nota. */
