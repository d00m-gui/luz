# VHS Video Club

Mood: 80s retro VHS rental-store vibes for a movie-night meetup app —
friends schedule watch parties, share comments and moments during playback.
Config derived from that mood (`luz-ui` step), resolved through `luz()`.

```ts
{
  primary: "#1F4FD8",       // rental-store blue
  secondary: "#FFC72C",     // tape-label gold
  mode: "dark",              // late-night rental-aisle / CRT dark
  font: `"Space Grotesk", sans-serif`,
  "font-headings": `"Bebas Neue", sans-serif`,   // condensed marquee poster look
  "font-monospace": `"VT323", monospace`,        // CRT digital-clock font
  power: 1.5,                 // dramatic type scale, blockbuster-poster jump
}
```

## Palette

Base colors: `--primary: #1F4FD8`, `--secondary: #FFC72C`, `--neutral`
desaturated off primary (no separate neutral hue set). Same 11-step
sine-chroma ramp as any luz palette — see `previews/colors.html` for the
rendered swatches (peak saturation at `-500`, near-zero at `50`/`950`).

Semantic: `--background` (`neutral-900`, dark CRT backdrop),
`--foreground` (`neutral-100`), `--on-primary`/`--on-secondary` for text on
filled buttons, `--element-background` (`neutral-950`) for cards/inputs.

Hue wheel available regardless of palette: `--red` `--copper` `--orange`
`--yellow` `--green` `--emerald` `--teal` `--cyan` `--blue`.

## Typography

| Token | Value | Role |
|---|---|---|
| `--font-headings` | `"Bebas Neue", sans-serif` | Marquee/poster titles ("BE KIND, REWIND") |
| `--font` | `"Space Grotesk", sans-serif` | Body copy, UI labels |
| `--font-monospace` | `"VT323", monospace` | Timestamps, comment feed, CRT readouts |
| `--font-weight` | `400` | Body |
| `--font-bold-weight` | `800` | Headings, emphasis |
| `--line-height` | `130%` | — |

`power: 1.5` pushes the heading scale further apart than the 1.33 default —
`h1` reads noticeably bigger than `h2`, matching a blockbuster-poster jump.
See `previews/typography.html`.

## Sizing & spacing

Fixed `--size-1`…`--size-12` unchanged (`0.1rem`→`1.2rem`); fluid
`--size-13`…`--size-22` spread wider than default because of `power: 1.5`
(e.g. `--size-16: clamp(1.60rem, 1.32rem + 1.39cqi, 2.40rem)` vs. `1.33`'s
narrower clamp). `--border-radius: 0.5rem`, `--spacing: 5rem`. See
`previews/sizing.html`.

## Components (`lui`)

Same set as any luz app — nothing mood-specific added, styling comes
entirely from tokens:

| Component | Suggested use here |
|---|---|
| `lui.button` | "Start movie night" (default), "RSVP'd" (`success`), "Cancel" (`danger`), "Maybe" (`ghost`) |
| `lui.card` | Watch-party room card |
| `lui.field` / `lui.form` | Room setup (name, time, autoplay switch) |
| `lui.switch` | "Autoplay next pick" toggle |
| `lui.toast` | "X joined the room" / "New comment" notifications |
| `lui.dialog` | Invite-friends modal |
| `lui.avatar` | Attendee list |
| `lui.meter` | Playback progress bar |

Comment feed uses plain `--font-monospace` text in an `--element-background`
box (CRT readout look) — see `previews/components.html`.

## Usage

```tsx
import { LuzReact } from "luz/react";
import { lui } from "luz/react";
import { config } from "./luz.config";

<LuzReact config={config}>
  <lui.button>Start movie night</lui.button>
</LuzReact>
```

Styling rule: reference luz tokens only (`var(--primary-500)`, `var(--size-N)`,
`var(--font-headings)`, …) — never hardcode hex/px.
