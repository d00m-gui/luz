---
title: light-dark()
category: Feedback
covers: []
span: 2
---

<p><code>mode: "auto"</code> emits every color token as <code>light-dark(light, dark)</code> instead of a separate <code>@media (prefers-color-scheme: dark)</code> block. Each box below forces its own <code>color-scheme</code> to prove both branches resolve, regardless of your system preference — try <code>mode: "auto"</code> in the toolbar at <a href="/components">/components</a> to see it with your own tokens.</p>
<div class="light-dark-demo">
  <div class="light-dark-demo-box" style="color-scheme: light">
    <span>color-scheme: light</span>
  </div>
  <div class="light-dark-demo-box" style="color-scheme: dark">
    <span>color-scheme: dark</span>
  </div>
</div>
<style>
  .light-dark-demo {
    display: flex;
    gap: var(--space-4);
  }
  .light-dark-demo-box {
    flex: 1;
    padding: var(--space-4);
    border-radius: var(--border-radius);
    background: light-dark(var(--primary-100), var(--primary-900));
    color: light-dark(var(--primary-900), var(--primary-100));
  }
</style>
