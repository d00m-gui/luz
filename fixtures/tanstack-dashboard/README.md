# fixture: TanStack Start + luz

Dashboard standalone que consume `@d00m-gui/luz` como paquete real (no el
código fuente de `../../src`), instalado desde un tarball de `bun pack` —
igual que lo instalaría cualquiera desde npm. Es la prueba e2e del
paquete: cada componente de `components/*.css` aparece usado al menos una
vez en una página real, más utilities y clases del bridge shadcn.

## Setup

Desde la raíz del repo:

```sh
bun run bunup
bun pm pack --filename fixtures/luz.tgz
cd fixtures/tanstack-dashboard
bun install
bun run dev     # o: bun run build && node .output/server/index.mjs
```

Repetir los primeros 3 pasos cada vez que cambie `src/` en la librería —
el tarball no se actualiza solo. Si después de reinstalar el cambio no
aparece, bun cacheó la extracción vieja del tarball (mismo nombre de
archivo) — `rm -rf node_modules ~/.bun/install/cache/@d00m-gui` y
`bun install` de nuevo.

Levantarlo desde la raíz del repo (hace los 4 pasos de arriba en uno):

```sh
bun run fixture:tanstack
```

`src/routeTree.gen.ts` está gitignored: lo regenera el plugin de TanStack
Start en `dev`/`build` (o `bun run generate-routes`). Al agregar una ruta
bajo `src/routes/` no hay que tocarlo a mano.

## Cómo entra el CSS

- `vite.config.ts`: `luzVite(luzConfig)` — el plugin no escribe nada a
  disco ni sirve módulos virtuales.
- `src/styles.css` arranca con `@import "@d00m-gui/luz/luz.css";`. El
  plugin lo expande ahí mismo en `@import` de `reset.css` +
  `components.css` (archivos reales del paquete) y en las secciones
  generadas (`theme`, `bridge`, `utilities`, esta última escaneando
  `src/`). Después sigue `@import "./theme.css"` (personalización del
  fixture, ver abajo) y tres reglas residuales.
- `styles.css` se carga vía `?url` + `<link>` en `__root.tsx` (patrón
  del starter): sin FOUC ni en dev ni en build, y el mismo `<link>`
  compartido por todas las rutas en navegación client-side.

## Diseño

Dashboard minimalista tipo consola, en la línea de `docs/`. La config
(`luz.config.ts`) ejercita knobs que el default no toca: primary pastel
en OKLCH (`oklch(82% 0.09 320)`), `harmony: "triad"`, `neutralTint: 0.3`
(grises teñidos), `depthSign: -1` (superficies hundidas, más oscuras que
el fondo), `schemeChroma`/`contrastThreshold` para que los botones pastel
lleven texto oscuro, `density: 0.9`, fuentes DM Sans / DM Mono.

Regla del fixture: **solo clases de luz, cero `style=` inline**. Todo knob
de luz (`--shell-pane-width`, `--scroll-max`, `--range-length`,
`--radial-angle`…) se fija desde una clase propia `.app-*` en
`src/theme.css`; los `--scheme` van por clase (`.primary`, `.success`…),
los anchos de grilla por `.grid.xs/.sm/.md/.lg`, y los menús se anclan
solos al `popovertarget` (`.menu { position-anchor: auto }`).
`src/styles.css` queda en los dos `@import` + `body { overflow: hidden }`

- tres reglas que son shortcomings abiertos (listadas abajo).

Estructura: `src/dashboard/shell.tsx` (`DashboardShell`: `.shell.app` →
sidebar `.shell-pane.fixed` con `ul.list.nav` de navegación + usuario
(`.menu` con `.menu-item`), pane principal con `.panel-header.top`
(breadcrumbs, búsqueda), `.shell-body` > `.page` con `.page-header`
(título, descripción, acciones) y `.page-body` (`.stack` de secciones +
`.page-aside` opcional, `.with-aside`), `.panel-header.bottom` como
statusbar; drawer para mobile, sidebar/búsqueda con `max-lg:hidden` y
trigger del drawer con `lg:hidden`). Páginas:

| Ruta        | Página   | Qué es                                                                                                      |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `/`         | Overview | stats de `luz()` corrido en el server, charts, tabla de corridas, aside de config                           |
| `/forms`    | Settings | onboarding (wizard), perfil, notificaciones, apariencia, plan, danger zone                                  |
| `/overlays` | Team     | tabla de miembros con filtros/paginación, invitar (dialog), perfil (drawer), menús por fila, notices, roles |
| `/layout`   | Projects | portada (hero), grid de proyectos, explorador de archivos (shell embebido), layout composer (element)       |
| `/content`  | Notes    | release notes en `article.prose` con tabla de contenidos                                                    |
| `/about`    | About    | ruta fuera del shell: prueba que el CSS del entry sobrevive la navegación client-side                       |

## Cobertura del catálogo

Cada componente de `components/*.css` (sin `theme.css`) al menos una vez:

| Componente                | Dónde                                                                                                                                                                                           |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alert`                   | Settings (success al guardar, warning email sin verificar, info, danger zone con botón `data-role="cancel"` que no hereda el `--scheme`)                                                        |
| `anchor`                  | Notes (7 variantes como links reales)                                                                                                                                                           |
| `avatar`                  | shell, Overview, Team (`sm`, `lg`), Projects (`.avatar-group` + `.avatar.more`)                                                                                                                 |
| `badge`                   | todas                                                                                                                                                                                           |
| `blockquote`              | Notes                                                                                                                                                                                           |
| `breadcrumbs`             | shell (topbar)                                                                                                                                                                                  |
| `button`                  | todas; Settings cubre todos los `data-role` y variantes (`ghost`, `outline`, `pill`, `icon`, `glass`, `loading`, `badge`, `cta`, `block`)                                                       |
| `card`                    | todas; Projects (`.card-cover`), Team (`.card-toolbar`)                                                                                                                                         |
| `checkbox-radio`          | Settings (checkbox, switch, radio), Team (tabs)                                                                                                                                                 |
| `code`                    | Overview, Projects (`pre > code`), Notes                                                                                                                                                        |
| `dialog`                  | Team (invite, `form method="dialog"`)                                                                                                                                                           |
| `drawer`                  | shell (mobile), Team (perfil, `data-placement="right"`)                                                                                                                                         |
| `element`                 | Projects (composer: `.row`/`.column`/`.pair` + `.wire`, `.auto`)                                                                                                                                |
| `empty`                   | Team (filtro sin resultados, drawer sin selección)                                                                                                                                              |
| `field`                   | Settings (`.field`, `.field.row`, `.field-hint` con `aria-invalid`), Team (dialog), shell (búsqueda)                                                                                            |
| `file-input`              | Settings (avatar)                                                                                                                                                                               |
| `fluid`                   | Projects (hero)                                                                                                                                                                                 |
| `form`                    | Settings (`.form-actions.sticky`), Team                                                                                                                                                         |
| `fx`                      | todas las cards (`.background-raised`), roles de Team (`.background-glow`), hero de Projects (`.background-conic-rainbow` en `.hero-background`) |
| `grid`                    | todas (`.xs` stats, `.md` charts, `.sm` proyectos y roles)                                                                                                                                      |
| `hero`                    | Projects (`.hero.compact` + `.hero-background`)                                                                                                                                                 |
| `hr`                      | Settings, Notes (`.dashed`), menús                                                                                                                                                              |
| `icon`                    | Projects, Notes                                                                                                                                                                                 |
| `join`                    | shell (búsqueda + kbd), Settings, Team                                                                                                                                                          |
| `kbd`                     | shell, Settings (aside Shortcuts), Team (atajos reales `/`, `I`, `Esc`), Notes                                                                                                                  |
| `list`                    | shell (`ul.list.nav` con `li`), Overview (config), Settings (Shortcuts: `kbd` alineado a la derecha), Team (invites con `--scroll-max`), Projects (`.filetree` con icono que rota), Notes (ToC) |
| `nav`                     | shell, Projects (filtros con `aria-current`)                                                                                                                                                    |
| `overlay`                 | shell (`.menu` + `.menu-item` usuario), Team (`.menu` por fila con `.menu-item.danger`, `.popover`, `.notice`)                                                                                  |
| `page`                    | shell (`.page`, `.page-header`, `.page-header-title`, `.page-body.with-aside`, `.page-aside`, `.stack`)                                                                                         |
| `panel-header`            | shell (`.top`/`.bottom`), Projects, Team (drawer)                                                                                                                                               |
| `progress`                | Settings (`.meter` en plan), Projects                                                                                                                                                           |
| `prose`                   | Notes (`.prose` dentro de `.card-content`), About                                                                                                                                               |
| `radial`                  | Team (`.radial-trigger.fixed` + `.radial-menu.fixed`)                                                                                                                                           |
| `range`                   | Settings (density con ticks, volumen vertical con `--range-length`)                                                                                                                             |
| `section`                 | todas                                                                                                                                                                                           |
| `selection`               | Projects, Notes (`mark`)                                                                                                                                                                        |
| `shell`                   | shell (`.shell.app`), Projects (explorador `.shell.responsive` con `--shell-height`)                                                                                                            |
| `skeleton`                | Team (refresh: `.skeleton.avatar`, `.text`, `.badge`)                                                                                                                                           |
| `spinner`                 | Settings (`.loading`), Team (`aria-busy`)                                                                                                                                                       |
| `stat`                    | Overview                                                                                                                                                                                        |
| `status`                  | shell (nav con `--scheme`, statusbar), Overview, Team (presencia `.success.pulse`/`.warning`/`.neutral`), Projects                                                                              |
| `table`                   | Overview, Team                                                                                                                                                                                  |
| `tabs`                    | Team (default con `max-lg:hidden`, `.segmented`, `.pagination`, `.bottom` con `lg:hidden`)                                                                                                      |
| `text`                    | Notes (strong/b/em/i/mark/small/abbr/samp)                                                                                                                                                      |
| `tooltip`                 | Settings, Team                                                                                                                                                                                  |
| `typography`              | Notes (h1–h6), headers                                                                                                                                                                          |
| `wizard`                  | Settings (onboarding)                                                                                                                                                                           |
| `_center`                 | Projects (Create project), About (`.center` grid)                                                                                                                                               |
| `_disabled`               | Settings                                                                                                                                                                                        |
| `_lazy-render`, `_scroll` | Team (lista de invites)                                                                                                                                                                         |
| `_print`                  | Notes (Print this page)                                                                                                                                                                         |

## theme.css

`src/theme.css` es la personalización del fixture, importada después de
luz. Solo tokens de luz (`--current-bg`, `--foreground`,
`--element-background`, `--neutral-950`, `--scheme`), cero colores
literales; los selectores son clases de luz o las pocas clases propias
`.app-*`.

- `.card`/`.stat`: `background-image: linear-gradient(180deg, oklch(from
var(--current-bg) calc(l + 0.02) c h), var(--current-bg))` — un paso más
  claro arriba; `.card > .card-meta` pasa a fondo transparente para no
  tapar el gradiente.
- Botones sólidos (`:is(.btn, button)` menos `.ghost/.outline/.badge/
.tab/.menu-item/.list-row/…`): `box-shadow: inset 0 1px 0 oklch(from
var(--foreground) l c h / 8%)` + la sombra exterior original.
  `data-role="apply"`, `.apply` y `.cta` suman un gradiente leve que se
  aclara en hover.
- `.hero`: `--fx-blur: 4rem` (conic más suave) y `--hero-min-height: 14rem`.
- `.radial-trigger.fixed`: sube a `--space-16` para no pisar el statusbar
  y se hace cuadrado (`--space-11`, `padding: 0`).
- `.panel-header.app-topbar` / `.app-statusbar`: fondo
  `oklch(from var(--element-background) l c h / 70%)` + `backdrop-filter`.
- `.app-sidebar`: `--shell-pane-width: 15rem` y superficie
  `--element-background`; `.list.nav .list-row[aria-current="page"]` con
  fondo `oklch(from var(--scheme, var(--foreground)) l c h / 14%)`.
- `.stat-value` en `--font-monospace` + `tabular-nums`; `table td` con
  `tabular-nums`.
- Knobs de instancia, una clase por uso: `.app-files` (`--shell-height`,
  `--shell-pane-width` del pane fijo), `.app-projects .card-cover`
  (`--ratio`), `.app-composer .element.pair` (`--element-width-min`),
  `.app-invites` (`--scroll-max`, `--lazy-render-size`), `.app-volume`
  (`--range-length`, `--range-steps`), `.app-density` (`--range-steps`),
  `.app-quick-actions` (`--radial-distance` + `--radial-angle` por
  `nth-child`), `.app-search input` (ancho).

## Resuelto en luz

Lo que la primera versión del fixture listaba como shortcoming y hoy es
una clase o knob de luz, con dónde se usa acá:

- `.shell.app` + `--shell-height` — frame de la app; `.shell.responsive` —
  explorador de archivos (Projects).
- `.page`, `.page-header`, `.page-header-title`, `.page-body` (+
  `.with-aside`, `--page-aside-width`), `.page-aside`, `.stack`
  (`--stack-gap`), `.page section { padding: 0 }` — shell.
- `.list.nav`, `.list > li`, `button.list-row`, `.list-row >
:last-child { justify-self: end }`, `.filetree` con icono que rota en
  `[open]`, `nav > ul:not(.list)` — shell (nav), Settings (Shortcuts),
  Projects (filetree).
- Variantes responsive `sm:`…`2xl:` / `max-sm:`…`max-2xl:` (+
  `breakpoint:estado:util`) — `max-lg:hidden` / `lg:hidden` en shell y
  Team.
- `.prose` real (`--prose-width`, ritmo `> * + *`, `ol` numerado, `dl`),
  `code`/`pre`/`samp` con `--code-bg`/`--on-code`, `--blockquote-font-size`
  — Notes.
- `.menu-item` (+ `.danger`) — shell y Team.
- `.field`, `.field.row`, `.field-hint` (rojo bajo `aria-invalid`,
  atenuado bajo `:disabled`) — Settings.
- `.meter`, `.form-actions` (+ `.sticky`) — Settings.
- `.avatar-group` + `.avatar.more` — Projects.
- `.card-cover` (`--ratio`), `.card-toolbar`, `.card-content` con
  `flex-direction` pisable — Projects, Team.
- `.hero.compact`, `.hero-background`, `--hero-min-height` — Projects.
- `.skeleton.text/.avatar/.badge` — Team.
- `.radial-trigger.fixed` / `.radial-menu.fixed` — Team.
- `.element.wire` — Projects (composer).
- `.status { background: var(--scheme, currentColor) }` + `.status.pulse`
  — Team (presencia), shell, Projects.
- `--range-length`, `--scroll-max`, `max-h-*`/`min-h-*`/`size-*`/insets,
  `aspect-square/video`, `rounded-full`, `w-screen`/`h-screen` —
  Settings, Team.
- `.tab { gap }`, `nav :is(a, button)[aria-current]`, `.alert >
button { --scheme: neutral }`, `data-role=` en botones, `.center` grid,
  `--fx-blur` + `.background-conic-rainbow.sharp`, `.grid.xs/sm/md/lg`,
  `_print.css` ocultando el chrome de `.shell.app`.

## Shortcomings abiertos

Propuestas, no decisiones — cada una requiere confirmación antes de tocar
`src/`. `styles.css` ya no tiene reglas residuales: `.shell-body:has(> .page)`,
`.card > table`, `.join > input[type=search]`, `.element.fixed`,
`.skeleton.text` (`--skeleton-width`), `col-span-full`, `p-0`/`m-0`/`gap-0`,
`.hero-background` + `.background-*`, `.radial-trigger` cuadrado,
`--notice-duration` (default 6s, `.notice.sticky` para desactivarlo) y
`section` con gutter `vw` solo a nivel de `body`/`main` se resolvieron en luz.

- `.radial-menu` no distribuye los `.radial-item` solo: `--radial-angle`
  hay que fijarlo por ítem (acá con `:nth-child` en theme.css). Propuesta:
  `--radial-start`/`--radial-sweep` + `sibling-index()`, o variantes
  `.radial-menu.quarter/.half`.
- Utilities de ancho fijo terminan en `w-24` (6rem) y no hay `max-w-N`:
  el ancho del buscador del topbar (14rem) vive en theme.css.
- Breakpoints de `md:`/`lg:`… son los de `DEFAULT_BREAKPOINTS`;
  `LuzConfig.breakpoints` no llega a `emitUtilitiesCSS`.
- `.grid.overflow` sigue haciendo absoluto a cualquier `.card-meta`; una
  regla top-level `.card-cover + .card-meta` permitiría superponer la meta
  a la portada sin `.grid.overflow`.
- `.page-aside` no es sticky; para un ToC largo haría falta
  `position: sticky; top: var(--space-6)`.
- `.radial-trigger.fixed` en `--space-6` queda encima de un
  `.panel-header.bottom` de `.shell.app` (theme.css lo sube).
