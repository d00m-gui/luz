---
title: Choice
category: Primitives
desc: "<code>.choice-grid</code> acomoda las fichas con <code>auto-fill</code> (mínimo <code>--choice-min</code>); la elegida lleva <code>aria-pressed=\"true\"</code> y toma <code>--scheme-accent</code>. <code>.wireframe</code> dibuja cajas en <code>currentColor</code>: <code>.frame</code> al 50 %, <code>data-kind=\"obj\"</code> rellena al 20 %."
covers:
  - choice
  - choice-grid
  - wireframe
---

<div class="choice-grid" style="max-width: 24rem">
  <button type="button" class="choice" aria-pressed="true">
    <svg class="wireframe" viewBox="0 0 400 300" aria-hidden="true">
      <rect class="frame" x="5" y="5" width="390" height="290" />
      <rect data-kind="obj" x="60" y="60" width="280" height="180" />
    </svg>
    <span>Centrado</span>
  </button>
  <button type="button" class="choice" aria-pressed="false">
    <svg class="wireframe" viewBox="0 0 400 300" aria-hidden="true">
      <rect class="frame" x="5" y="5" width="390" height="290" />
      <rect data-kind="obj" x="30" y="60" width="160" height="180" />
      <rect x="220" y="90" width="150" height="40" />
    </svg>
    <span>Dividido</span>
  </button>
  <button type="button" class="choice" disabled>
    <svg class="wireframe" viewBox="0 0 400 300" aria-hidden="true">
      <rect class="frame" x="5" y="5" width="390" height="290" />
    </svg>
    <span>Vacío</span>
  </button>
</div>
