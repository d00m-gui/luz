---
title: Hero
category: Surfaces
covers:
  - hero
  - hero-overlay
  - hero-content
---

<div class="hero">
  <div class="hero-content">
    <h2 class="hero-heading">Un estilo, todo el espectro</h2>
    <p class="hero-paragraph">48 componentes, 129 clases, 36 tags, 32 attrs</p>
    <button class="cta">
      <div>
        <span class="text-sm">Ver</span>
        <span class="text-lg">Colección</span>
      </div>
    </button>
  </div>
</div>

## Hero Blur

<div class="hero demo-hero-blur" style="min-height: 26rem;">
  <div class="hero-overlay background-blur"></div>
  <div class="hero-content">
    <h5>No flash before your eyes</h5>
    <h2>Ride the Lightning</h2>
    <p class="hero-paragraph">You can feel the flame</p>
  </div>
</div>

## Hero dos columnas

<div class="element hero pair demo-pair">
  <figure>
    <img src="/samples/007-w.png" />
  </figure>
  <div class="element">
    <h2>Rediseñado de punta a punta</h2>
    <p class="hero-paragraph">Una línea de bajada más larga explicando el producto.</p>
  </div>
</div>

<style>
  .demo-hero-blur {
    background-color: var(--background);
    .hero-overlay {
      background-image: url('/samples/010-w.png');
    }
  }
  .demo-pair {
    --element-gap: var(--space-8);
  }
</style>
