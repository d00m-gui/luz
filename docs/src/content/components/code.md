---
title: Code
category: Primitives
covers:
  - code
  - pre
  - samp
---

<p>Instalá con <code>bun add @d00m-gui/luz</code> y llamá a <code>luz(config)</code>.</p>
<pre><code>import { luz } from "@d00m-gui/luz";

const { style } = luz({ primary: "#f28c20" });</code></pre>
<p>Salida: <samp>200 OK</samp></p>

## Tokens

<div style="--code-bg: var(--primary-900); --on-code: var(--primary-100);">
  <p>Un <code>code</code> con la paleta <code>primary</code>.</p>
  <pre><code>luz({ primary: "#5b7cfa" })</code></pre>
</div>

## Scroll horizontal

<pre><code>const BREAKPOINTS = { sm: 40, md: 48, lg: 64, xl: 80, "2xl": 96 }; // rem, usados por las variantes sm:…2xl: y max-sm:…max-2xl:</code></pre>
