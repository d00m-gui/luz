---
title: Scroll
category: Layout
covers:
  - scroll-y
  - scrollbar-thin
---

<div class="scroll-y demo-scroll" style="--scroll-max: 10rem;">
  <div class="list">
    <a class="list-row">Lunes</a>
    <a class="list-row">Martes</a>
    <a class="list-row">Miércoles</a>
    <a class="list-row">Jueves</a>
    <a class="list-row">Viernes</a>
    <a class="list-row">Sábado</a>
    <a class="list-row">Domingo</a>
  </div>
</div>

## Barra fina

<div class="scroll-y scrollbar-thin demo-scroll" style="--scroll-max: 8rem;">
  <p>Cada párrafo de este bloque empuja el alto más allá de <code>--scroll-max</code>.</p>
  <p>La barra aparece al pasar el mouse y desaparece al salir.</p>
  <p>Sirve para paneles laterales, menús largos o logs.</p>
  <p>El gutter queda reservado, así el contenido no salta.</p>
</div>

<style>
  .demo-scroll {
    max-width: 20rem;
    border: var(--border-width) solid var(--element-border-color);
    border-radius: var(--border-radius);
  }
  .demo-scroll p {
    margin: var(--space-2) var(--space-3);
  }
</style>
