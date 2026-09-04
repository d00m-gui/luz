---
wip: true
title: Glass
category: Surfaces
covers:
  - glass
preview: |-
  <div style="background: linear-gradient(135deg, var(--primary-400), var(--secondary-500)); padding: var(--space-6); border-radius: var(--border-radius); display: flex; flex-direction: column; gap: var(--space-4); align-items: flex-start;">
    <div class="card glass">
      <div class="card-title">Frosted card</div>
      <p><code>.glass</code> adds <code>backdrop-filter: blur()</code> over a translucent background.</p>
    </div>
    <button class="btn glass">Glass button</button>
  </div>
---

<div class="card glass">
  <div class="card-title">Frosted card</div>
  <p><code>.glass</code> adds <code>backdrop-filter: blur()</code> over a translucent background — falls back to a solid card where <code>backdrop-filter</code> isn't supported.</p>
</div>
<button class="btn glass">Glass button</button>
