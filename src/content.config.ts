import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Notas: un archivo .md por nota en src/content/notas/.
 * Admiten LaTeX: $...$ en línea y $$...$$ en bloque (KaTeX).
 *
 * estado:
 *  - "publicada": aparece en la portada con su fecha y tiene página propia.
 *  - "borrador":  en la web publicada sale como "Próximamente", sin enlace.
 *                 En localhost se puede abrir para ir viendo cómo queda.
 *  - "oculta":    sólo existe en localhost (plantillas, pruebas).
 */
const notas = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notas" }),
  schema: z.object({
    titulo: z.string(),
    resumen: z.string(),
    categoria: z.string(),
    fecha: z.coerce.date().optional(),
    estado: z.enum(["publicada", "borrador", "oculta"]).default("publicada"),
  }),
});

export const collections = { notas };
