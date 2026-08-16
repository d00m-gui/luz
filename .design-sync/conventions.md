## Using luz components

luz's components (`Button`, `Card`, `Toggle`, `Avatar`, `Menu`, `Menubar`,
`Tabs`, `Meter`, `Form`, `Field`, `ToggleGroup`, `Toast`, `Switch`, `Dialog`)
are **headless**: they carry zero built-in visual style of their own. Every
color, size, radius, shadow, and font comes from CSS custom properties
applied by luz's own reset/setup layer to plain HTML elements
(`button`, `input`, `[role="switch"]`, tables, etc.) underneath the
components — restyling a design means editing the token config, never the
component code or a className override beyond the semantic variants below.

**Wrap the whole app once**, at the root:

```jsx
import { LuzReact, Button, Card } from '@d00m-gui/luz';

<LuzReact config={{ primary: '#007dea', mode: 'dark' }}>
  <Card>
    <Button className="success">Save</Button>
  </Card>
</LuzReact>
```

Nothing outside `<LuzReact>` renders correctly — every component reads its
theme from that context.

**The `config` object IS the design system's styling API.** Key fields:
`primary` (hex, required — every color in the palette derives from this
hue), `secondary` (hex, omit to auto-derive as primary hue + 180°), `mode`
(`"light"` | `"dark"` | `"auto"`), `font` / `font-headings` / `font-monospace`
/ `font-emphasis` (CSS font-family strings), `font-weight` /
`font-bold-weight`, `power` (type-scale ratio, default `1.33` — higher =
more dramatic heading jumps), `base` (root font-size), `neutrals` (name for
the desaturated neutral ramp). Changing the *look* of a design built with
this DS means changing these values, not touching JSX.

**Resulting CSS custom properties** (read by every native element and
component, use directly in any custom layout CSS too): `--primary-50`
through `--primary-950` (11-step oklch ramp, same for `--secondary-*` and
`--{neutrals}-*`), `--background`, `--foreground`, `--on-primary`,
`--on-secondary`, `--size-1` through `--size-22` (spacing/sizing scale,
`--size-13`+ are fluid `clamp()`), `--border-radius`, `--border-width`,
`--spacing`, `--element-vertical`, `--element-horizontal`. Hue-wheel
constants, always available regardless of `primary`: `--red` `--copper`
`--orange` `--yellow` `--green` `--emerald` `--teal` `--cyan` `--blue`.

**`Button`'s only styling surface beyond tokens is `className`** — semantic
variants, not arbitrary utility classes: `success`, `danger`, `warning`,
`ghost`, `contrast`, `reset`, `pressed`, `over`. Same pattern applies to
plain `<a>` tags rendered inside a themed tree.

**Compound components** (`Avatar`, `Dialog`, `Field`, `Menu`, `Meter`,
`Switch`, `Tabs`, `Toast`) are namespaces of sub-parts — always **lowercase**
property names, e.g. `Dialog.root`/`Dialog.trigger`/`Dialog.popup`/
`Dialog.backdrop`, `Menu.root`/`Menu.trigger`/`Menu.portal`/`Menu.popup`/
`Menu.item`. Compose the full namespace — a sub-part rendered alone outside
its `.root` throws a missing-context error.

**Where the truth lives**: `src/tools/setup.ts` (every token-to-selector
binding), `src/tools/hue.ts` (the oklch shade-ramp math), `src/luz.ts`
(`LuzConfig` fields and defaults).
