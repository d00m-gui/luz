---
title: Page
category: Layout
covers:
  - page
  - page-header
  - page-header-title
  - page-body
  - with-aside
  - page-aside
  - stack
span: 2
---

<div class="page" style="--page-width: 48rem;">
  <header class="page-header">
    <div class="page-header-title">
      <h1>Proyectos</h1>
      <p>Todo lo que tu equipo está construyendo, en un solo lugar.</p>
    </div>
    <button class="btn outline" type="button">Importar</button>
    <button class="btn" type="button">Nuevo proyecto</button>
  </header>
  <div class="page-body">
    <section class="card">
      <div class="card-content">
        <strong>Actividad</strong>
        <p>Cada hijo directo de <code>.page-body</code> se separa con <code>--space-6</code>.</p>
      </div>
    </section>
    <section class="card">
      <div class="card-content">
        <strong>Miembros</strong>
        <p>Las <code>section</code> dentro de <code>.page</code> pierden su padding propio.</p>
      </div>
    </section>
  </div>
</div>

## Con aside

<div class="page" style="--page-width: 56rem;">
  <header class="page-header">
    <div class="page-header-title">
      <h1>Factura #1042</h1>
      <p>Emitida el 3 de septiembre.</p>
    </div>
    <button class="btn" type="button">Cobrar</button>
  </header>
  <div class="page-body with-aside" style="--page-aside-width: 14rem;">
    <div class="stack">
      <div class="card">
        <div class="card-content"><strong>Ítems</strong><p>3 líneas · $1.240</p></div>
      </div>
      <div class="card">
        <div class="card-content"><strong>Notas</strong><p>Pago a 30 días.</p></div>
      </div>
    </div>
    <aside class="page-aside">
      <div class="stat">
        <span class="stat-label">Estado</span>
        <span class="stat-value"><span class="badge warning">Pendiente</span></span>
      </div>
      <div class="stat">
        <span class="stat-label">Cliente</span>
        <span class="stat-value">ACME</span>
      </div>
    </aside>
  </div>
</div>

## Stack

<div class="stack" style="--stack-gap: var(--space-3);">
  <div class="alert info">Los cambios se guardan automáticamente.</div>
  <div class="card"><div class="card-content">Primer bloque</div></div>
  <div class="card"><div class="card-content">Segundo bloque</div></div>
</div>
