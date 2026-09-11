# luz — Software Design Document

Estado del diseño y la arquitectura actual de `luz`, mantenido junto al
refactor en curso (`feat/refactor-core`). No es un changelog (ver
`CHANGELOG.md`) ni una guía de trabajo para el asistente (ver `CLAUDE.md`):
es la foto de "cómo está armado y por qué".

## Qué es luz

Librería CSS-in-TypeScript de theming. Recibe un color `primary` (y config
opcional) y devuelve tokens estructurados + CSS ya armado: paleta oklch
50–950 con gamut real por shade (baked en build time, ver más abajo),
secundario/terciario/cuaternario derivados por armonía, neutral, rueda de
12 hues, dos escalas numéricas (`size-N` tipográfica exponencial, `space-N`
lineal), reset classless, motor de utility classes al estilo Tailwind
(cerrado, sin valores arbitrarios) y un bridge de alias para consumir esos
tokens desde componentes shadcn/ui (variante Base UI).

No es un reemplazo de Tailwind ni mantiene una librería de componentes
propia — ver `README.md` para el pitch de producto.

## Módulos (`src/`)

```
src/
  luz.ts              orquestador: config → tokens → CSS string
  index.ts             entry pública (re-exports: luz, emitUtilitiesCSS, tipos)
  color/index.ts       entry `@d00m-gui/luz/color`: motor OKLCH puro (gamut.ts/hue.ts/wheel.ts) sin luz(), + srgbToOklch/oklchToSrgb/contrastRatio
  tools/
    constants.ts        curvas de shade (WEIGHTS) — datos puros
    reset.css            capa RESET: normalize genérico, no-por-componente
    components.css        manifest de @import de components/*.css (1 archivo por componente, 58 hoy)
    components/*.css      un archivo self-contained por componente (reset+layout+color+estados juntos); theme.css (contenedor scopeado), _print.css (capa @media print)
    reset.ts              buildReset(): RESET + COMPONENTS desde reset-css.generated.ts — solo lo consume css.ts (buildCssSections), no luz()
    gamut.ts              parseColorToOklch/clampToSrgb/formatOklch/srgbToOklch/oklchToSrgb/contrastRatio: color literal → OKLCH numérico, gamut-mapeo real (binary search) contra sRGB, ratio WCAG
    hue.ts                LuzPalette/LuzRamp; luzPaletteSeeds: seed → ramp baked 50–950; luzShades: tokens {name}-N desde el ramp (literal) o live (calc()) si no hay seed; nearestSchemeWeight(ramp, l)
    wheel.ts             luzWheelPalettes: 12 paletas (red…pink), l heredada de primary, seed overrideable
    sizes.ts             luzSizes/luzSpace/luzTypeLandmarks/luzTextScale: space-N, border-radius-N, font-size-h1..h6/small/xs..3xl
    props.ts             luzProperty: infiere @property por token (syntax/initial-value) — opt-in
    shadcn-bridge.ts     shadcnBridgeCSS: alias de tokens shadcn ← tokens luz
    utilities.ts         registry de utility classes + emisión de CSS (puro, sin I/O)
    scan.ts               scanSources: walk de archivos fuente (node:fs) → { candidates, files }
    variants.ts           VARIANTS: prefijos data-*/pseudo-clase → selector; BREAKPOINTS fijos (sm…2xl) → MEDIA_VARIANTS
    css.ts                buildCssSections/composeCss + expandLuzCss: expansión de `@import "@d00m-gui/luz/*.css"` y `@luz <section>;` (puro)
    luz.css, theme.css, bridge.css, utilities.css   entries CSS publicados; contienen las directivas `@luz` que el plugin expande
  astro/index.ts        integración Astro (luzAstro)
  vite/index.ts          plugin Vite (luzVite)
```

`scripts/generate-reset.ts` (`bun run gen:reset`) resuelve `reset.css`/
`components.css` (con sus `@import` de `components/*.css`) y escribe
`src/tools/reset-css.generated.ts` — ver "`reset.ts`" más abajo para el
porqué.

## Flujo de datos

```
LuzConfig
   │
   ▼
luz(config)                         src/luz.ts
   ├─ parseColorToOklch(primary)      seed numérico si primary es un literal parseable (gamut.ts)
   ├─ LuzPalette ×8 + luzWheelPalettes ×12   { name, color (CSS vivo), seed | null }
   ├─ buildScheme(reverse)
   │     ├─ luzPaletteSeeds por paleta con seed → palettes (ramps baked, tokens.palettes.{light,dark})
   │     └─ colors derivados de esos ramps: luzShades (shades), scheme-* (peso: schemeShade | nearestSchemeWeight(ramp) | 500/800; × schemeChroma), anchor-* (×0.6)
   │        sin seed → fórmulas live oklch(from var(--x)) / muted()
   │        (llamado 2 veces + mergeLightDark si mode: "auto")
   ├─ luzSizes()/luzSpace()/luzTextScale()/luzTypeLandmarks()   escalas size-N / space-N / font-size-*
   ├─ themeVariables()                 alias semánticos (btn-bg, kbd-*, ... — casi todos vía scheme-primary)
   └─ luzProperty(tokens)              @property inferidas (opt-in)
        │
        ▼
   { tokens, variables, properties, theme }
        │        theme  = properties + `${selector} { color-scheme?; variables }`
        │        (el reset no sale de luz(): es reset.css/components.css como entries; buildCssSections lo compone para docs/CLI)
        │
        ├─ shadcnBridgeCSS(tokens)     `${selector} { --card: ...; ... }`
        └─ emitUtilitiesCSS(scanSources(root).candidates, tokens)
        │
        ▼
   expandLuzCss(css del usuario)      src/vite/index.ts (transform), src/astro/index.ts lo registra
```

`luz()` es puro (config → resultado, sin I/O). Todo el I/O (scan de
archivos fuente) vive en `tools/scan.ts` y se dispara desde el plugin de
Vite (`vite/index.ts`), nunca en `luz.ts`. Nada se escribe a disco.

### Entrega de CSS: entries + `@luz`

El usuario escribe `@import` en su propio CSS y el plugin expande ahí lo
generado (modelo Tailwind v4). Entries publicados (archivos reales en
`src/tools/`, copiados a `dist/` raíz y en `exports`):

| Import | Contenido |
|---|---|
| `@d00m-gui/luz/luz.css` | todo: `@import "./reset.css"; @import "./components.css"; @luz theme; @luz bridge; @luz utilities;` |
| `@d00m-gui/luz/reset.css` | estático |
| `@d00m-gui/luz/components.css`, `components/<x>.css` | estático, todos o uno por componente |
| `@d00m-gui/luz/theme.css` | `@luz theme;` → `luz(config).theme` |
| `@d00m-gui/luz/bridge.css` | `@luz bridge;` → `shadcnBridgeCSS(tokens)` |
| `@d00m-gui/luz/utilities.css` | `@luz utilities;` → utilities escaneadas |

La composición es por `@import` del usuario (reset + theme + los
componentes que quiera + utilities), no por toggles en `LuzConfig`.
`@luz <section>;` también puede escribirse a mano en cualquier CSS del
proyecto (API de bajo nivel); sin plugin es un at-rule desconocido,
inofensivo.

## Principio de diseño: **la config siempre gana**

Implementado para el core de `luz()` (`variables`/`theme`); todavía no
alcanza al bridge de shadcn ni al motor de utility classes.

**Dos mecanismos, según si hay derivación o no:**

- **Seeds** (`primary`, `secondary`, los 10 wheel hues) — el usuario define
  un color base, luz deriva el resto (rampa `-50…950`) vía
  `oklch(from var(--{name}-seed) ...)`. No son overrides de valor final:
  cambian el _input_ de un cálculo que sigue corriendo.
- **`vars`** (`LuzConfig.vars: Record<string, string | number>`) — override
  de _valor final_, sin derivación posible. Se mergea **al final** de
  `variables` en `luz()`, después de colors + sizes + typography +
  `themeVariables()` — pisa cualquier token existente por nombre
  (`{ "primary-500": "..." }`, `{ "btn-bg": "..." }`) o agrega uno nuevo si
  el nombre no matchea nada generado (`{ "my-radius": "4px" }`). Mismo
  mecanismo para "redefinir cualquier output" y para "custom params que se
  convierten en tokens" — es un solo merge, no dos features separadas.

**Fuera de alcance por ahora** (decisión explícita, no descuido): `vars`
no llega a `shadcnBridgeCSS()` ni a `emitUtilitiesCSS()` — esas dos
siguen sin poder overridearse desde config. Si hace falta más adelante,
cada una necesita su propio punto de merge-al-final, o unificarse en un
merge final en los adaptadores (`astro/index.ts`, `vite/index.ts`) antes
de `composeCss()` — no decidido todavía.

**Decidido: `vars` no valida, y es correcto que no lo haga.** Si el
usuario tipea `"btn-bgg"` en vez de `"btn-bg"`, no hay error — agrega un
token nuevo. Validar contra los nombres conocidos rompería el otro caso de
uso del mismo mecanismo (agregar tokens custom que no existen todavía);
no hay forma de distinguir "typo" de "custom" sin una lista blanca
separada, que no vale la complejidad hoy.

## Escalas fijas: 11 shades por paleta, landmarks tipográficos

- **Colores**: toda paleta tiene exactamente los 11 pesos `50…950`
  (`WEIGHTS` en `constants.ts`). No hay knob para cambiarlo — los ~40
  alias semánticos de `themeVariables()`/`buildScheme()`, los
  `components/*.css` y el bridge de shadcn referencian pesos fijos
  (`-200`, `-500`, `-900`…), así que cualquier otra cantidad rompía el tema
  (`colorSteps` existió y se retiró por eso).
- **Sizes** (`sizes.ts`): `luzTypeLandmarks()` — 7 tokens siempre
  presentes (`font-size-small`, `h6`…`h1`) en rungs consecutivos 0-6 desde
  un anchor de 0.75rem; `luzTextScale()` — `xs`…`3xl` en rungs -2…4 desde
  1rem. Ambos salen del mismo `fluidScale()` (rungs + anchor); `power`/
  `base`/`sizeFluidRange` los afectan. La estructura de los componentes
  (paddings, gaps, radios, alturas) usa `calc(var(--size-unit) * N)`
  (`--size-unit` = `0.1rem`, escalado por `base` si `sizeRelativeToBase`),
  nunca un `size-N`/`space-N` que dependa de `spaceSteps`.
- **Radio** (`luzRadius()` en `sizes.ts`): `radius` (default `1`)
  multiplica la unidad `base / 78` rem o, si es un string, la reemplaza
  por un literal (`"8px"`, `"0"`; una expresión no escalable como
  `calc()`/`var()` queda simbólica: `calc(<literal> * i)` por paso).
  `radiusSteps` (default `8`) define cuántos `--border-radius-N` se
  emiten, lineales como `--space-N`, y `--border-radius` es
  `--border-radius-1` — el token del que derivan los componentes. La
  utility `rounded-N` resuelve contra esa escala, simétrica con
  `p-N`/`gap-N` sobre `space-N`.
- Nada de esto rompe `mode: "auto"`: los tokens siguen siendo
  `var(--{name}-N)` (indirección CSS) o literales por scheme que
  `mergeLightDark()` envuelve en `light-dark()` (solo tokens de color).

## Escala de texto con nombre — `size-N`/`text-N` retirados

`size-N` (22 pasos, `size-1`..`size-22`) generaba `text-N` sin ningún
techo — con el default (`base=16`, `power="perfect-fourth"`,
`sizeDynamicFrom=13`), `text-22` daba un `font-size` de ~276-368px.
Verificado que `size-N` no tenía ningún otro consumidor (`reset.ts` usa
`--size-unit` vía `calc()`, no `size-N` directo, desde el batch anterior)
— solo servía a `text-N`, así que se pudo retirar sin tocar nada
estructural.

**Reemplazo**: `luzTextScale()` (`tools/sizes.ts`) genera 7 niveles
nombrados estilo Tailwind (`font-size-xs`/`sm`/`base`/`lg`/`xl`/`2xl`/
`3xl`), mismo mecanismo que `luzTypeLandmarks()` (rungs fijos alrededor
de un anchor, `clamp()` con `cqi`) pero anclado en `base`=rung 0 en vez
de en `font-size-small`. Rungs `[-2, -1, 0, 1, 2, 3, 4]` — acotados, no
un rango abierto — con `power="perfect-fourth"` da valores reales de
9px a 51px, sin absurdos. La utility class `text-{name}` pasó de
`ScaleNamespace` (resolución numérica genérica) a 7 entradas
`LiteralNamespace` fijas en `utilities.ts` — coherente con el
"vocabulario cerrado" que ya describe el motor de utilities, no una
regresión de flexibilidad real (nadie generaba clases `text-N`
arbitrarias con sentido más allá de ese rango calibrado).

**Campos de `LuzConfig` retirados**: `sizeSteps`, `sizeDynamicFrom` — sin
otro uso. `sizeRelativeToBase` **se mantuvo** (no se retiró) porque
también escala `size-unit` y el propio `luzTypeLandmarks()` — retirarlo
hubiera cambiado el comportamiento de los headings `h1`-`h6`, fuera de
alcance de este cambio.

Investigado antes de implementar: [moderncss.dev — fluid typography con
container query units](https://moderncss.dev/container-query-units-and-fluid-typography/)
(Mixin 3, ratio de escala tipográfica). Conclusión: el mecanismo de luz
(`clamp()` + `cqi`, spread min→max como proporción constante vía
`ratio^range`) ya es conceptualmente equivalente — no hacía falta
adoptar una fórmula distinta. La causa real del techo era tener 22 pasos
exponenciales sin límite (mismo patrón que tenían `h1`-`h6` antes de
recalibrarse), no la fórmula del fluid range en sí. El propio Mixin 3
del artículo solo define 4 niveles compuestos, no una escala numérica
abierta — reforzó la decisión de ir a niveles nombrados y acotados en
vez de bajar el default de `sizeSteps` nada más.

**Pasos hacia abajo con √ratio, font-size independiente de `density`**:
`rungSize()` (`tools/sizes.ts`) aplica `ratio ** n` para `n ≥ 0` y
`√ratio ** n` para `n < 0` — con `perfect-fourth`, `sm` = 0.866rem y
`xs` = 0.75rem (antes 0.75/0.563rem, ilegibles). Los `font-size-*` ya no
se multiplican por `--density`: el contrato documentado de `density` es
padding/chrome de controles, no tipografía (con `density: 0.9`, `xs`
bajaba a ~9px).

## Tipografía fluida como opt-in — clase `.fluid`

Hallazgo posterior al cambio anterior: `font-size-h1..h6`/`small`/
`xs..3xl` eran **siempre** `clamp()` con `cqi`, incluso con
`sizeFluidRange: "fixed"` (default) — colapsaban a `clamp(X, X + 0cqi,
X)`, matemáticamente correcto pero (a) generaba CSS inerte para el caso
más común (sin fluidez) y (b) mezclaba dos decisiones independientes:
"cuánto crece cada paso entre sí" (`power`, sin relación con fluidez) y
"cuánto crece un paso individual con el viewport" (`sizeFluidRange`) —
confundibles al leer el output.

**Solución — dos capas**:

- `luzTypeLandmarks()`/`luzTextScale()` (`tools/sizes.ts`) ahora emiten
  **dos** tokens por nivel: `font-size-{name}` (`rem` plano, el valor
  nominal — lo que usa `<h1>`-`<h6>` en `structure.css` por default, sin
  cambios ahí) y `font-size-{name}-fluid` (el `clamp()`/`cqi` de antes).
- Clase nueva `.fluid` (`structure.css`, gateada
  `@supports (font-size: 1cqi)`): setea `container-type: inline-size` en
  sí misma y, para sus descendientes `:is(h1, .h1)`.. `:is(h6, .h6)` +
  `.text-xs`..`.text-3xl`, pisa `font-size` con la variante `-fluid`.
  Mismo patrón que el Mixin 3 de moderncss.dev (`:is(h1, .h1, ...)`
  gateado), adaptado al vocabulario de luz.
- `sizeFluidRange`/`preset` sin cambios de superficie — siguen
  controlando la magnitud de la variante `-fluid`, pero ahora solo
  importan si `.fluid` está presente en algún ancestro.
- **Nuevo `preset: "content"`** → `sizeFluidRange: "balanced"` (1) — punto
  medio entre `"app"` (`"fixed"`, 0, sin reflow) y `"landing"` (2.4,
  reflow grande). Pensado para sitios de contenido/documentación (como
  `docs/` mismo), que quieren algo de reflow sin llegar a "dramatic".

`docs/theme.config.ts` usa `preset: "content"` + `.fluid` en la sección de
Typography — primer uso real de la capa fluida en el sitio, verificado
con `astro build` real y captura en Chrome (headings se ven igual a
como se veían antes del cambio, sin regresión visual).

## Armonía de la rueda de colores — `l` heredada de `primary`

Comportamiento histórico restaurado (default, sin flag en `LuzConfig`) —
da nombre a la librería. Los 12 hues de `luzWheelPalettes` (`tools/wheel.ts`) ya
no tienen una `l` fija por hue — su seed pasa de
`oklch(${l}% ${c} ${hue})` a `oklch(from ${primaryCSSVar} l ${c} ${hue})`:
heredan la luminosidad de `primary` en vivo (CSS relative color syntax,
sin JS, reactivo a `mode: "auto"` igual que `secondary`), pero mantienen
su propio `c`/`hue` ya calibrados — no se aplanan a la saturación de
`primary`.

**Por qué no hace falta escalar el chroma a mano:** cada hue conservaba
antes una `l` propia (`yellow: l=83`, `blue: l=58`, …) porque el chroma
máximo desplegable en OKLCH depende de la combinación hue+lightness — no
es un cubo. Al forzar una `l` distinta (la de `primary`), el `c` pedido
puede quedar fuera de gamut. CSS Color 4 exige gamut mapping automático
(reduce `C`, mantiene `L`/`H` fijos, diseñado por el mismo autor de
OKLCH) — el navegador ya hace la reducción perceptualmente correcta sin
ninguna fórmula propia. Heredar también el `c` de `primary` (en vez de
dejarlo literal) sería el error: aplanaría los 12 hues a la misma
magnitud de saturación absoluta, perdiendo el calibrado individual.
Verificado visualmente con `primary` en `l` muy oscura/media/muy clara —
los 12 hues siguen diferenciándose entre sí, sin romperse.

`wheelOverrides` (ya existente) sigue pisando por completo cualquier hue
individual — un override explícito ignora `primary` para ese hue.

## Gamut real por shade — baked en build time (`src/tools/gamut.ts`)

Cada shade históricamente salía con chroma constante vía relative color
syntax (`oklch(from var(--x-500) l+off c h)`) — para hues saturados, los
shades extremos (50/100/900/950...) caen fuera de sRGB, y el browser los
gamut-mapea según el gamut real del display (P3 vs. sRGB), así que el
mismo `luz()` se ve distinto según el monitor.

`src/tools/gamut.ts` resuelve esto en generación, no en el browser:
parsea el color literal de un seed (`primary`, o un override de
secondary/tertiary/quaternary/hue de la rueda) a OKLCH numérico —
hex/`rgb()`/`hsl()`/`oklch()`/`oklab()`, sin dependencia nueva — y por
cada shade calcula el chroma máximo que entra en sRGB (binary search
sobre la conversión real oklch→XYZ→linear-sRGB), sin superar nunca el
chroma del seed. El resultado es un literal `oklch(L C H)` por shade,
no una fórmula `calc()`. `luzHarmonyColorSeeds` (hue.ts) deriva
secondary/tertiary/quaternary de `primary` de la misma forma pero en
números, no en CSS, para poder bakear también esos.

Si el seed no es un literal parseable (nombre de color CSS, `var()`,
`color-mix()`, cualquier cosa que no matchee los formatos soportados),
esa paleta cae íntegra al pipeline `calc()` anterior — sin mezclar
ambos caminos por shade, todo o nada por paleta.

`ThemeToolbar` (`docs/`) bakea igual que el output real — llama a
`luz({ ...config, selector: ":root" }).theme` completo client-side en un
`useMemo` y renderiza ese string tal cual (no parchea custom properties a
mano ni envuelve `variables` en un selector, así el `@media
(prefers-color-scheme: dark)` de los escalares por esquema llega al
preview), así que cualquier cambio de `primary` desde el picker vuelve a
correr el parseo + binary search con el literal nuevo.
La única vía sin baking, ahí y en cualquier build, es un `primary` no
parseable (nombre de color, `var()`, etc.) — cae al `calc()` vivo.

### `scheme-*`/`anchor-*` — derivados del mismo ramp baked

`buildScheme(reverse)` (`luz.ts`) es la única fuente de verdad del color
por scheme: bakea una vez el ramp `50…950` de cada paleta con seed
conocido (`luzPaletteSeeds`, expuesto como `tokens.palettes`) y deriva
**todo** `colors` de esos ramps — shades (`luzShades`), `scheme-*`,
`anchor-*`. Sin seed parseable, cada pieza cae a su fórmula live
(`oklch(from var(--x) …)`, `muted()`).

`scheme-primary`/`-secondary`/`-tertiary`/`-quaternary`/`-neutral` (el
peso que consumen `.badge`/`.btn`/`.alert`) y `scheme-info`/`-danger`/
`-success`/`-warning`: `LuzConfig.schemeShade` fuerza un peso exacto;
`schemeLightness` (target de `l` OKLCH) elige con `nearestSchemeWeight(ramp,
l)` el shade real más cercano a esa luminosidad — armónico entre hues
aunque cada uno tenga distinto chroma disponible; default `500` (`800`
para `neutral`). `schemeChroma` (default `1`) escala el chroma del shade
elegido (bajar chroma nunca saca de gamut). `anchor-*` es la misma
operación (`shade(ramp, peso, factor, live)`) con peso `200` (`500` para
`anchor-secondary/-tertiary/-quaternary`) y factor `0.6`.
`scheme-info`/`-danger`/`-success` salen de los ramps `blue`/`red`/`green`
de la rueda (respetan un override de ese hue); `scheme-warning` de un ramp
propio a hue 92 (el slot `yellow`, h=115, lee verdoso). Viven dentro de
`buildScheme()` porque dependen de `reverse` — `mergeLightDark()` los
envuelve en `light-dark()` para `mode: "auto"`.

`badge-bg`/`checkbox-checked-bg`/`switch-bg`/
`radio-checked-bg`/`progress-fill`/`tab-border-active`/`hr-color`/
`selection-bg`/`range-track-shadow`/`range-thumb-active-bg` — la
variante _default_ (sin clase) de estos tokens pasó de apuntar a
`var(--{name}-500)` fijo a `var(--scheme-primary)`. Antes
`schemeShade`/`schemeLightness`/`schemeChroma` solo afectaban a las
variantes con clase (`.secondary`, `.success`, …, vía `--scheme` en
`button.css`/`_feedback.css`) — el badge default los ignoraba por
completo. Ahora un solo mecanismo gobierna los dos casos.

`btn-bg` es la excepción: su default (sin clase) apunta a
`--scheme-neutral`, no a `--scheme-primary` — un `<button>` sin variante
es neutral, `.primary`/`[role="primary"]` (vía `--scheme` en
`_feedback.css`) es opt-in explícito. Decisión de diseño: la mayoría de
los botones en una app conviven en la misma pantalla y no deberían
competir por atención; forzar `primary` como default hace que cada
pantalla necesite apagar el ruido a mano (`.neutral` en el 90% de los
botones). El costo de marcar el único CTA que sí necesita destacar es
el mismo en ambos esquemas.

Nuevos tokens `scheme-success`/`-danger`/`-warning`/`-info` (mismo
`chromaScaledEntry`, peso `200`) — hacían falta porque `_feedback.css`
(`.success`/`.danger`/`.warning`/`.info`, consumidas por
`.badge`/`.alert`/`.card`) y los roles de `.btn`
(`[role=secondary/tertiary/quaternary/apply]` en `button.css`) seguían
apuntando a los tokens semánticos/paleta crudos (`--success`,
`--secondary`, `--tertiary`, …) en vez de a `--scheme-*` — ninguno de
los dos tomaba `schemeChroma`/`schemeShade`/`schemeLightness` (reporte
del usuario). Ahora todos los caminos hacia `--scheme` (`_feedback.css`,
`button.css`, el default sin clase) pasan por `scheme-*`.

## `LuzConfig.preset` — app vs. landing

Un solo campo (`"app" | "landing"`) que empaqueta `sizeFluidRange` en una
decisión en vez de tunear el knob directo — pensado para la idea de que
luz sirva tanto para una web app estable como para una landing de alto
impacto sin reconfigurar todo a mano.

- `"app"` (default implícito): `sizeFluidRange: "fixed"` — headings sin
  reactividad de viewport. h1 = 4.21rem (67.3px) fijo.
- `"landing"`: `sizeFluidRange: 2.4` — más pronunciado que el `"dramatic"`
  nombrado (1.6, sigue significando lo mismo si se pasa explícito) porque
  los landmarks de heading necesitan más recorrido que la zona fluida
  general de `size-N`. h1 va de 4.21rem a 8.39rem según viewport/container.
- Un `sizeFluidRange` explícito en la config **siempre** gana sobre lo que
  implique `preset` — se resuelve antes del destructure en `luz()`, mismo
  principio que `vars`.
- **Resuelto, escopeado por componente (no global).** `container-type:
inline-size` en un ancestro amplio (`body`) quedó descartado — convierte
  a ese elemento en _containing block_ de sus descendientes, rompiendo
  `position: fixed` de cualquier consumidor (header fijo, botón "volver
  arriba", etc.) en todo el sitio. En cambio, `.card` y `dialog.modal`
  (`tools/components.css`) llevan `container-type: inline-size` cada uno — son
  los únicos dos componentes de la capa curada donde el contenido se
  reusa a anchos variables y se beneficia de tipografía realmente
  reactiva al contenedor, y ninguno de los dos es un lugar razonable para
  anidar un `position: fixed` que dependa del viewport. El resto de la
  capa curada (badge, avatar, alert, tabs, accordion, breadcrumbs,
  skeleton) no lo lleva — no hay beneficio de tipografía fluida ahí. Fuera
  de esos dos, `cqi` sigue cayendo al fallback de viewport, sin riesgo.
- Nunca toca `--size-unit` — la sizing estructural (botones, inputs, kbd)
  queda estable bajo cualquier preset; solo los 7 `font-size-*` landmarks
  reaccionan.
- Solo mueve `sizeFluidRange` por ahora, no `power` — decisión explícita
  del usuario para no acoplar el preset a la escala pública `size-N`/
  utilities (`power` sigue siendo un knob independiente).

## Capa de componentes curados (`components/*.css`)

Recetas CSS puras estilo daisyUI, generadas desde tokens de luz (no
fijas como un tema) — 56 archivos hoy bajo `src/tools/components/`, cada
uno self-contained (reset+layout+color+hover/focus/active del
componente juntos), importados en orden por el manifest `components.css`
(el orden importa: `_feedback.css` va último para ganarle
especificidad a `.btn`/`.badge`/`.alert`/`.notice`, ver más abajo).
Incluye tanto piezas con interactividad nativa (`.accordion` vía
`<details>`/`<summary>`, `dialog.modal` vía `<dialog>` con
`@starting-style`+`transition-behavior: allow-discrete`) como
visual-only a propósito (`.tabs`, `.alert` — mostrar/ocultar contenido
real necesita JS, mismo límite que documenta daisyUI para los suyos).

Sizing interno siempre vía `calc(var(--size-unit) * N)` (nunca
`--size-N` directo — ver "Convenciones de tokens"), `--space-N` solo
para tamaño de layout (ej. `--avatar`), no anatomía interna de
componente chico.

## Variantes de componente vía clase modificadora, no componente nuevo

Cuando dos "componentes" son el mismo patrón visual/estructural con un
detalle distinto, se consolidan en un solo archivo/selector base +
modificador, en vez de vivir como CSS separados. Aplicado:

- `.tabs` (`tabs.css`) es la base — `input[hidden] + .tab`/`a.tab` con
  `:checked`/`[aria-current="page"]` como estado activo. Absorbe lo que
  antes eran `segmented.css`, `toggle.css`, `pagination.css` y
  `tabbar-bottom.css`: `.tabs.segmented` (radio, track con bg),
  `.tabs.toggle` (checkbox, caja con divisores), `.tabs.pagination`
  (links, ítems con borde), `.tabs.bottom` (links, barra fija inferior).
- `.panel-header` (`panel-header.css`) es la base — flex row con gap.
  Absorbe `titlebar.css`/`statusbar.css`: `.panel-header.top` (borde
  inferior, el header) y `.panel-header.bottom` (borde superior,
  `font-size-small`, el statusbar).

`_depth.css` (elevación por anidamiento) referencia estas clases por
nombre en su lista `:where(...)` — actualizar ahí también si se agregan/
renombran variantes.

## `.join` — agrupar/fusionar elementos (`join.css`)

Fusiona los hijos directos de `.join` en un solo bloque visual (fila u
horizontal por default, `.join.vertical` para columna), sin agregar
clases a los hijos — mismo criterio que `.tabs`. Colapsa bordes/radios
entre elementos adyacentes (`margin-inline-start`/`margin-block-start`
negativo del ancho del borde, radios solo en los extremos vía
`border-start-start-radius`/etc. lógicas), sube `z-index` en
`:hover`/`:focus`/`:focus-within` para que el foco/hover gane sobre el
vecino. Soporta tipos mixtos (`[icon][input][button]`) porque el
selector genérico (`.join > *`) da a cualquier hijo un borde/fondo/
padding base — los componentes con su propio fondo (`.btn`/`.badge`)
lo pisan por especificidad. El borde lee `--scheme` primero
(`var(--scheme, var(--element-border-color))`), así una clase de
`_feedback.css` en el propio `.join` (`.join.danger`, etc.) tiñe el
grupo entero.

## `.card` — `.card-content`/`.card-meta`/`.card-formula`

`.card` deja de asumir un único bloque de contenido: `.card-content`/
`.card-meta`/`.card-footer` son wrappers con su propio padding
(`.card-meta`/`.card-footer` comparten el fondo/color del scheme de la
card). `.card-formula` (flex column) fija `.card-meta`/`.card-footer`
y deja `.card-content` como el único bloque flexible — pensado para
grillas de tiles uniformes (usado en la grilla de componentes de
`docs/`).

## `.grid` — una sola regla auto-fit; `.grid.overflow` = carousel sin JS

Se retiran las utilities `.grid-cols-N`/`.col-span-N` (sin uso real
fuera de `docs/`) — `.grid` pasa a `repeat(auto-fit, minmax(min(25rem,
100%), 1fr))` fijo, vía `--grid-col-size-min` overrideable por
instancia. `.grid.overflow` fluye en una sola fila (`grid-auto-flow:
column`, mismo `--grid-col-size-min`) con `overflow-x: auto` +
`scroll-snap-type: x mandatory`; donde el navegador lo soporta agrega
`::scroll-button(inline-start/inline-end)` anclados al grid
(`anchor-name`/`anchor-scope: --grid-overflow`) y `::scroll-marker` por
ítem (`:target-current` en `--scheme-primary`) — sin soporte queda el
scroller con scrollbar fina.

## `.element` — helper de diagramación, responsive sin media queries

`tools/components/element.css`: primitivo de layout genérico (flex/grid) para
componer diagramas — no un componente visual con estilo propio, solo
estructura. Base `.element` (`display: inline-grid`) + modificadores:
`.row`/`.column` (flex), `.auto`/`.fixed` (`flex-grow`/`flex-shrink`),
`.pair` (grid de 2 columnas responsive).

**`.pair` no usa `@container`/`@media`** — evaluado y descartado: una
condición de `@container`/`@media` no puede leer un `var()`, así que un
breakpoint "configurable" ahí necesitaría hardcodear el valor en el CSS
estático o depender de un compilador del lado del consumidor
(`postcss-custom-media`/`lightningcss`) para `@custom-media` — por eso
no hay breakpoints configurables en `LuzConfig`; los de las variantes
`md:` de utilities son fijos (`variants.ts`). En cambio,
`grid-template-columns: repeat(auto-fit, minmax(min(var(--element-pair-min,
var(--element-width)), 100%), 1fr))`: con exactamente 2 hijos, `auto-fit`
da 1 columna (ancho completo) mientras no entre un segundo
`--element-width`, y pasa a 2 columnas balanceadas apenas entra — el
"breakpoint" es una consecuencia del layout intrínseco, no una condición
explícita, y queda 100% reactivo a `base`/`--element-width` sin
compilador extra.

Knobs vía custom property, no campos de `LuzConfig` (mismo criterio que
`--grid-col-size-min` en `.grid`):

- `--element-gap` (fallback `--space-3`) — gap del grid/flex.
- `--element-pair-min` (fallback `--element-width`) — ancho mínimo por
  columna que dispara el paso a 2 columnas.
- `--ratio` (fallback `auto`) — aplicado a los hijos
  directos de `.pair`.

## `_feedback.css` — esquema × tratamiento, 2 ejes combinables

`tools/components/_feedback.css` (último `@import` de `components.css`, después
de todos los componentes — así sus clases ganan el empate de
especificidad contra los estilos base de `.btn`/`.badge`/`.alert`). Dos
ejes de clases combinables en el HTML:

- **Esquema** (`.success`/`.danger`/`.warning`/`.info`/`.primary`/
  `.secondary`/`.tertiary`/`.quaternary`/`.neutral`/`.contrast`): fija
  solo `--scheme` a los tokens de `buildColors()` (`--scheme-primary`/
  `--scheme-danger`/etc.). Aparte, en un `:where(...)` compartido de
  especificidad cero, esos mismos selectores fijan `color: var(--scheme)`
  para el look "solo color" (ej. texto de un link) — sin pisar el
  `--current-color` que calcula un componente cuando el esquema se
  combina con un tratamiento.
- **Tratamiento** (`.solid`/`.soft`/`.outline`): lee `--scheme` (fallback
  `--scheme-primary`) y define fondo/borde/texto — combinable con
  cualquier componente (`<span class="badge solid danger">`, `<div
class="stat outline success">`, ver `components/stat.md`).

Cada componente que pinta con `--scheme` fija su propio `--current-bg`
(`.card`/`.btn`/`.stat`/`.radial-trigger`: sólido, `var(--scheme,
<fallback propio>)`; `.badge`: 26% de opacidad sobre `--scheme`;
`.alert`: 12% mezclado con `--background`). `--current-color` (contraste
legible sobre ese fondo) **no se repite por componente ni tiene lista de
selectores que mantener** — `_contrast.css` la calcula de forma universal
(`* { --current-color: var(--on-scheme, oklch(from var(--current-bg)
clamp(...) calc(c * 0.08) h)) }`, misma fórmula que `luzOnColor()` en
`hue.ts`): cualquier elemento que fije `--current-bg` localmente la
recibe gratis, sin sumarse a ninguna whitelist. `--on-scheme` sigue
siendo el hook opcional del consumidor (`.btn.danger { --on-scheme: ... }`),
gana por ir primero en el `var(...)`.

`--current-bg`/`--current-color`/`--scheme`/`--on-scheme`/
`--element-background` son API pública documentada (`docs/` →
features/color): reescribir `--current-bg` en un scope viste una
superficie de marca sin declarar ningún color de texto, y fijar
`--scheme` en un contenedor tiñe los componentes que haya adentro sin
conocerlos.

Los estados interactivos salen de tres tokens con knob
(`stateHoverDelta`/`statePressedDelta`/`statePressedShift` en
`LuzConfig`): `button.css` usa
`oklch(from var(--current-bg) calc(l + var(--state-hover-delta, 0.02)) c h)`
en `:hover`, `calc(l - var(--state-pressed-delta, 0.02))` y
`translateY(var(--state-pressed-shift, 0.1ch))` en `:active`. El fallback
literal en el CSS es el default, así que los componentes siguen andando
contra un tema sin esos tokens, y un subárbol puede redeclararlos.

`badge.css`/`join.css` tienen su propia fórmula de texto (badge: tono de
`--current-bg` aclarado +0.25 `l`, coherente con su fondo semi-opaco;
join: mismo color que su borde, `var(--scheme, var(--element-border-color))`)
en vez de `--current-color` — no pintan un fondo sólido, así que el
contraste "on-scheme" no aplica ahí.

`on-btn`/`on-badge`/`on-kbd`/`on-selection` siguen existiendo como tokens
globales en `luz.ts` (`luzOnColor()`, con fallback `--on-scheme`) — no son
redundantes con `--current-color`: los consume código que quiere "pintar
como btn/badge por defecto" sin ser descendiente de un `.btn`/`.badge`
real (`segmented`/`toggle`/`pagination` en `tabs.css`, `wizard.css`), así
que no hay `--current-bg` que heredar y necesitan su propio token
precalculado, fijo al fondo default (no reactivo a `--scheme`).

**Bug corregido**: los tokens de esquema no pueden llamarse `primary`/
`secondary`/`neutral` a secas — `buildColors()` ya emite variables con
esos nombres por default (`--primary`/`--secondary`/`--neutral` = color
semilla crudo), y como `--primary-500` etc. se calculan a partir de esas,
un choque de nombres crea una referencia circular (ambas quedan inválidas
en el browser). Por eso el alias fijo usa el prefijo `scheme-`.

## `_depth.css` — elevación por anidamiento, escalares registrados

`--element-background` es el fondo de superficie por nivel: `:root` lo
fija en `var(--background)` y la lista `:where(.card, .elevate, .popover,
…)` lo recalcula por nivel (1–4, cada uno con su exponente literal) como
`oklch(from var(--background) clamp(0, calc(l + var(--depth-sign) *
var(--depth-max) * (1 - pow(var(--depth-decay), N))), 1) c h)`. `.card`/
`.stat` lo usan como fallback de `--current-bg`.

`--depth-sign`/`--depth-max`/`--depth-decay` se declaran con
`@property { syntax: "<number>" }` en el propio `_depth.css`: entran a un
`calc()` dentro de una función de color, donde un valor no numérico deja
toda la cadena invalid-at-computed-value-time — `--element-background`
computaba `rgba(0, 0, 0, 0)` dentro de cualquier `.card` y `--current-bg`
heredaba el vacío. Registradas, un valor no numérico cae al
`initial-value` en vez de envenenar el color; los valores válidos de
`LuzConfig` siguen ganando.

La causa concreta era el emisor: `mergeLightDark()` envolvía en
`light-dark()` cualquier token que difiriera entre esquemas, y
`light-dark()` solo es `<color>`. Hoy `buildScheme()` devuelve los
escalares dependientes de esquema aparte de `colors` (`scalars`,
`--depth-sign`), `mergeLightDark()` toca solo colores, y esos escalares
salen con el valor claro en el bloque de tema más un
`@media (prefers-color-scheme: dark)` en `LuzResult.theme` — saltando
las claves que `config.vars` fija, para que el override siga ganando.

## `surface-*` — tercer eje, fondo muteado por hue

`secondary`/`tertiary`/`quaternary` generan además una escala
`surface-{secondary,tertiary,quaternary}-*` (`luz.ts`, junto a `neutral`):
misma curva de lightness/contraste que `neutral`, pero tinteada con el
hue de ese accent en vez del de `primary`. Intensidad propia,
`surfaceTint` (default `0.4`), independiente de `neutralTint` — no
comparten knob porque `neutral` alimenta `background`/`foreground`
globales y necesita poder ir a `0` (gris puro) sin apagar `surface-*`.

Se consume como tercer eje de clase combinable en `_feedback.css`,
mismo nivel que `.solid`/`.soft`/`.outline`: `.surface-primary`/
`.surface-secondary`/`.surface-tertiary`/`.surface-quaternary` fijan
`--current-bg` al shade `-900` de esa escala (`.surface-primary` usa
`--neutral-900` directo — `primary` ya tiene su "surface" en `neutral`,
no se generó una escala aparte) y pintan `background-color`/`color`
usando el mismo `--current-color` universal de `_contrast.css`. No
depende de `--scheme` ni lo pisa — es ortogonal a esquema×tratamiento,
pensado para fondos de contenedor (`card`/`stat`) que necesitan verse
"de marca" sin la saturación plena de `scheme-*`.

## `.css` estáticos reales en `dist/`, `@import` directo

`reset.css`/`components.css` (100% estáticos, no dependen de config) se
copian a `dist/` en cada build (plugin `copy()` de `bunup.config.ts`,
lista `staticCss`), junto con `src/tools/components/` → `dist/components/` (los
`@import "./components/*.css"` del manifest tienen que resolver en el
paquete publicado), y se publican en `exports` de `package.json`
(`"./reset.css": "./dist/reset.css"`, etc., vía el plugin `exports()`
con `customExports`) — un consumidor puede hacer `@import
"@d00m-gui/luz/reset.css";` directo en su propia hoja de estilos, sin
pasar por los adaptadores de Astro/Vite. El plugin `exports()` solo
reescribe `package.json` cuando el mapa cambia (y al hacerlo reordena
las claves — si pasa, restaurar el orden a mano).

Los entries generados (`luz.css`, `theme.css`, `bridge.css`,
`utilities.css`) viajan por la misma lista `staticCss`: son archivos
reales con directivas `@luz`, así resuelven aun sin plugin.

## Superficie pública sin adaptador — `reset`/`theme`, `selector`, `palettes`, `/color`

Motivado por un consumidor server-side (Bun, sin Astro/Vite) que genera
CSS por tenant en caliente y necesita N temas en una misma página.

- **`LuzResult.theme`**: lo que depende de la config (`properties` + el
  bloque `${selector} { … }`, más un `@media (prefers-color-scheme: dark)`
  con los escalares dependientes de esquema cuando `mode: "auto"`).
  `LuzResult.variables` es la lista plana de declaraciones y por eso
  lleva el valor claro de esos escalares — un consumidor en `auto` tiene
  que emitir `theme`, no envolver `variables` en un selector propio.
  El reset (`reset.css` + `components.css`, ~60 KB, idéntico para
  cualquier config) **no** sale de `luz()` — llega
  por los entries CSS, así el bundle JS del consumidor no lo arrastra;
  `buildCssSections()` (`css.ts`, solo en los adaptadores/docs) lo compone
  con `buildReset()` cuando hace falta el archivo completo.
  `emitUtilitiesCSS(candidates, tokens)` se exporta desde `.` — puro;
  `scanSources` (la versión con `node:fs`) vive en `scan.ts`,
  no en `utilities.ts`, para que el entry raíz no arrastre `node:fs`
  (verificado sobre los chunks de `dist/`).
- **`LuzConfig.selector`** (default `":root"`): selector del bloque de
  tema. `color-scheme` (`light dark` en `auto`, `light`/`dark` fijo en
  los otros modos) va dentro del mismo bloque, así `light-dark()` y los
  controles nativos resuelven contra el contenedor.
  `shadcnBridgeCSS` lee `tokens.settings.selector` y emite bajo el
  mismo selector. La clase `.theme` (`components/theme.css`) aplica al
  contenedor lo que `body` recibe del reset (`font-family`,
  `font-weight`, `font-size`, `background-color`, `color`) — es la
  pareja de `selector` para temas scopeados. Forzar claro/oscuro por
  sección es `color-scheme: light|dark` inline o por clase, no un campo
  nuevo.
- **`LuzTokens.palettes`**: `{ light?, dark? }` → `Record<nombre,
  LuzRamp>` (`LuzRamp = Record<weight, OklchSeed>`), mismos nombres que
  `colors`; solo paletas cuyo seed parsea (primary/secondary/tertiary/
  quaternary/neutral/surface-*/12 hues de la rueda). En `mode: "auto"`
  vienen las dos; en `light`/`dark` solo la activa. Son los mismos ramps
  de los que `buildScheme()` deriva `colors` — el `{l,c,h}` coincide con
  el literal `oklch()` emitido, por construcción.
- **`@d00m-gui/luz/color`** (`src/color/index.ts`, entry propio en
  `bunup.config.ts`): `parseColorToOklch`/`formatOklch`/`clampToSrgb`/
  `maxSrgbChroma`/`isInSrgbGamut`/`OklchSeed` (gamut.ts),
  `resolveBakedShade(seed, weight, reverse)`/`luzPaletteSeeds(seed,
  reverse)`/`nearestSchemeWeight(ramp, l)`/`luzHarmonyColorSeeds`/
  `ColorHarmony`/`LuzPalette`/`LuzRamp` (hue.ts), `luzWheelHueSeed`/
  `luzWheelPalettes`/`WHEEL_HUE_NAMES`/`WHEEL_CHROMA` (wheel.ts) y
  `WEIGHTS`; y la conversión/medición: `srgbToOklch([r, g, b])` (canales
  0–255) → `OklchSeed`, `oklchToSrgb(seed)` → tupla 0–255 con el chroma
  ya mapeado al gamut sRGB, `contrastRatio(a, b)` → ratio WCAG 2.1. Es TS
  puro sin dependencias; permite que un preview en cliente coincida
  numéricamente con el CSS que `luz()` emite. Congela esas firmas como
  API pública — el replanteo pendiente de
  `resolveBakedShade` (anclaje en 500, ver `TODO.md`) pasa a ser un
  cambio de comportamiento público, no interno.
- **`components/_print.css`** (último `@import` del manifest): `@media
print` genérico — `color-scheme: light !important` en `:root`/`.theme`
  (`!important` porque el bloque de tema, más tarde en cascada, declara
  `light dark`; solo aplica a `mode: "auto"`, un `mode: "dark"` fijo son
  literales y no se puede dar vuelta), oculta overlays/top-layer
  (`.drawer[popover]`, `.drawer-trigger`, `.menu`, `.popover`, `.notice`,
  `.radial-*`, tooltip/spinner `::before`), `print-color-adjust: exact`
  en componentes cuyo significado es el color (`.badge`/`.alert`/`.card`/
  `.btn`/`kbd`/`.stat`/…), quita `backdrop-filter`/`filter` de
  `.glass`/`.background-*`, abre `<details>` cerrados (`> :not(summary)`
  para Firefox, `::details-content { content-visibility: visible }` para
  Chromium), `overflow: visible` en `.shell*`/`.scroll-y`,
  `break-inside: avoid` en bloques. Verificado con
  `page.emulateMediaType("print")` en Chromium real.

## Accesibilidad en `DESIGN`/`RESET` (reglas de Emil Kowalski aplicadas)

Investigado y aplicado desde el skill de design-engineering de Emil
Kowalski: `prefers-reduced-motion` (movimiento, no todo — spinner de
loading y transiciones de color quedan intactas, solo se apaga la
duración de lo que mueve/escala: botones, checkbox/radio, tooltip, más
`scroll-behavior`), `@media (hover: hover) and (pointer: fine)` gateando
cada `:hover` con feedback visual (evita el hover fantasma en tap táctil),
y `transition-property` explícito en vez de heredar "all" del token
`--transition` (primer anti-patrón de su checklist). De paso, encontrado y
corregido: el tooltip tenía `transition` en el selector host, no en su
`::before` — no animaba nada.

Pendiente, no evaluado en este skill (dominio de la de Awwwards, no el de
luz): GSAP/Three.js. Anotado para el `SKILL.md` de luz — luz no los
implementa, pero un agente usando luz debería saber que existen y se
pueden usar encima para sitios/apps con mejor experiencia.

**Idea de roadmap, no implementada**: un MCP para luz — expondría la
generación de tokens como tools invocables, pensado como base para un
generador interactivo de design systems más adelante. Proyecto separado
("luz-studio"), planificación propia en su directorio — no vive adentro
del paquete luz ni de este repo.

## `reset.ts` — función, 2 capas, un archivo CSS por componente

`export const reset = string` pasó a ser `export function buildReset():
string`. El reset vive como archivos `.css` reales en `src/tools/` — son
100% CSS estático (sin interpolación `${...}`, toda su dinámica pasa por
`var(--...)`), así que editarlos como `.css` de verdad (syntax
highlighting/lint reales) tiene sentido y no cuesta nada en runtime.

Dos capas: `reset.css` (genérico, no-por-componente — `*`,
`html`/`body`, `img`/`picture`/`video`/`canvas`/`svg`, `br`, `figure`,
`#root`/`#__next`, `[hidden]`) y `components.css`, que es un manifest corto
de `@import "./components/nombre.css";` — un archivo **self-contained** por
componente bajo `src/tools/components/` (56 archivos hoy: layout+color+
hover/focus/active de ese componente juntos, no repartidos entre capas
globales). Selectores genuinamente compartidos entre componentes
(`:focus-visible`
de `a`/`button`/`.btn`/`input[range]`, el estado `[disabled]` de
`input`/`optgroup`/`select`/`textarea`/`label`/`button`) viven en
`_focus.css`/`_disabled.css`, prefijados con `_` para distinguirlos de un
componente real.

**Cómo llegan a `reset.ts` — nada de imports "mágicos" de `.css`.**
`bunup` (build del paquete publicado) y Vite (`docs/` importa el código
fuente de luz directo, `../src/astro/index.ts`, no el paquete) no se ponen
de acuerdo en cómo importar un `.css` como texto: `bunup` no resuelve
`?raw` (la convención de Vite, falla el build), Vite ignora `with { type:
"text" }` (la convención de Bun) — en dev da `undefined` en silencio, en
`astro build` de producción tira `MISSING_EXPORT: "default" is not
exported by reset.css` (verificado con un `astro build` real, no
supuesto). Ninguna sintaxis de import sirve para los dos.

Solución: `scripts/generate-reset.ts` lee `reset.css`/`components.css`,
resuelve los `@import` locales de `components.css` de forma recursiva, y
escribe `src/tools/reset-css.generated.ts` (comiteado, no gitignored) con
`RESET`/`COMPONENTS` como constantes de string planas — un módulo `.ts`
normal, sin nada especial que ningún bundler necesite entender.
`reset.ts` importa de ahí. **Hay que correr `bun run gen:reset` después de
tocar `reset.css`, `components.css`, o cualquier archivo bajo
`src/tools/components/`** — no es automático todavía (no hay watcher/hook,
ver `CLAUDE.md`).

**Por qué no `readFileSync` en runtime** (alternativa descartada): rompería
`luz()` en cualquier entorno sin `node:fs` — un browser, un edge runtime —
cuando hoy es JS puro sin I/O. El generado evita ese costo por completo.

- Verificado con un `bunup` real (no solo `bun -e`) **y** un `astro build`
  real de `docs/` — antes de esto se verificó "andaba" con un test aislado
  que no reflejaba el bundler real de la librería; la lección quedó
  anotada en `CLAUDE.md`: correr los builds reales antes de dar por buena
  una feature de build, no solo `bun run type-check`.
- **De paso**, `bunup.config.ts` tenía `src/react/index.tsx` como entry
  point — archivo borrado hace varios commits en este mismo refactor,
  nunca actualizado. `bun run bunup` estaba roto (no lo corrió nadie desde
  entonces). Se sacó esa entrada; no está en `package.json` `exports`
  tampoco, así que no hay nada más que limpiar ahí.
- Los 3 `.css` se publican en `dist/` y en `exports`; `luz.css` los
  referencia con `@import` relativo y el plugin los deja pasar tal cual
  (solo expande las directivas `@luz`).

- **`RESET`**: normalize puro y genérico, no-por-componente — box model,
  márgenes, list-style, elementos exentos de catálogo de componentes
  (`html`/`body`/`img`/`picture`/`video`/`canvas`/`svg`/`br`/`figure`).
  Cero tokens de color/tipografía propios de luz más allá de
  `--font-weight`/`--line-height` (restauración semántica, no elección
  visual).
- **`COMPONENTS`**: todo lo demás — un archivo self-contained por
  componente en `src/tools/components/` (reset+layout+color+hover/focus/active
  del componente juntos, ya no repartidos entre capas globales),
  concatenados según el manifest `components.css`.

No es togglable todavía (decisión explícita — ver `CLAUDE.md`): las 2
siempre se generan juntas, `buildReset()` no toma parámetros aún. La
función existe para que un futuro `layers` pueda seleccionar un subset sin
otro rewrite — no para cambiar comportamiento hoy.

**Dos bugs reales corregidos de paso** (motivaron parte de esta revisión):
`"font-weight"` de config no llegaba al reset universal (`*`) ni a `body`
— ambos tenían `font-weight: 400` literal en vez de `var(--font-weight)`,
así que texto suelto sin envolver en `<p>` ignoraba la config. Y
`"font-emphasis"` (doc dice `<em>`/`<i>`) solo se aplicaba a `em`, nunca a
`i`. Verificado con un diff de multiset de declaraciones antes/después:
0 propiedades perdidas salvo las 2 corregidas + una duplicación muerta en
`hr` (`height: 0` pisado por `height: 1px` en la misma regla) que se sacó.

**Corregido en el Bloque B** (ver esa sección más abajo): `components.css`
tenía `&::-moz-progress-bar { background-color: var(--primary-500) }`
hardcodeado — ahora usa el alias `--progress-fill` de `themeVariables()`.

## Adaptadores (`vite/`, `astro/`)

`luzVite(config: LuzConfig, options?: { root?: string }): Plugin` es el
único mecanismo. `enforce: "pre"`; `buildStart` cachea `luz(config)` y
el bridge (dependen solo de config); `transform` corre sobre todo request
CSS (`isCSSRequest`, excluido `?raw`) que contenga `@d00m-gui/luz/` o
`@luz ` y aplica `expandLuzCss` (`tools/css.ts`):

1. `@import "@d00m-gui/luz/luz.css"[ layer(L)];` → en su lugar los
   `@import` de `reset.css` y `components.css` (con el mismo `layer(L)`);
   encola `@luz theme; @luz bridge; @luz utilities;` (envueltas en
   `@layer L {}` si había layer).
2. `@import "@d00m-gui/luz/(theme|bridge|utilities).css"` → se quita y
   encola su directiva.
3. Lo encolado se inserta después del último statement `@import`/
   `@charset`/`@layer …;` de nivel superior (escáner mínimo que salta
   strings, comentarios, paréntesis y bloques) — los `@import` del
   usuario posteriores siguen siendo CSS válido.
4. Cada `@luz <section>;` (encolada o escrita a mano) se reemplaza por su
   CSS. Utilities se escanean en ese momento (`scanSources(root)`, cache
   por mtime); si no expandió nada devuelve `undefined`.

Vite inlinea los `@import` estáticos con su propio `postcss-import`, que
lee los archivos importados con `fs.readFile` sin pasar por `transform`
de plugins — por eso los entries generados se expanden en el CSS que
los importa y no en el archivo entry (que solo contiene la directiva).

Dev: cuando expande `utilities`, `addWatchFile` por cada archivo
escaneado y registra el id del módulo CSS; `configureServer` escucha
`add`/`unlink` del watcher bajo `root` (extensiones de
`DEFAULT_EXTENSIONS`) y hace `server.reloadModule` sobre esos módulos.
Editar, crear o borrar un archivo fuente regenera las utilities en
caliente (verificado contra `docs/` en dev).

`luzAstro(config: LuzConfig): AstroIntegration`: un solo hook
`astro:config:setup` que registra `luzVite(config, { root: srcDir })`
vía `updateConfig`. Cualquier framework sobre Vite usa `luzVite`
directo. Bundlers sin Vite (Next): CLI pendiente, ver `TODO.md`.

## Fixtures de consumidor (`fixtures/`)

A diferencia de `docs/` (importa el código fuente de luz directo, no lo
"consume"), `fixtures/*` instalan `@d00m-gui/luz` desde un tarball real
(`bun pm pack`) — mismo camino que tomaría un usuario final. Primero:
`fixtures/tanstack-dashboard` (TanStack Start + `@tanstack/charts`,
`@import "@d00m-gui/luz/luz.css"` en `styles.css` cargado vía `?url` +
`<link>`, ver su `README.md`). Script de arranque en la raíz: `bun run
fixture:tanstack`.

## Motor de utility classes (`tools/utilities.ts`)

Vocabulario cerrado, no Tailwind completo: un `registry` de namespaces
(`scale`, `color`, `bridge-color`, `literal`) resuelve cada candidato
escaneado del código fuente (`scanSources`) contra los tokens generados.
Sin valores arbitrarios (`w-[13px]` no existe), sin JS en runtime — todo se
resuelve y emite en build time. Soporta un sufijo de opacidad (`/50`) y un
prefijo de variante (`hover:`, `open:`, ...) resuelto vía `tools/variants.ts`
— además de la tabla fija, parsea genéricamente `data-[attr=valor]:`/
`aria-[attr=valor]:` (sintaxis arbitraria de Tailwind), así que código de
terceros ya escrito (componentes shadcn/Radix/Base UI/animate-ui copiados
al proyecto) matchea sin que luz conozca esa librería específica.

**Variantes de breakpoint** (`variants.ts` → `MEDIA_VARIANTS`): `sm:`/
`md:`/`lg:`/`xl:`/`2xl:` (`min-width`, rem fijos de `BREAKPOINTS`, no
configurables) y `max-sm:`…`max-2xl:` (`max-width: calc(N - 0.02rem)`);
combinables solo en orden `breakpoint:estado:util` (`md:hover:flex`).
`ResolvedUtility` lleva `media?`; `emitUtilitiesCSS` emite primero las
reglas sin media y después un bloque `@media` por breakpoint (min
ascendente, luego max). `escapeClassSelector` escapa el dígito inicial
(`.\32 xl\:block`). Familias sobre la escala `space`: `p/m/gap`
(+ ejes/lados), `w/h/size-N`, `min-w/max-w/min-h/max-h-N`,
`top/right/bottom/left/inset-N` — `N` es cualquier entero positivo:
`var(--space-N)` mientras el token exista, `calc(N * var(--space-1))` más
allá de `spaceSteps` (la escala es lineal). Misma mecánica en la escala
`border-radius`: `rounded-N` → `var(--border-radius-N)`, con
`calc(N * var(--border-radius-1))` más allá de `radiusSteps`. Literals
`aspect-square/video`, `rounded`/`rounded-none`/`rounded-full`,
`w-screen/h-screen/min-h-screen/max-h-full`.

## Componentes de aplicación (`page.css`, `.shell.app`, `.list.nav`, …)

Nacidos del fixture `tanstack-dashboard` armado solo con clases de luz
(su `README.md` conserva la lista de shortcomings y qué resolvió cada
uno). Convención: variante = clase sobre el componente (`.hero.compact`),
slot = clase hija con prefijo (`.card-cover`), knob = custom property con
prefijo y fallback al default (`--shell-height`, `--page-width`,
`--prose-width`, `--range-length`, `--scroll-max`, `--fx-blur`,
`--hero-min-height`, `--blockquote-font-size`).

- `page.css`: `.page` (`max-width` + gutters + `gap`), `.page-header`/
  `.page-header-title`, `.page-body` (`.with-aside` → grid con
  `--page-aside-width`, colapsa bajo 64rem), `.page-aside` (sticky,
  `--page-aside-top`), `.stack` (`--stack-gap`); `.page section
  { padding: 0 }` neutraliza el padding de landing de `section.css`.
- `shell.css`: `.shell.app` (pantalla completa, sin borde), `.shell.
  responsive` (apila panes bajo 48rem), `--shell-height`.
- `list.css`: `.list.nav` (filas sin borde, radio, `.status` con
  `--scheme`), `ul.list > li` neutralizado, `button.list-row`, último
  hijo de una fila de 2 alineado a la derecha, icono de `.filetree` rota
  con `[open]`. El drill-down fullscreen en mobile de `details.list-row`
  pasó a ser opt-in: `.list.drilldown` (lo usa el sidebar de `docs/`).
- `field.css` `.field`/`.field.row`/`.field-hint`; `form.css`
  `.form-actions(.sticky)`; `progress.css` `.meter`; `button.css` acepta
  `data-role=` además de `role=`; `alert.css` `--scheme: initial` en
  botones hijos directos.
- `card.css` `.card-cover`/`.card-toolbar` (y `:where(.card)
  .card-content` para que utilities lo pisen); `grid.css` `.xs/.sm/.md/
  .lg`; `hero.css` `.compact`/`.hero-background`; `avatar.css`
  `.avatar-group`/`.avatar.more`; `skeleton.css` `.text/.avatar/.badge`;
  `overlay.css` `.menu-item`; `status.css` `background: var(--scheme,
  currentColor)` + `.pulse`; `element.css` `.wire`; `radial.css`
  `.fixed` y ángulos automáticos (`--radial-start` + `--radial-step`,
  default `360deg / sibling-count()`, vía `sibling-index()` detrás de
  `@supports`; `--radial-angle` por ítem sigue ganando; el offset polar
  va en `transform`, no en `translate`, porque Chromium 150 se cuelga al
  mezclar `%` con `sibling-index()` ahí); `_center.css` en grid;
  `nav.css` acotado a `ul:not(.list)` + `[aria-current]`.
- Lectura: `.prose` real (ritmo vertical bajo `:where(.prose)`, `ol`
  numerado también en `reset.css`, `dl`), `code`/`pre`/`samp` con
  superficie (`--code-bg`/`--on-code` en `themeVariables`, vía
  `light-dark()`), `kbd + kbd`. `_print.css` oculta el chrome de
  `.shell.app`.

## Convenciones de tokens

- Nombres fijos: `primary`/`secondary`/`tertiary`/`quaternary`/`neutral`/
  `surface-*` y los 12 hues de la rueda. No hay prefijo/namespace/
  renombre configurable (`name` y `prefix` existieron y se retiraron: se
  inyectaban sin escapar y dejaban `var()` sin resolver) — la capa
  estática (`components/*.css`) referencia `--primary-N`/`--neutral-N`/
  `--surface-*-N` directo.
- Cada paleta de acento emite `on-{name}` (auto-contraste sobre su seed),
  igual que `on-{hue}` en la rueda; el bridge shadcn los usa para
  `--primary-foreground`/`--secondary-foreground`.
- Shades: `{name}-{weight}` con los 11 weights fijos `50…950` (`WEIGHTS`
  en `constants.ts`) — siempre existen, no hay fallback `var(--x-N,
  var(--x))`.
- El type scale (`text-*`/headings) es exponencial (ver `power`), `space-N`
  es lineal (spacing) — son escalas distintas a propósito, no una
  consolidación pendiente (ver doc del campo `spaceSteps` en `LuzConfig`).

## Colores semánticos atenuados (`anchor*`) — `muted()`

`themeVariables()` (`luz.ts`) tenía ~25 tokens apuntando directo a
`var(--{hue}-500)` — el weight 500 es el pico de chroma de toda la
rampa (curva sin-wave en `hue.ts`), así que cualquier token semántico
ahí es la versión más saturada posible del hue, siempre. Para
`anchor`/`anchor-secondary`/`anchor-danger`/`anchor-success`/
`anchor-warning` (colores de link — el único caso que renderiza _inline
dentro de párrafos_, compitiendo directo con texto de body ya atenuado)
esto se sentía "gritado"/poco armonioso. Nuevo helper `muted(cssVar)` →
`oklch(from ${cssVar} l calc(c * 0.6) h)` — reduce el chroma un 40%,
mantiene `l`/`h` intactos. Factor `0.6` elegido comparando visualmente
`x1/0.75/0.6/0.45/0.3` — `0.6` es el punto donde cada hue sigue
identificable sin gritar; `0.45` ya arriesgaba perder identidad (yellow
se acerca a neutral).

**Escopeado a `anchor*` únicamente** — botones (`btn-bg-success/danger/
warning`), badges (`badge-bg-*`), alerts (`alert-border-*`) y form
validation (`input-valid`/`input-invalid`) siguen en `-500` crudo sin
atenuar: son call-to-action/señales de estado donde la saturación alta
es la convención esperada (daisyUI, shadcn, etc.), no el mismo problema
que un link inline. No extender `muted()` a esos sin evaluar cada caso
por separado.

## Testing

Toda la suite (`tests/`) fue borrada en este refactor (`23aa68d` y
commits previos) junto con los fixtures de consumidores (`astro-consumer`,
`vite-consumer`, `consumer`). Hoy no hay red de seguridad automatizada.

Decidido: cuando se reponga, va a ser **solo e2e**, probando `luz` de
punta a punta contra los entornos que soporta (Astro, Vite) — no unitarios
por módulo. Cualquier otro tipo de test requiere aprobación explícita del
usuario antes de agregarse (ver `CLAUDE.md`).

## docs/ y el rol de shadcn — decidido

`docs/` es una app Astro que sirve de showcase/demo de la librería, no se
publica como parte del paquete (`files` en `package.json` no la incluye).

Hasta este refactor, `docs/` incluía 12 componentes shadcn/ui (variante
Base UI) adaptados a mano (`docs/src/components/ui/*`) más dos páginas que
los mostraban (`/components`, `/admin-example`). Se retiraron por completo
(componentes, páginas, `components.json`, el helper `cn()`, y las
dependencias `@base-ui/react`/`class-variance-authority` de
`docs/package.json`) — `@astrojs/react`/`react` quedan, los sigue usando
`CrtIntro`/`CrtIntroMount`, que no dependen de shadcn.

**Decisión** (investigado contra daisyUI/shadcn/animate-ui — ver historial
de la conversación, no repetido acá): luz no compite en "cantidad de
componentes" — eso ya lo tiene resuelto daisyUI, mejor y más maduro. El rol
de shadcn en luz se angosta de "estilo + comportamiento" a **solo
comportamiento, cuando CSS nativo genuinamente no alcanza** (combobox con
detección de colisión real, date picker, navegación por teclado compleja):
primitivos sin estilizar (Base UI/Radix) + las clases de luz encima, no el
theming propio de shadcn. Para todo lo demás — badge, alert, card, avatar,
tabs, accordion, modal, breadcrumbs, skeleton — luz tiene su propia capa
curada de componentes (ver `tools/components.css`), generada desde tokens,
mismo enfoque que daisyUI (CSS puro, HTML nativo para la interactividad
mínima que haga falta) pero reactiva a la paleta/escala del proyecto en
vez de un tema fijo. `tools/shadcn-bridge.ts` no se tocó — sigue siendo
la vía cuando sí hace falta un primitivo real.

`docs/` todavía no demuestra ninguna de las dos cosas (ni la capa curada
ni el bridge angostado) — pendiente para una pasada de contenido, no de
arquitectura.

## `docs/`: ejemplos de componentes como Content Collection (Markdown)

Los ejemplos por componente (antes un array `COMPONENTS` de ~980 líneas en
`docs/src/content/components.ts`) viven ahora uno por archivo en
`docs/src/content/components/<id>.md` — content collection de Astro
(`docs/src/content.config.ts`, colección `components`, mismo patrón que
`features`). Frontmatter para la metadata (`title`, `desc?`, `category`,
`covers`, `span?`, `wip?`, `preview?`, `variants?`); el cuerpo del `.md` es
el HTML copiable/renderizado del ejemplo base — no se procesa como
Markdown (no se llama `render()`), se usa `entry.body` crudo.

`desc` es texto corto (puede llevar `<code>` inline) que antes vivía
pegado al `title` con un separador `" — "`; ahora se renderiza aparte
(`<small>` junto al título) tanto a nivel de componente como de variante.

`docs/src/content/components.ts` pasó de exportar el array a exportar
`loadComponents()` (async, `getCollection("components")` + el cálculo de
`visibleComponents`/`uncoveredFiles` que antes eran constantes) — los tres
consumidores (`Sidebar.astro`, `pages/index.astro`,
`pages/components/[id].astro`) lo llaman con `await` en su frontmatter.

`docs/scripts/gen-components.ts` (`bun run gen:components`), además de
regenerar `components.generated.ts` desde `src/tools/{reset,design}.css`,
ahora también escanea los `.md` existentes y, para cada archivo de diseño
sin cobertura (mismo criterio que antes: ningún token en `covers` de
ningún componente), escribe un stub `<file>.md` inicial (`wip: true`,
`category` y `covers` a completar a mano) si todavía no existe uno con ese
nombre — evita tener que armar el objeto a mano en un array gigante.

## Referencias

- `README.md` — pitch de producto / API pública documentada para consumidores.
- `CHANGELOG.md` — historial de cambios, resúmenes cortos (gitignored, referencia interna).
- `CLAUDE.md` — instrucciones de trabajo para el asistente (gitignored).
- `TODO.md` — backlog único (librería + `docs/`), gitignored. Reemplaza a
  los antiguos `HANDOFF.md`/`DOCS.md`, fusionados acá.
