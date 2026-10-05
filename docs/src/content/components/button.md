---
title: Button
category: Primitives
covers:
  - btn
  - button
  - icon
  - cta
  - sm
  - lg
span: 2
---

<div class="demo-buttons">
  <button>Default</button>
  <button class="primary">Primary</button>
  <button class="outline">Outline</button>
  <button class="neutral">Neutral</button>
  <button class="success">Success</button>
  <button class="contrast">Contrast</button>
  <button class="danger">Danger</button>
  <button class="warning">Warning</button>
  <button class="ghost">Ghost</button>
  <button class="pill">Pill</button>
  <button disabled="true">Disabled</button>
  <button class="square" aria-label="Add"><i class="icon nf nf-fa-plus"></i></button>
  <button><i class="icon nf nf-fa-download"></i> Download</button>
  <button class="outline success"><i class="icon nf nf-fa-play"></i> Play</button>
  <button class="loading">Saving</button>
  <button class="block"><i class="icon nf nf-fa-github"></i> Continue with GitHub</button>
  <button class="cta">
    <i class="icon text-2xl nf nf-fa-github"></i>
    <div>
      <span class="text-lg">Sin tarjeta de crédito</span>
      <span class="text-sm">Empezar gratis</span>
    </div>
  </button>
</div>

## Roles

<div class="demo-buttons">
  <button data-role="secondary">Secondary</button>
  <button data-role="tertiary">Tertiary</button>
  <button data-role="apply">Apply</button>
  <button data-role="cancel">Cancel</button>
  <button data-role="contrast">Contrast</button>
</div>

## Variantes — <code>soft</code>, <code>outline</code> y <code>ghost</code> se combinan con cualquier esquema. Hover y <code>:active</code> mezclan <code>--foreground</code> sobre el fondo: oscurecen en claro, aclaran en oscuro

<div class="demo-buttons">
  <button class="primary">Solid</button>
  <button class="primary soft">Soft</button>
  <button class="primary outline">Outline</button>
  <button class="primary ghost">Ghost</button>
  <button class="danger soft">Soft</button>
  <button class="danger outline">Outline</button>
  <button class="danger ghost">Ghost</button>
</div>

## Tamaños — <code>.sm</code> y <code>.lg</code>

<div class="demo-buttons">
  <button class="sm">Small</button>
  <button>Default</button>
  <button class="lg">Large</button>
</div>

<style>
  .demo-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
</style>
