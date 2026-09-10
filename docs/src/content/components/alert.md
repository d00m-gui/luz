---
title: Alert
category: Overlays
covers:
  - alert
---

<div class="demo-alerts">
  <div class="alert">Default alert</div>
  <div class="alert success">Changes saved</div>
  <div class="alert danger">Something went wrong</div>
  <div class="alert warning">Check your input</div>
  <div class="alert info">New version available</div>
  <div class="alert neutral">Neutral notice</div>
  <div class="alert contrast">Contrast notice</div>
</div>

## Con acción

<div class="demo-alerts">
  <div class="alert warning">
    <span>Hay cambios sin guardar.</span>
    <button class="sm">Descartar</button>
    <button class="sm danger">Guardar</button>
  </div>
</div>

<style>
  .demo-alerts {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
</style>
