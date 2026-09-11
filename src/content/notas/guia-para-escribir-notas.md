---
titulo: Guía para escribir notas
resumen: Plantilla de referencia con todo lo que admite una nota — texto, LaTeX en línea y en bloque, entornos alineados, matrices y citas. Sólo se ve en localhost.
categoria: Plantilla
fecha: 2026-09-11
estado: oculta
---

Cada nota es un archivo `.md` dentro de `src/content/notas/`. El nombre del
archivo se convierte en la dirección de la nota: este archivo se llama
`guia-para-escribir-notas.md`, así que vive en `/notas/guia-para-escribir-notas`.

## El encabezado

Lo que va entre las dos líneas `---` del principio son los datos de la nota:

- `titulo`, `resumen` y `categoria` aparecen en la portada.
- `fecha` se escribe como `2026-09-11`. Es opcional mientras sea borrador.
- `estado` puede ser `publicada`, `borrador` u `oculta`.

Para publicar una nota basta con cambiar `estado: borrador` por
`estado: publicada` y ponerle fecha.

## Texto

Se escribe como en cualquier editor: los párrafos se separan con una línea en
blanco, **negrita** con dos asteriscos, *cursiva* con uno, y los enlaces
así: [Astro](https://astro.build).

## Matemáticas en línea

Entre signos de dólar sencillos: la identidad de Euler $e^{i\pi} + 1 = 0$
queda dentro de la frase, igual que $f \colon X \to Y$ o
$\mathbb{R}^n \setminus \{0\}$.

## Matemáticas en bloque

Entre dobles signos de dólar, cada uno en su propia línea:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

Un homeomorfismo es una biyección continua con inversa continua:

$$
h \colon X \xrightarrow{\;\sim\;} Y, \qquad h \in C(X, Y), \quad h^{-1} \in C(Y, X).
$$

## Ecuaciones alineadas

$$
\begin{aligned}
\chi(S) &= V - E + F \\
        &= 2 - 2g
\end{aligned}
$$

## Matrices y casos

$$
A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, \qquad
|x| = \begin{cases} x & \text{si } x \ge 0 \\ -x & \text{si } x < 0 \end{cases}
$$

## Citas, definiciones y teoremas

> **Definición.** Un espacio topológico $X$ es *conexo* si no puede escribirse
> como unión de dos abiertos disjuntos no vacíos.

> «Lo que no se puede decir, hay que callarlo.» — Wittgenstein, *Tractatus*, §7
