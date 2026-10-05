---
title: Badge
category: Data
desc: "Sin clase de esquema toma <code>--scheme-accent</code>. El texto mezcla el esquema con <code>--foreground</code>: se lee igual en modo claro y oscuro."
covers:
  - badge
  - solid
  - soft
  - outline
  - ghost
  - sm
  - lg
---

<span class="badge">Default</span>
<span class="badge success">Success</span>
<span class="badge danger">Danger</span>
<span class="badge warning">Warning</span>
<span class="badge info">Info</span>
<span class="badge neutral">Neutral</span>
<span class="badge contrast">Contrast</span>

## Variantes — <code>soft</code> (default, tinte al 16 %), <code>solid</code> (relleno, texto por contraste), <code>outline</code> (solo borde) y <code>ghost</code> (transparente)

<div class="demo-badge-rows">
  <div><span class="badge">soft</span> <span class="badge success">soft</span> <span class="badge danger">soft</span></div>
  <div><span class="badge solid">solid</span> <span class="badge solid success">solid</span> <span class="badge solid danger">solid</span></div>
  <div><span class="badge outline">outline</span> <span class="badge outline success">outline</span> <span class="badge outline danger">outline</span></div>
  <div><span class="badge ghost">ghost</span> <span class="badge ghost success">ghost</span> <span class="badge ghost danger">ghost</span></div>
</div>

## Tamaños

<span class="badge sm">sm</span>
<span class="badge">default</span>
<span class="badge lg">lg</span>
<span class="badge pill">pill</span>

## Truncado

<div class="demo-badge-clip">
  <span class="badge">Marca abstracta</span>
  <span class="badge"><span class="demo-badge-label">Marca abstracta</span></span>
</div>

<style>
  .demo-badge-rows {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  .demo-badge-clip {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
    width: 6rem;
  }
  .demo-badge-clip .badge {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
  .demo-badge-label {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
