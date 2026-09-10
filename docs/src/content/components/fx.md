---
title: Fondos y gradientes
category: Surfaces
covers:
  - background-blur
  - background-conic-rainbow
  - sharp
  - background-raised
  - background-glow
---

<div class="demo-fx">
  <div class="card background-conic-rainbow">
    <span>conic angle</span>
  </div>
</div>

## Nitidez

<div class="demo-fx">
  <div class="card background-conic-rainbow" style="--fx-blur: 2rem;">
    <span>--fx-blur: 2rem</span>
  </div>
  <div class="card background-conic-rainbow sharp">
    <span>.sharp</span>
  </div>
</div>

## Superficies elevadas

<div class="grid sm">
  <div class="card background-raised">
    <div class="card-meta"><strong>Raised</strong></div>
    <div class="card-content">Gradiente vertical sutil + highlight interior.</div>
  </div>
  <div class="card background-glow">
    <div class="card-meta"><strong>Glow</strong></div>
    <div class="card-content">Halo del scheme primario.</div>
  </div>
  <div class="card background-glow tertiary">
    <div class="card-meta"><strong>Glow tertiary</strong></div>
    <div class="card-content">Cualquier clase de scheme cambia el halo.</div>
  </div>
  <div class="card background-raised background-glow secondary" style="--fx-lift: 0.04; --fx-glow: 22%;">
    <div class="card-meta"><strong>Combinados</strong></div>
    <div class="card-content">Knobs <code>--fx-lift</code> y <code>--fx-glow</code>.</div>
  </div>
</div>

<style>
  .demo-fx {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    .card {
      flex: 1 1 12rem;
      min-height: 8rem;
      align-items: center;
      justify-content: center;
      span {
        position: relative;
        z-index: 1;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--border-radius);
        background-color: var(--element-background);
      }
    }
  }
</style>
