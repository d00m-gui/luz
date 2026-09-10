---
title: List
category: Layout
covers:
  - list
  - list-row
  - list-col-grow
  - list-col-wrap
  - list-title
  - horizontal
  - responsive
  - nav
  - drilldown
  - filetree
  - hover
---

<div class="list">
  <p class="list-title">Workspace</p>
  <a class="list-row"><i class="icon nf nf-fa-rocket"></i><span class="list-col-grow">Empezando</span></a>
  <a class="list-row" aria-disabled="true"><i class="icon nf nf-fa-lock"></i><span class="list-col-grow">Facturación</span></a>
  <details class="list list-row">
    <summary><i class="icon nf nf-fa-cube"></i><span class="list-col-grow">Componentes</span></summary>
    <div class="list">
      <a class="list-row"><i class="icon nf nf-fa-cube"></i><span class="list-col-grow">Button</span></a>
      <a class="list-row" aria-current="page"><i class="icon nf nf-fa-cube"></i><span class="list-col-grow">List</span></a>
      <a class="list-row"><i class="icon nf nf-fa-cube"></i><span class="list-col-grow">Menu</span></a>
    </div>
  </details>
</div>

## Responsive

<div class="list responsive">
  <a class="list-row">Inicio</a>
  <a class="list-row" aria-current="page">Componentes</a>
  <a class="list-row">Docs</a>
  <a class="list-row">Contacto</a>
</div>

## Nav

<nav class="demo-list-nav">
  <div class="list nav">
    <p class="list-title">Proyecto</p>
    <a class="list-row" aria-current="page"><i class="icon nf nf-fa-home"></i><span class="list-col-grow">Resumen</span><span class="status success"></span></a>
    <a class="list-row"><i class="icon nf nf-fa-bug"></i><span class="list-col-grow">Issues</span><span class="status warning"></span></a>
    <a class="list-row"><i class="icon nf nf-fa-code_fork"></i><span class="list-col-grow">Pull requests</span></a>
    <a class="list-row"><i class="icon nf nf-fa-cog"></i><span class="list-col-grow">Ajustes</span></a>
  </div>
</nav>

## Lista semántica

<ul class="list">
  <li><a class="list-row"><span class="list-col-grow">Notificaciones</span><kbd>N</kbd></a></li>
  <li><a class="list-row"><span class="list-col-grow">Atajos de teclado</span><kbd>?</kbd></a></li>
  <li><a class="list-row"><span class="list-col-grow">Cerrar sesión</span><kbd>⇧Q</kbd></a></li>
</ul>

## Botón como fila

<div class="list">
  <button class="list-row"><i class="icon nf nf-fa-moon_o"></i><span class="list-col-grow">Modo oscuro</span><input type="checkbox" role="switch" checked /></button>
  <button class="list-row"><i class="icon nf nf-fa-bell"></i><span class="list-col-grow">Sonidos</span><input type="checkbox" role="switch" /></button>
  <button class="list-row" aria-current="page"><i class="icon nf nf-fa-language"></i><span class="list-col-grow">Idioma</span><span class="badge neutral">es</span></button>
</div>

## Drilldown

<div class="list drilldown">
  <details class="list-row">
    <summary><i class="icon nf nf-fa-folder"></i><span class="list-col-grow">Cuenta</span></summary>
    <div class="list">
      <a class="list-row">Perfil</a>
      <a class="list-row">Seguridad</a>
      <a class="list-row">Sesiones</a>
    </div>
  </details>
  <details class="list-row">
    <summary><i class="icon nf nf-fa-credit_card"></i><span class="list-col-grow">Facturación</span></summary>
    <div class="list">
      <a class="list-row">Plan</a>
      <a class="list-row">Facturas</a>
    </div>
  </details>
</div>

## Filetree

<div class="list filetree">
  <details class="list-row" open>
    <summary><i class="icon nf nf-fa-folder_open"></i> src</summary>
    <div class="list">
      <details class="list-row" open>
        <summary><i class="icon nf nf-fa-folder_open"></i> tools</summary>
        <div class="list">
          <a class="list-row"><i class="icon nf nf-fa-file_code_o"></i><span class="list-col-grow">list.css</span></a>
          <a class="list-row"><i class="icon nf nf-fa-file_code_o"></i><span class="list-col-grow">overlay.css</span></a>
        </div>
      </details>
      <a class="list-row"><i class="icon nf nf-fa-file_code_o"></i><span class="list-col-grow">index.ts</span></a>
    </div>
  </details>
  <details class="list-row">
    <summary><span class="icon">▸</span> docs</summary>
    <div class="list">
      <a class="list-row"><i class="icon nf nf-fa-file_text_o"></i><span class="list-col-grow">README.md</span></a>
    </div>
  </details>
  <a class="list-row"><i class="icon nf nf-fa-file_text_o"></i><span class="list-col-grow">package.json</span></a>
</div>

<style>
  .demo-list-nav {
    max-width: 16rem;
    border: var(--border-width) solid var(--element-border-color);
    border-radius: var(--border-radius);
  }
</style>
