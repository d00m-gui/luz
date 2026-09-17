---
title: Badge
category: Data
covers:
  - badge
---

<span class="badge">Default</span>
<span class="badge success">Success</span>
<span class="badge danger">Danger</span>
<span class="badge warning">Warning</span>
<span class="badge neutral">Neutral</span>
<span class="badge contrast">Contrast</span>
<span class="badge ghost">Ghost</span>

## Truncado

<div class="demo-badge-clip">
  <span class="badge">Marca abstracta</span>
  <span class="badge"><span class="demo-badge-label">Marca abstracta</span></span>
</div>

<style>
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
