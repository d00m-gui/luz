# luz — Software Design Document

Estado del diseño y la arquitectura actual de `luz`, mantenido junto al
refactor en curso (`feat/refactor-core`). No es un changelog (ver
`CHANGELOG.md`) ni una guía de trabajo para el asistente (ver `CLAUDE.md`):
es la foto de "cómo está armado y por qué".

## Qué es luz

Librería CSS-in-TypeScript de theming. Recibe un color `primary` (y config
opcional) y devuelve tokens estructurados + CSS ya armado: paleta oklch
50–950, secundario derivado, neutral, rueda de 10 hues, dos escalas
numéricas (`size-N` tipográfica exponencial, `space-N` lineal), reset
classless, motor de utility classes al estilo Tailwind (cerrado, sin valores
arbitrarios) y un bridge de alias para consumir esos tokens desde
componentes shadcn/ui (variante Base UI).

No es un reemplazo de Tailwind ni mantiene una librería de componentes
propia — ver `README.md` para el pitch de producto.

## Módulos (`src/`)

```
src/
  luz.ts              orquestador: config → tokens → CSS string
  index.ts             entry pública (re-exports)
  tools/
    constants.ts        curvas de shade (WEIGHTS/SHADES/SHADES_REVERSE) — datos puros
    reset.css/design.css   las 2 capas del reset, CSS real (design.css es manifest de design/*.css, 1 archivo por componente)
    hue.ts               luzShadesByHue: 1 hue base → N shades oklch (50–950 garantizados + steps custom)
    wheel.ts             luzWheel: 10 hues (red…sky), l heredada de primary (armonía), seed overrideable, vía luzShadesByHue
    sizes.ts             luzSizes/luzSpace/luzTypeLandmarks: size-N, space-N, font-size-h1..h6/small fijos
    props.ts             luzProperty: infiere @property por token (syntax/initial-value) — opt-in
    reset.ts             buildReset(): compone RESET + COMPONENTS desde reset-css.generated.ts
    shade-fallback.ts    var(--x-500) → var(--x-500, var(--x)) para paletas custom incompletas
    shadcn-bridge.ts     shadcnBridgeCSS: alias de tokens shadcn ← tokens luz
    utilities.ts         registry de utility classes + scan + emisión de CSS
    scan.ts               scanCandidates: walk de archivos fuente, extrae candidatos de clase
    variants.ts           VARIANTS: prefijos data-*/pseudo-clase → selector
    write-css.ts          composeCss/writeCss: ensamblado y escritura a disco (file/split/virtual)
  astro/index.ts        integración Astro (luzAstro)
  vite/index.ts          plugin Vite (luzVite)
```

## Flujo de datos

```
LuzConfig
   │
   ▼
luz(config)                         src/luz.ts
   ├─ buildColors()  ── luzShadesByHue ×3 (primary/secondary/neutral)
   │                 └─ luzWheel        (10 hues fijos)
   ├─ luzSizes()/luzSpace()           escalas size-N / space-N
   ├─ themeVariables()                 alias semánticos (btn-*, kbd-*, ...)
   └─ luzProperty(tokens)              @property inferidas
        │
        ▼
   { tokens, variables, properties, style }
        │
        ├─ shadcnBridgeCSS(tokens)     :root { --card: ...; ... }
        └─ scanAndEmitUtilities()      scanCandidates() + utilities.ts registry
        │
        ▼
   writeCss() / virtual module         src/astro/index.ts, src/vite/index.ts
```

`luz()` es puro (config → resultado, sin I/O). Todo el I/O (scan de
archivos fuente, escritura de CSS) vive en los adaptadores
(`astro/index.ts`, `vite/index.ts`) y en `tools/scan.ts` /
`tools/write-css.ts`, nunca en `luz.ts`.

### Salida de CSS (`LuzCssOutput`)

- `"file"` — un solo archivo compuesto (theme + bridge + utilities).
- `"split"` — tres archivos (`.theme.css`, `.bridge.css`, `.utilities.css`) + un agregador con `@import`.
- `"virtual"` — módulo virtual de Vite, sin escritura a disco; el pipeline CSS de Vite/Astro minifica.

## Principio de diseño: **la config siempre gana**

Implementado para el core de `luz()` (`variables`/`style`); todavía no
alcanza al bridge de shadcn ni al motor de utility classes.

**Dos mecanismos, según si hay derivación o no:**
- **Seeds** (`primary`, `secondary`, los 10 wheel hues) — el usuario define
  un color base, luz deriva el resto (rampa `-50…950`) vía
  `oklch(from var(--{name}-seed) ...)`. No son overrides de valor final:
  cambian el *input* de un cálculo que sigue corriendo.
- **`vars`** (`LuzConfig.vars: Record<string, string | number>`) — override
  de *valor final*, sin derivación posible. Se mergea **al final** de
  `variables` en `luz()`, después de colors + sizes + typography +
  `themeVariables()` — pisa cualquier token existente por nombre
  (`{ "primary-500": "..." }`, `{ "btn-bg": "..." }`) o agrega uno nuevo si
  el nombre no matchea nada generado (`{ "my-radius": "4px" }`). Mismo
  mecanismo para "redefinir cualquier output" y para "custom params que se
  convierten en tokens" — es un solo merge, no dos features separadas.

**Fuera de alcance por ahora** (decisión explícita, no descuido): `vars`
no llega a `shadcnBridgeCSS()` ni a `scanAndEmitUtilities()` — esas dos
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

## `colorSteps`/`sizeSteps` — desacoplados de reset/wiring interno

Hasta este cambio, `colorSteps`/`sizeSteps` distintos del default (11/22)
rompían silenciosamente casi todo lo que no era la paleta pública: ~40
alias semánticos en `themeVariables()`/`buildColors()`/`wheel.ts`/
`shadcn-bridge.ts` referenciaban pesos fijos (500/900/700/...) que dejaban
de existir, y `reset.ts` referenciaba `size-N` hasta `size-22` para
tipografía Y estructura (padding/gap/radius/heights) — con `sizeSteps` bajo
la mayoría de esos tokens desaparecía. `docs/luz.config.ts` con
`colorSteps: 3, sizeSteps: 5` es el repro que destapó esto.

**Fix — dos mecanismos, `luz()`/adaptadores sin cambios:**
- **Colores** (`hue.ts`): `luzShadesByHue` ahora genera **siempre** los 11
  pesos default (50–950), sin importar `steps` — es lo que garantiza que
  `--primary-500`, `--red-500`, etc. existan siempre. Si `steps` difiere de
  11, se agrega un set adicional resampleado (más o menos resolución para
  la escala pública `bg-primary-N`), nunca lo reemplaza. `luzWheel` hereda
  la garantía gratis (usa `luzShadesByHue` internamente) — no se tocó.
  Efecto secundario a tener presente: `colorSteps` ya no puede *reducir*
  el total de shades por debajo de 11 — solo puede agregar más.
- **Sizes** (`sizes.ts`): nuevo `luzTypeLandmarks()` — 7 tokens siempre
  presentes (`font-size-small`, `h6`…`h1`), en rungs consecutivos 0-6 desde
  un anchor de `7.5 × --size-unit` (0.75rem, retocado una vez más — ver
  sección de `preset` — desde un primer intento de `9 × --size-unit` que
  seguía dando un h1 de 80.8px incluso en `"app"`). Todo heredado del
  default original (rungs 0,4,5,6,7,8,9 desde 1.3rem, de la numeración
  vieja de `size-13..22`; daba un h1 de ~276px incluso sin fluidez).
  Independientes de `sizeSteps`/`sizeDynamicFrom`; `power`/`base`/
  `sizeFluidRange` los siguen afectando. Además, un nuevo `--size-unit`
  (siempre `0.1rem`-equivalente, escalado por `base` si
  `sizeRelativeToBase`) reemplaza el resto de usos estructurales de
  `size-N` en `reset.ts` (paddings, gaps, radios, alturas) vía
  `calc(var(--size-unit) * N)`. `reset.ts` ya no referencia `size-N`
  directo en ningún lado — verificado con un diff automatizado de
  declaraciones contra el output default (multiset idéntico salvo 2 fixes
  de bugs, ver sección de `reset.ts` más abajo).
- `size-N`/`space-N` públicos (para `text-N`/`p-N`/etc. del motor de
  utilities) no cambiaron en este batch — `sizeSteps`/`sizeDynamicFrom`/
  `spaceSteps` seguían controlando exactamente lo mismo que antes para
  esas clases. **`size-N`/`text-N` fueron retirados en una sesión
  posterior** — ver "Escala de texto con nombre" más abajo, esta nota
  queda como historial de esta sesión puntual.

**No reactividad rota:** el mecanismo elegido para colores mantiene todo
como `var(--{name}-N)` (indirección CSS), no valores literales — el modo
`mode: "auto"` sigue funcionando porque el diffing light/dark ya existente
en `luz()` sigue operando sobre estas mismas variables, sin cambios.

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

`docs/luz.config.ts` usa `preset: "content"` + `.fluid` en la sección de
Typography — primer uso real de la capa fluida en el sitio, verificado
con `astro build` real y captura en Chrome (headings se ven igual a
como se veían antes del cambio, sin regresión visual).

## Armonía de la rueda de colores — `l` heredada de `primary`

Comportamiento histórico restaurado (default, sin flag en `LuzConfig`) —
da nombre a la librería. Los 10 hues de `luzWheel` (`tools/wheel.ts`) ya
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
dejarlo literal) sería el error: aplanaría los 10 hues a la misma
magnitud de saturación absoluta, perdiendo el calibrado individual.
Verificado visualmente con `primary` en `l` muy oscura/media/muy clara —
los 10 hues siguen diferenciándose entre sí, sin romperse.

`wheelOverrides` (ya existente) sigue pisando por completo cualquier hue
individual — un override explícito ignora `primary` para ese hue.

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
  a ese elemento en *containing block* de sus descendientes, rompiendo
  `position: fixed` de cualquier consumidor (header fijo, botón "volver
  arriba", etc.) en todo el sitio. En cambio, `.card` y `dialog.modal`
  (`tools/design.css`) llevan `container-type: inline-size` cada uno — son
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

## Capa de componentes curados (`DESIGN`)

9 recetas CSS puras estilo daisyUI en `tools/design.css`, generadas desde
tokens de luz (no fijas como un tema): `.badge`, `.alert`, `.card`,
`.avatar`, `.tabs`/`.tab`, `.accordion` (`<details>`/`<summary>` nativo),
`dialog.modal` (`<dialog>` nativo, entrada animada vía `@starting-style` +
`transition-behavior: allow-discrete` — la técnica exacta del skill de
Emil), `.breadcrumbs`, `.skeleton` (shimmer, respeta
`prefers-reduced-motion`). 31 alias nuevos en `themeVariables()`
(`badge-*`, `alert-*`, `tab-*`, `modal-backdrop`, `breadcrumb-*`,
`skeleton-*`), mismo patrón que los existentes. `.tabs`/`.alert` son
visual-only a propósito (mostrar/ocultar contenido real necesita JS —
mismo límite que documenta daisyUI para los suyos).

Sizing interno vía `calc(var(--size-unit) * N)` (nunca `--size-N`
directo), `--avatar` usa `--space-N` (es tamaño de layout, no anatomía
interna de componente chico) — mismo criterio que ya regía el resto de
`design.css`/`structure.css`.

**Fix D1**: `progress { &::-moz-progress-bar { background-color:
var(--primary-500) } }` hardcodeaba el literal — no respetaba `name`/
`prefix` custom. Nuevo alias `--progress-fill` en `themeVariables()`.

**Fix de paso**: `structure.css` (switch/radio) todavía usaba
`var(--size-6)`/`var(--size-7)` directo — el mismo bug de acoplamiento a
`sizeSteps` corregido en el resto del reset esta sesión, sin aplicar ahí.
Corregido a `calc(var(--size-unit) * N)`.

**Hallazgo, no corregido (pre-existente, confirmado con `git stash` — no
lo introdujo este cambio)**: con `name`/`prefix` custom simultáneos (ej.
`{ name: "brand", prefix: "luz-" }`), quedan 2 `var()` sin resolver:
`--luz-brand`/`--luz-secondary` (el alias "base" sin sufijo `-N`). No es
parte de este batch — anotado para otra pasada.

## `_feedback.css` — esquema × tratamiento, 2 ejes combinables

`tools/design/_feedback.css` (último `@import` de `design.css`, después
de todos los componentes — así sus clases ganan el empate de
especificidad contra los estilos base de `.btn`/`.badge`/`.alert`/
`.toast`). Dos ejes de clases combinables en el HTML:

- **Esquema** (`.success`/`.danger`/`.warning`/`.info`/`.primary`/
  `.secondary`/`.neutral`): fija solo `--scheme` (fondo) a los tokens de
  `themeVariables()`/`buildColors()` (`--success`, `--scheme-primary`/
  `--scheme-secondary`/`--scheme-neutral`, etc.). El texto ya no viene de
  un token `on-*` precalculado — se computa en vivo con `contrast-color()`,
  ver más abajo. El `color: var(--scheme)` para el look "solo color" vive
  aparte, en un `:where(.success, .danger, ...)` compartido de
  especificidad cero — así nunca pisa el `color`/`--current-color` que ya
  calcula un componente (`.btn`/`.badge`/`.alert`) cuando el esquema se
  combina sin clase de tratamiento.
- **Tratamiento** (`.solid`/`.soft`/`.outline`): lee `--scheme` con
  fallback a `--scheme-primary`, define fondo/borde/texto.

`.btn`/`.badge`/`.solid` derivan `--current-bg` de `var(--scheme,
var(--btn-bg))` (o `--badge-bg`/`--scheme-primary`), cada uno en su propio
archivo. `--current-color` (`var(--on-scheme, contrast-color(var(--current-bg)))`
+ fallback `@supports`) ya no se repite por componente — vive una sola vez
en `_contrast.css`, un `:where(.btn, .button, ..., .badge, .solid) { ... }`
de especificidad cero que los tres consumen. Sus modificadores
de color (`.success`, `.danger`, `.warning`, `.neutral`, `.alternative`,
`[role="contrast"]`, etc.) solo fijan `--scheme`, ya no tienen una regla
de pintado por variante ni necesitan un `on-*` por color (`on-success`,
`on-danger`, `on-scheme-*`, `on-primary`/`on-secondary`/`on-tertiary`/
`on-quaternary`/`on-neutral` — eliminados de `luz.ts`, `contrast-color()`
calcula el contraste real de cada fondo en vez de tener una tabla
pre-calculada por color). `--on-scheme` queda como hook opcional — no lo
emite `luz()`, pero el consumidor puede fijarlo (`.btn.danger { --on-scheme: ... }`)
para forzar el color de texto de una variante puntual, y gana por estar
primero en el `var(..., contrast-color(...))`. `contrast-color()` es
Baseline recién desde abril 2026 (Chrome 147/Firefox 146/Safari 26) — cada
regla que la usa tiene un bloque hermano `@supports not (color:
contrast-color(black))` que reescribe `--current-color`/`color` con la
fórmula `oklch(from var(--current-bg) ...)` de antes (`luzOnColor()` en
`hue.ts`, ahora solo usada como fallback). El hover/active de `.btn` usa
`oklch(from var(--current-bg) ...)`, ya no toca `--btn-bg` directo. `.alert`
y `.toast.<esquema>` usan la fórmula de `.soft` (fallback `--scheme-neutral`
en `.alert`). `.dot` no necesita reglas propias por esquema: hereda
`color` de la clase de esquema vía `background-color: currentColor`.

`on-btn`/`on-badge`/`on-kbd`/`on-selection` siguen existiendo como tokens
globales en `luz.ts` — los consume código fuera del sistema `--scheme`
(`segmented`/`toggle`/`pagination`/`wizard.css` para `on-btn`/`on-badge`,
`kbd.css`, `mark`/`::selection`) — pero su fórmula pasó de `luzOnColor(seed)`
a `luzContrastColor(seed)` (`contrast-color(var(--btn-bg))` etc.), con el
mismo fallback `@supports` emitido una vez en el `:root` que genera `luz()`.

**Bug corregido**: los tokens de esquema no pueden llamarse `primary`/
`secondary`/`neutral` a secas — `buildColors()` ya emite variables con
esos nombres por default (`--primary`/`--secondary`/`--neutral` = color
semilla crudo), y como `--primary-500` etc. se calculan a partir de esas,
un choque de nombres crea una referencia circular (ambas quedan inválidas
en el browser). Por eso el alias fijo usa el prefijo `scheme-`.

## Bloque D4 — `.css` estáticos reales en `dist/`, `@import` directo

`reset.css`/`structure.css`/`design.css` (100% estáticos, no dependen de
config) ahora se copian a `dist/` en cada build (plugin `copy()` de
bunup) y se publican en `exports` de `package.json`
(`"./reset.css": "./dist/reset.css"`, etc.) — un consumidor puede hacer
`@import "@d00m-gui/luz/reset.css";` directo en su propia hoja de
estilos, sin pasar por los adaptadores de Astro/Vite en absoluto.

Modo `"split"` (`LuzCssOutput`) también escribe copias locales de los 3
junto a `theme`/`bridge`/`utilities` — pero el agregador (el archivo con
los `@import url(...)`) **no** los incluye todavía: `theme.css` sigue
trayendo el reset inline (vía `buildReset()` dentro de `luz()`), así que
sumarlos al agregador duplicaría el reset. Deliberadamente no resuelto en
este batch — requiere tocar `luz()` para sacar el reset del `style` que
devuelve, que es un cambio más grande, no decidido todavía. Modo
`"virtual"` sin cambios (fuera de alcance, no verificado).

**Bug de build encontrado y corregido durante la integración** (no lo
tenía el fork, apareció recién al correr el build 2 veces seguidas):
`bunup.config.ts` tenía `exports: true` a nivel top **y** el plugin
`exports()` explícito con `customExports` — dos mecanismos separados
escribiendo el mismo campo de `package.json`, cada uno "corrigiendo" al
otro en la corrida siguiente (las 3 entradas de `.css` aparecían y
desaparecían alternando 0/1/0/1 en corridas consecutivas). Sacar la
opción top-level redundante lo dejó determinístico (4/4 corridas
estables, verificado). Sin esto, el publish real podría haber salido sin
las entradas de `.css` dependiendo de cuántas veces corriera el build.

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

Dos capas, no tres: `reset.css` (genérico, no-por-componente — `*`,
`html`/`body`, `img`/`picture`/`video`/`canvas`/`svg`, `br`, `figure`,
`#root`/`#__next`, `[hidden]`) y `design.css`, que es un manifest corto
de `@import "./design/nombre.css";` — un archivo **self-contained** por
componente bajo `src/tools/design/` (48 archivos: reset+structure+design
de ese componente juntos, ya no repartidos entre 3 capas globales). Dos
selectores genuinamente compartidos entre componentes (`:focus-visible`
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

Solución: `scripts/generate-reset.ts` lee `reset.css`/`design.css`,
resuelve los `@import` locales de `design.css` de forma recursiva, y
escribe `src/tools/reset-css.generated.ts` (comiteado, no gitignored) con
`RESET`/`COMPONENTS` como constantes de string planas — un módulo `.ts`
normal, sin nada especial que ningún bundler necesite entender.
`reset.ts` importa de ahí. **Hay que correr `bun run gen:reset` después de
tocar `reset.css`, `design.css`, o cualquier archivo bajo
`src/tools/design/`** — no es automático todavía (no hay watcher/hook,
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
- **Pendiente de decisión, no implementado**: exponer estos 3 `.css`
  también en `dist/` para `@import url(...)` real desde consumidores (o
  para el modo `"split"` de `LuzCssOutput`, que ya usa `@import` hoy para
  theme/bridge/utilities) — significaría publicarlos en `package.json`
  `exports` y decidir cómo llegan al modo `"virtual"`. Sigue sin decidir.

- **`RESET`**: normalize puro y genérico, no-por-componente — box model,
  márgenes, list-style, elementos exentos de catálogo de componentes
  (`html`/`body`/`img`/`picture`/`video`/`canvas`/`svg`/`br`/`figure`).
  Cero tokens de color/tipografía propios de luz más allá de
  `--font-weight`/`--line-height` (restauración semántica, no elección
  visual).
- **`COMPONENTS`**: todo lo demás — un archivo self-contained por
  componente en `src/tools/design/` (reset+layout+color+hover/focus/active
  del componente juntos, ya no repartidos entre capas globales),
  concatenados según el manifest `design.css`.

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

**Corregido en el Bloque B** (ver esa sección más abajo): `design.css`
tenía `&::-moz-progress-bar { background-color: var(--primary-500) }`
hardcodeado — ahora usa el alias `--progress-fill` de `themeVariables()`.


## Adaptadores (`astro/`, `vite/`)

Ambos siguen la misma forma: reciben `LuzConfig & { path?, output? }`,
llaman a `luz()`, arman `shadcnBridgeCSS` + `scanAndEmitUtilities`, y
entregan el resultado según `output`. Duplican bastante estructura
(`generate`/`generateFile`, el destructure de `path`/`minify`/`output`) —
candidato a extraer un helper compartido cuando se toque de nuevo esta
zona, documentado como decisión pendiente, no bug.

`astro/index.ts` tiene un comentario largo explicando por qué usa
`astro:build:start` en vez de `astro:build:done` (timing bug real,
confirmado empíricamente) — ese es exactamente el tipo de comentario que
sí corresponde bajo la convención de comments nueva (ver `CLAUDE.md`): no
describe qué hace el código, advierte sobre un problema no obvio.

## Motor de utility classes (`tools/utilities.ts`)

Vocabulario cerrado, no Tailwind completo: un `registry` de namespaces
(`scale`, `color`, `bridge-color`, `literal`) resuelve cada candidato
escaneado del código fuente (`scanCandidates`) contra los tokens generados.
Sin valores arbitrarios (`w-[13px]` no existe), sin JS en runtime — todo se
resuelve y emite en build time. Soporta un sufijo de opacidad (`/50`) y un
prefijo de variante (`hover:`, `open:`, ...) resuelto vía `tools/variants.ts`
— además de la tabla fija, parsea genéricamente `data-[attr=valor]:`/
`aria-[attr=valor]:` (sintaxis arbitraria de Tailwind), así que código de
terceros ya escrito (componentes shadcn/Radix/Base UI/animate-ui copiados
al proyecto) matchea sin que luz conozca esa librería específica.

## Convenciones de tokens

- Prefijo opcional (`config.prefix`) se antepone a **todo** nombre de
  variable generado.
- Shades: `{name}-{weight}` con weights fijos `50…950` (`WEIGHTS` en
  `constants.ts`) salvo que `colorSteps` sea distinto del default (11), en
  cuyo caso los weights se recalculan (`generateWeights` en `hue.ts`).
- `withShadeFallback` reescribe `var(--x-500)` → `var(--x-500, var(--x))`
  para los tres nombres "shaded" (`primary`/`secondary`/`neutrals`) — cubre
  paletas custom que no generaron todos los steps.
- El type scale (`text-*`/headings) es exponencial (ver `power`), `space-N`
  es lineal (spacing) — son escalas distintas a propósito, no una
  consolidación pendiente (ver doc del campo `spaceSteps` en `LuzConfig`).

## Colores semánticos atenuados (`anchor*`) — `muted()`

`themeVariables()` (`luz.ts`) tenía ~25 tokens apuntando directo a
`var(--{hue}-500)` — el weight 500 es el pico de chroma de toda la
rampa (curva sin-wave en `hue.ts`), así que cualquier token semántico
ahí es la versión más saturada posible del hue, siempre. Para
`anchor`/`anchor-secondary`/`anchor-danger`/`anchor-success`/
`anchor-warning` (colores de link — el único caso que renderiza *inline
dentro de párrafos*, compitiendo directo con texto de body ya atenuado)
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
curada de componentes (ver `tools/design.css`), generada desde tokens,
mismo enfoque que daisyUI (CSS puro, HTML nativo para la interactividad
mínima que haga falta) pero reactiva a la paleta/escala del proyecto en
vez de un tema fijo. `tools/shadcn-bridge.ts` no se tocó — sigue siendo
la vía cuando sí hace falta un primitivo real.

`docs/` todavía no demuestra ninguna de las dos cosas (ni la capa curada
ni el bridge angostado) — pendiente para una pasada de contenido, no de
arquitectura.

## Referencias

- `README.md` — pitch de producto / API pública documentada para consumidores.
- `CHANGELOG.md` — historial de cambios, resúmenes cortos (gitignored, referencia interna).
- `CLAUDE.md` — instrucciones de trabajo para el asistente (gitignored).
