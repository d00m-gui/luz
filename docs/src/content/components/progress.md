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

<style>
  .demo-meters {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 20rem;
  }
</style>
