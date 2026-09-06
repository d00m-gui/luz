# fixture: TanStack Start + luz

Dashboard standalone que consume `@d00m-gui/luz` como paquete real (no el
código fuente de `../../src`), instalado desde un tarball de `bun pack` —
igual que lo instalaría cualquiera desde npm.

## Setup

Desde la raíz del repo:

```sh
bun run bunup
bun pm pack --destination fixtures
cd fixtures/tanstack-dashboard
bun install
bun run dev     # o: bun run build && node .output/server/index.mjs
```

Repetir los primeros 3 pasos cada vez que cambie `src/` en la librería —
el tarball no se actualiza solo. Si después de reinstalar el cambio no
aparece, bun cacheó la extracción vieja del tarball (mismo nombre de
archivo) — `rm -rf node_modules ~/.bun/install/cache/@d00m-gui` y
`bun install` de nuevo.

Para iterar más rápido sin repaquetizar en cada cambio: `bun link` en
la raíz del repo, después `bun link @d00m-gui/luz` acá (reescribe la
entrada en `package.json` sola) — mismo `luzVite`/`luz` importado, sin
volver a empaquetar. Antes de dar por buena una feature de build,
volver a `bun pack` — un symlink no valida `files`/`exports` del
`package.json` publicado, el tarball sí.

Levantarlo desde la raíz del repo (hace los 4 pasos de arriba en uno):

```sh
bun run fixture:tanstack
```

## Qué prueba

- `luzVite` en modo `"virtual"` (`import "virtual:luz.css"` plano en
  `__root.tsx`, sin archivo en disco) — validado en build+SSR real:
  React 19 hoistea el import a `<link>` sin FOUC en producción. En dev
  el CSS se inyecta por JS (comportamiento estándar de Vite para
  cualquier CSS importado sin `?url`, no algo específico de `luzVite`).
- **No probado/no soportado**: el patrón `?url` + `<link>` manual (el
  que usa el starter para `styles.css`, sin FOUC ni en dev ni en build)
  contra este mismo módulo virtual — rompe en `vite:css-post`
  (`?transform-only`), una limitación de Vite con CSS virtual de
  terceros, no de `luzVite`. Usar modo `"file"` si se necesita ese
  patrón exacto.
- Navegación client-side (`/` → `/about` con `Link` de TanStack Router)
  mantiene el estilo sin re-pegarle al server — confirmado por SSR
  directo a ambas rutas devolviendo el mismo `<link>` con el mismo hash
  (`index-D-LqmXnd.css`), el chunk de CSS es compartido por el entry,
  no por ruta.
- `luz()` (API pública del paquete) corrida server-side en
  `src/dashboard/stats.ts` vía `createServerFn`, midiendo su propio
  tiempo de generación y el tamaño del CSS emitido.
- `@tanstack/charts` (`/react` adapter) graficando esas stats — bytes
  por sección y tiempo de `luz()` por corrida — con colores tomados de
  `var(--primary-500)`/`var(--secondary-500)` que emite `luz()`.
