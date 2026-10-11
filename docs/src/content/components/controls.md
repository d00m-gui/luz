---
title: Controls
desc: 'incluidos por defecto en <code>luz.css</code> y <code>components.css</code>; se pueden omitir con <code>exclude: ["controls"]</code>. El import explícito <code>@import "@d00m-gui/luz/components/controls.css"</code> siempre los incluye. Solo visual; interacción y accesibilidad a cargo de la app, estado por <code>aria-pressed</code>/<code>aria-checked</code>/<code>data-state</code>/<code>data-disabled</code>, posición por <code>--knob-angle</code> y <code>--fader-value</code>. Skins de ejemplo en <code>/skins</code>'
category: Primitives
span: 2
covers:
  - led
  - readout
  - readout-caption
  - readout-value
  - readout-unit
  - knob
  - knob-face
  - knob-dial
  - knob-cap
  - knob-readout
  - knob-legend
  - fader
  - fader-readout
  - fader-control
  - fader-track
  - fader-fill
  - fader-thumb
  - fader-scale
  - toggle-switch
  - toggle-switch-body
  - toggle-switch-slot
  - toggle-switch-lever
  - toggle-switch-legend
  - rocker
  - selector
  - selector-options
  - selector-option
  - led-button
  - control-label
  - mfd
  - mfd-screen
  - mfd-keys
---

La demo responde a arrastre, flechas, Home/End y rueda sobre knobs/faders.
Los switches, selectores y softkeys actualizan estados y el MFD. Este
comportamiento vive solo en `docs/`; no forma parte de la librería.

<div style="display: flex; flex-wrap: wrap; align-items: flex-end; gap: var(--space-6)">
  <span class="led" data-state="on"></span>
  <span class="led success" data-state="blink"></span>
  <div class="readout">
    <span class="readout-caption">Speed</span>
    <span class="readout-value">212<span class="readout-unit">m/s</span></span>
  </div>
  <div class="knob">
    <div class="knob-face">
      <div class="knob-dial" role="slider" tabindex="0" aria-label="Gain" aria-valuenow="60" style="--knob-angle: 27deg">
        <span class="knob-cap"></span>
      </div>
    </div>
    <output class="readout small knob-readout">60</output>
    <span class="control-label">Gain</span>
  </div>
  <div class="fader vertical" style="--fader-value: 0.4">
    <output class="readout small fader-readout">40</output>
    <div class="fader-control">
      <span class="fader-scale" style="--fader-ticks: 8"></span>
      <div class="fader-track">
        <div class="fader-fill"></div>
        <div class="fader-thumb" role="slider" tabindex="0" aria-label="Throttle" aria-valuenow="40"></div>
      </div>
    </div>
    <span class="control-label">Throttle</span>
  </div>
  <div class="toggle-switch">
    <button class="toggle-switch-body" type="button" role="switch" aria-checked="true">
      <span class="led"></span>
      <span class="toggle-switch-legend on">On</span>
      <span class="toggle-switch-slot"><span class="toggle-switch-lever"></span></span>
      <span class="toggle-switch-legend off">Off</span>
    </button>
    <span class="control-label">Power</span>
  </div>
  <div class="toggle-switch rocker">
    <button class="toggle-switch-body" type="button" role="switch" aria-checked="false">
      <span class="toggle-switch-legend on">Arm</span>
      <span class="toggle-switch-slot"><span class="toggle-switch-lever"></span></span>
      <span class="toggle-switch-legend off">Safe</span>
    </button>
    <span class="control-label">Weapons</span>
  </div>
  <div class="selector segmented">
    <div class="selector-options" role="radiogroup" aria-label="Mode">
      <button class="selector-option" type="button" role="radio" aria-checked="true"><span class="led"></span>Nav</button>
      <button class="selector-option" type="button" role="radio" aria-checked="false"><span class="led"></span>Scan</button>
      <button class="selector-option" type="button" role="radio" aria-checked="false"><span class="led"></span>Combat</button>
    </div>
    <span class="control-label">Mode</span>
  </div>
  <button class="led-button" type="button" aria-pressed="true"><span class="led"></span>Lights</button>
  <button class="led-button" type="button" aria-pressed="false"><span class="led"></span>Doors</button>
</div>

## Selector rotativo — <code>.knob</code> con <code>.knob-legend</code>, cada una en su <code>--legend-angle</code> y la elegida con <code>data-active="true"</code>

<div class="knob">
  <div class="knob-face">
    <div class="knob-dial" role="slider" tabindex="0" aria-label="Power mode" aria-valuetext="Mid" style="--knob-angle: 0deg">
      <span class="knob-cap"></span>
    </div>
    <span class="knob-legend" style="--legend-angle: -135deg">Off</span>
    <span class="knob-legend" style="--legend-angle: 0deg" data-active="true">Mid</span>
    <span class="knob-legend" style="--legend-angle: 135deg">Max</span>
  </div>
  <span class="control-label">Power mode</span>
</div>

## Fader horizontal — <code>.fader.horizontal</code>; <code>--fader-length</code> fija el largo

<div class="fader horizontal" style="--fader-value: 0.7; --fader-length: 16rem">
  <span class="control-label">Shields</span>
  <output class="readout small fader-readout">70%</output>
  <div class="fader-control">
    <span class="fader-scale" style="--fader-ticks: 10"></span>
    <div class="fader-track">
      <div class="fader-fill"></div>
      <div class="fader-thumb" role="slider" tabindex="0" aria-label="Shields" aria-valuenow="70"></div>
    </div>
  </div>
</div>

## Bisel de MFD — <code>.mfd</code> con <code>.mfd-screen</code> y <code>.mfd-keys.top|bottom|left|right</code>; <code>--mfd-key-size</code> fija el tamaño de las softkeys

<div class="mfd" style="inline-size: 30rem; block-size: 20rem">
  <div class="mfd-keys top">
    <button class="led-button" type="button" aria-pressed="true">Nav</button>
    <button class="led-button" type="button">Scan</button>
    <button class="led-button" type="button">Comms</button>
    <button class="led-button" type="button">Power</button>
  </div>
  <div class="mfd-keys left">
    <button class="led-button" type="button">L1</button>
    <button class="led-button" type="button">L2</button>
    <button class="led-button" type="button">L3</button>
  </div>
  <div class="mfd-screen">
    <div class="readout large">
      <span class="readout-caption">Altitude</span>
      <span class="readout-value">1240<span class="readout-unit">m</span></span>
    </div>
  </div>
  <div class="mfd-keys right">
    <button class="led-button" type="button">R1</button>
    <button class="led-button" type="button">R2</button>
    <button class="led-button" type="button">R3</button>
  </div>
  <div class="mfd-keys bottom">
    <button class="led-button" type="button">Back</button>
    <button class="led-button" type="button">Home</button>
    <button class="led-button" type="button">Menu</button>
  </div>
</div>
