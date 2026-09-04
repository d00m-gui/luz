---
title: Editable card
category: Primitives
covers:
  - card
---

<div class="card">
  <div class="card-title" style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-2)">
    Notes
    <button type="button" class="btn ghost square" aria-label="Edit" onclick="this.closest('.card').querySelector('.editable-demo').focus()">✎</button>
  </div>
  <div class="editable-demo" contenteditable="plaintext-only">Click the pencil, then type. <code>contenteditable="plaintext-only"</code> strips any pasted markup automatically — no rich-text risk, unlike <code>contenteditable="true"</code>.</div>
</div>
<style>
  .editable-demo {
    border-radius: var(--border-radius);
    padding: var(--space-2);
    outline: 0;
  }
  .editable-demo:focus {
    animation: editable-highlight 900ms ease-out;
  }
  @keyframes editable-highlight {
    from { background-color: color-mix(in oklch, var(--primary) 25%, transparent); }
    to { background-color: transparent; }
  }
</style>
