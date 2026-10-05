---
title: Progress
category: Primitives
covers:
  - progress
  - meter
---

<label>
  Progress
  <progress value="60" max="100"></progress>
</label>

## Meter

<div class="demo-meters">
  <label class="meter">
    <span>Asientos</span>
    <code>3/5</code>
    <progress value="3" max="5"></progress>
  </label>
  <label class="meter">
    <span>Almacenamiento</span>
    <code>7,2 GB</code>
    <progress value="72" max="100"></progress>
  </label>
</div>

## Relleno de progreso — <code>.progress</code> pinta el fondo de un botón o una fila hasta <code>--progress</code> (0–1), con <code>--progress-fill</code> al 25 %; la aplicación actualiza <code>--progress</code> desde JS/TS

<div class="demo-meters">
  <button class="progress" style="--progress: 0.4">Imagen · 40 %</button>
  <div class="list"><div class="list-row progress" style="--progress: 0.75">Modelo · 75 %</div></div>
</div>

<style>
  .demo-meters {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 20rem;
  }
</style>
