---
title: Skeleton
category: Feedback
covers:
  - skeleton
  - text
---

<div class="skeleton" style="height: 1rem; width: 12rem;"></div>
<div class="skeleton" style="height: 1rem; width: 8rem; margin-top: 0.5rem;"></div>

## Card

<div style="display: flex; gap: var(--space-4); align-items: flex-start; flex-wrap: wrap;">
  <div class="card" style="width: 10rem;">
    <div class="card-content" style="flex-direction: column;">
      <div class="skeleton" style="height: 4rem; width: 100%;"></div>
      <div class="skeleton" style="height: 0.75rem; width: 80%;"></div>
      <div class="skeleton" style="height: 0.75rem; width: 60%;"></div>
    </div>
  </div>
  <div class="card" style="width: 16rem;">
    <div class="card-content" style="flex-direction: column;">
      <div class="skeleton" style="height: 6rem; width: 100%;"></div>
      <div class="skeleton" style="height: 0.875rem; width: 85%;"></div>
      <div class="skeleton" style="height: 0.875rem; width: 65%;"></div>
    </div>
  </div>
  <div class="card" style="width: 22rem;">
    <div class="card-content">
      <div class="skeleton" style="height: 3.5rem; width: 3.5rem; flex-shrink: 0;"></div>
      <div style="display: flex; flex-direction: column; gap: var(--space-2); flex: 1;">
        <div class="skeleton" style="height: 1rem; width: 70%;"></div>
        <div class="skeleton" style="height: 0.875rem; width: 90%;"></div>
        <div class="skeleton" style="height: 0.875rem; width: 50%;"></div>
      </div>
    </div>
  </div>
</div>

## Formas

<div class="card demo-skeleton-shapes">
  <div class="card-content">
    <span class="skeleton avatar"></span>
    <div class="demo-skeleton-lines">
      <span class="skeleton text" style="width: 60%;"></span>
      <span class="skeleton text text-sm" style="width: 90%;"></span>
      <span class="skeleton text text-sm" style="width: 40%;"></span>
    </div>
  </div>
  <div class="card-footer">
    <span class="skeleton badge"></span>
    <span class="skeleton badge"></span>
    <span class="skeleton avatar sm"></span>
    <span class="skeleton avatar lg"></span>
  </div>
</div>

<style>
  .demo-skeleton-shapes {
    max-width: 24rem;
    .card-content {
      flex-direction: row;
      align-items: flex-start;
    }
  }
  .demo-skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    flex: 1 1 auto;
  }
</style>
