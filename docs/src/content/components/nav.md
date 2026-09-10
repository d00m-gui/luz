---
title: Nav
category: Navigation
covers:
  - nav
  - aria-current
---

<nav class="demo-nav">
  <a href="#" aria-current="page">Inicio</a>
  <a href="#">Equipo</a>
  <a href="#">Precios</a>
  <a href="#">Docs</a>
</nav>

## Con lista

<nav>
  <ul class="demo-nav">
    <li><a href="#">Resumen</a></li>
    <li><a href="#" aria-current="page">Actividad</a></li>
    <li><a href="#">Ajustes</a></li>
  </ul>
</nav>

## Botones

<nav class="demo-nav">
  <button class="ghost" aria-current="true">Semana</button>
  <button class="ghost">Mes</button>
  <button class="ghost">Año</button>
</nav>

<style>
  .demo-nav {
    gap: var(--space-2);
    a {
      padding: var(--space-2) var(--space-3);
      text-decoration: none;
      color: inherit;
    }
  }
</style>
