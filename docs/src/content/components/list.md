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
  <a class="list-row"><i class="icon nf nf-fa-file_text_o"></i><span class="list-col-grow">package.json</span></a>
</div>
