import { getCollection, type CollectionEntry } from "astro:content";

export type Nota = CollectionEntry<"notas">;

const isDev = import.meta.env.DEV;

/** Tiene página propia: las publicadas siempre; el resto sólo en localhost. */
export const tienePagina = (nota: Nota): boolean =>
  nota.data.estado === "publicada" || isDev;

const rango = { publicada: 0, borrador: 1, oculta: 2 } as const;

/** Notas de la portada: publicadas primero (más recientes arriba),
 *  luego borradores. Las ocultas sólo aparecen en localhost. */
export async function notasListadas(): Promise<Nota[]> {
  const notas = await getCollection(
    "notas",
    ({ data }) => data.estado !== "oculta" || isDev
  );

  return notas.sort(
    (a, b) =>
      rango[a.data.estado] - rango[b.data.estado] ||
      (b.data.fecha?.getTime() ?? 0) - (a.data.fecha?.getTime() ?? 0) ||
      a.data.titulo.localeCompare(b.data.titulo, "es")
  );
}

/* UTC a propósito: "2026-09-11" en el encabezado es medianoche UTC, y en
   hora de Colombia se mostraría como el 10 de septiembre. */
const formato = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const formatFecha = (fecha: Date): string => formato.format(fecha);

/** Texto de la fecha tal como se muestra al visitante. */
export const fechaVisible = (nota: Nota): string =>
  nota.data.estado === "publicada" && nota.data.fecha
    ? formatFecha(nota.data.fecha)
    : "Próximamente";

/** Etiqueta para distinguir en localhost lo que aún no es público. */
export const etiquetaLocal = (nota: Nota): string | null =>
  !isDev || nota.data.estado === "publicada"
    ? null
    : nota.data.estado === "borrador"
      ? "Borrador"
      : "Sólo en local";
