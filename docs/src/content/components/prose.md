---
title: Prose
category: Primitives
covers:
  - prose
  - address
span: 2
---

<article class="prose">
  <h2>Por qué una escala y no un valor</h2>
  <p>Cada tamaño de luz sale de un ratio. Cambiás <code>power</code> y toda la jerarquía se mueve junta, sin retocar componente por componente.</p>
  <h3>Listas</h3>
  <p>Las listas dentro de <code>.prose</code> sangran con <code>padding-inline-start</code> y separan sus ítems; <code>ol</code> numera de verdad.</p>
  <ol>
    <li>Elegí el color primario.</li>
    <li>Ajustá <code>harmony</code> si el producto pide más de un acento.</li>
    <li>Dejá que <code>density</code> haga el resto.</li>
  </ol>
  <ul>
    <li>Sin JS.</li>
    <li>Sin valores arbitrarios.</li>
  </ul>
  <h3>Definiciones</h3>
  <dl>
    <dt>Token</dt>
    <dd>Custom property que <code>luz()</code> emite bajo <code>selector</code>.</dd>
    <dt>Knob</dt>
    <dd>Custom property con prefijo de componente y fallback, como <code>--prose-width</code>.</dd>
  </dl>
  <blockquote>El mejor sistema de diseño es el que no hace falta explicar.</blockquote>
  <p>Los márgenes propios de <code>hr</code> y <code>blockquote</code> siguen ganando al ritmo.</p>
</article>

## Ancho

<article class="prose" style="--prose-width: 45ch;">
  <h4>Columna angosta</h4>
  <p>Un ancho de 45 caracteres es cómodo para notas al margen, tooltips largos o previews de contenido en cards.</p>
  <p>El texto corta antes; el ritmo vertical es el mismo.</p>
</article>
