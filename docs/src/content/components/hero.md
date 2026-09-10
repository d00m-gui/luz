---
title: Hero
category: Surfaces
covers:
  - hero
  - hero-overlay
  - hero-content
  - hero-heading
  - hero-paragraph
  - hero-background
  - compact
---

<div class="hero">
  <div class="hero-content">
    <h2 class="hero-heading">One style, the whole spectrum</h2>
    <p class="hero-paragraph">48 components, 129 classes, 36 tags, 32 attributes</p>
    <button class="cta">
      <div>
        <span class="text-sm">View</span>
        <span class="text-lg">Collection</span>
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

## Compacto

<div class="hero compact">
  <div class="hero-content">
    <h2 class="hero-heading">Bienvenido de vuelta</h2>
    <p class="hero-paragraph">Tenés 3 tareas vencidas y 2 revisiones pendientes.</p>
    <button class="btn" type="button">Ver tareas</button>
  </div>
</div>

## Fondo

<div class="hero" style="--hero-min-height: 18rem;">
  <div class="hero-background"><div class="background-conic-rainbow" style="height: 100%;"></div></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h2 class="hero-heading">Todo el espectro</h2>
    <p class="hero-paragraph">Un gradiente cónico detrás, un overlay adelante.</p>
  </div>
</div>
<div class="hero compact" style="--hero-min-height: 12rem; margin-top: var(--space-4);">
  <div class="hero-background">
    <img src="/samples/010-w.png" alt="" />
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h2 class="hero-heading">Con imagen</h2>
    <p class="hero-paragraph"><code>object-fit: cover</code> sobre el slot.</p>
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
