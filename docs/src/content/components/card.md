---
title: Card
category: Surfaces
covers:
  - card
  - card-content
  - card-meta
  - card-cover
  - card-toolbar
  - space
  - center
---

<div class="card demo-card">
  <figure class="card-feature">
    <img src="/samples/001-w.png" />
  </figure>
  <div class="card-meta">
    <span class="badge neutral"><code>36</code> Tags</span>
    <span class="badge neutral"><code>32</code> Attrs</span>
  </div>
  <div class="card-content">
    <h4>48 componentes</h4>
    <p>Un estilo, todo el espectro</p>
  </div>
  <div class="card-footer">
    <span class="badge neutral"><code>16.3</code> KB</span>
  </div>
</div>

## Cover

<div class="card demo-card">
  <div class="card-cover">
    <img src="/samples/004-w.png" alt="" />
  </div>
  <div class="card-content">
    <h4>Sierras de Córdoba</h4>
    <p>Tres días, dos noches, cero señal.</p>
  </div>
</div>
<div class="card demo-card" style="--ratio: 16 / 9;">
  <div class="card-cover">
    <img src="/samples/007-w.png" alt="" />
  </div>
  <div class="card-content">
    <h4>Con <code>--ratio: 16 / 9</code></h4>
  </div>
</div>

## Toolbar

<div class="card demo-card-wide">
  <div class="card-toolbar">
    <div class="tabs segmented">
      <input class="tab-input" type="radio" name="ks-card-toolbar" id="ks-card-all" checked />
      <label class="tab" for="ks-card-all">Todos</label>
      <input class="tab-input" type="radio" name="ks-card-toolbar" id="ks-card-open" />
      <label class="tab" for="ks-card-open">Abiertos</label>
    </div>
    <span class="space"></span>
    <input type="search" placeholder="Buscar…" />
  </div>
  <table>
    <thead><tr><th>Issue</th><th>Estado</th></tr></thead>
    <tbody>
      <tr><td>Menú no cierra en Safari</td><td><span class="badge danger">abierto</span></td></tr>
      <tr><td>Traducir docs</td><td><span class="badge success">cerrado</span></td></tr>
    </tbody>
  </table>
</div>

## Contenido en fila

<div class="card demo-card">
  <div class="card-content demo-card-row">
    <span class="avatar">CS</span>
    <div>
      <strong>Carlos S.</strong>
      <p class="text-sm">Mantiene luz</p>
    </div>
  </div>
</div>

## Centrada

<div class="card center demo-card" style="min-height: 10rem;">
  <i class="icon nf nf-fa-inbox text-2xl"></i>
  <p>Nada por acá todavía</p>
</div>

## Overflow con cover

<div class="grid overflow sm">
  <div class="card">
    <div class="card-cover">
      <img src="/samples/002-w.png" alt="" />
    </div>
    <div class="card-meta"><span class="badge neutral">Nuevo</span></div>
    <div class="card-content">
      <h4>Cover + meta</h4>
      <p>La meta va después de la portada en el DOM.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-meta"><span class="badge neutral">Sin cover</span></div>
    <div class="card-content">
      <h4>Solo meta</h4>
      <p>Acá el padding superior reserva el lugar.</p>
    </div>
  </div>
</div>

<style>
  .demo-card {
    width: var(--element-width);
    margin: 0 auto;
  }
  .demo-card + .demo-card {
    margin-top: var(--space-4);
  }
  .demo-card-wide {
    max-width: 36rem;
    margin: 0 auto;
  }
  .demo-card-row {
    flex-direction: row;
    align-items: center;
  }
</style>
