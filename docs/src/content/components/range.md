---
title: Range
category: Primitives
covers:
  - range
---

<label>
  Range
  <input type="range" min="0" max="100" step="20" data-ticks style="--range-steps: 5" />
</label>

## Largo

<div class="demo-range-length">
  <label>
    Volumen
    <input type="range" min="0" max="100" value="40" style="--range-length: 12rem" />
  </label>
  <label>
    Graves
    <input type="range" min="0" max="100" value="60" display-vertical style="--range-length: 8rem" />
  </label>
</div>

<style>
  .demo-range-length {
    display: flex;
    align-items: flex-start;
    gap: var(--space-8);
  }
</style>
