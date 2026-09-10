---
title: Theme container
category: Surfaces
covers:
  - theme
span: 2
wip: true
---

<p><code>.theme</code> gives a container what <code>body</code> gets from the reset — <code>font-family</code>, <code>font-size</code>, <code>background</code>, <code>color</code> — so a second <code>luz()</code> emitted under its own <code>selector</code> can live inside the page. Each box below scopes a different palette via <code>selector: ".theme-demo-a"</code> / <code>".theme-demo-b"</code>.</p>
<div class="theme-demo">
  <div class="theme theme-demo-a">
    <span class="badge">brand A</span>
    <p>Orange primary, its own <code>--background</code>/<code>--foreground</code>.</p>
  </div>
  <div class="theme theme-demo-b">
    <span class="badge">brand B</span>
    <p>Violet primary, forced dark via <code>color-scheme</code>.</p>
  </div>
</div>
<style>
  .theme-demo {
    display: flex;
    gap: var(--space-4);
  }
  .theme-demo > .theme {
    flex: 1;
    padding: var(--space-4);
    border-radius: var(--border-radius);
  }
  .theme-demo-a {
    --primary-500: oklch(0.73 0.16 60);
    --scheme-primary: var(--primary-500);
    --background: oklch(0.97 0.02 60);
    --foreground: oklch(0.25 0.03 60);
  }
  .theme-demo-b {
    --primary-500: oklch(0.55 0.2 300);
    --scheme-primary: var(--primary-500);
    --background: oklch(0.2 0.03 300);
    --foreground: oklch(0.95 0.01 300);
  }
</style>
