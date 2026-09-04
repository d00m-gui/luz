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
  <div class="list-row">
    <span class="avatar sm">AB</span>
    <div class="list-col-grow">
      <p><strong>Ada Byron</strong></p>
      <p class="text-sm">Admin</p>
    </div>
    <button class="ghost square" aria-label="More">⋮</button>
  </div>
  <div class="list-row">
    <span class="avatar sm">GH</span>
    <div class="list-col-grow">
      <p><strong>Grace Hopper</strong></p>
      <p class="text-sm">Editor</p>
    </div>
    <button class="ghost square" aria-label="More">⋮</button>
  </div>
</div>

## Collapsible rows — <code>&lt;details class="list-row"&gt;</code>

<div class="list">
  <details class="list-row" name="luz-list-demo">
    <summary>What is luz?</summary>
    <p>A CSS theming library — colors, typography, and spacing from a single primary color.</p>
  </details>
  <details class="list-row" name="luz-list-demo">
    <summary>Does it need a build step?</summary>
    <p>No — the output is plain CSS custom properties.</p>
  </details>
  <details class="list-row" name="luz-list-demo">
    <summary>Is JS required?</summary>
    <p>No — exclusive open/close is native, via the shared <code>name</code> attribute on each <code>&lt;details&gt;</code>.</p>
  </details>
</div>

## Titled group, active & disabled items — <code>.list-title</code>, <code>aria-current</code>, <code>aria-disabled</code>

<div class="list">
  <p class="list-title">Workspace</p>
  <a class="list-row"><i class="icon nf nf-fa-home"></i><span class="list-col-grow">Inicio</span></a>
  <a class="list-row" aria-current="page"><i class="icon nf nf-fa-cube"></i><span class="list-col-grow">Componentes</span></a>
  <a class="list-row" aria-disabled="true"><i class="icon nf nf-fa-lock"></i><span class="list-col-grow">Facturación</span></a>
  <a class="list-row"><i class="icon nf nf-fa-book"></i><span class="list-col-grow">Docs</span><kbd>⌘D</kbd></a>
</div>

## Horizontal — <code>.list.horizontal</code>

<div class="list horizontal">
  <a class="list-row">Inicio</a>
  <a class="list-row" aria-current="page">Componentes</a>
  <a class="list-row">Docs</a>
  <a class="list-row">Contacto</a>
</div>

## Responsive — <code>.list.responsive</code> (horizontal ≥48rem, vertical debajo)

<div class="list responsive">
  <a class="list-row">Inicio</a>
  <a class="list-row" aria-current="page">Componentes</a>
  <a class="list-row">Docs</a>
  <a class="list-row">Contacto</a>
</div>

## Submenu anidado — <code>.list .list</code>

<div class="list">
  <p class="list-title">Docs</p>
  <a class="list-row"><i class="icon nf nf-fa-rocket"></i><span class="list-col-grow">Empezando</span></a>
  <a class="list-row"><i class="icon nf nf-fa-cube"></i><span class="list-col-grow">Componentes</span></a>
  <div class="list">
    <a class="list-row"><span class="list-col-grow">Button</span></a>
    <a class="list-row" aria-current="page"><span class="list-col-grow">List</span></a>
    <a class="list-row"><span class="list-col-grow">Menu</span></a>
  </div>
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
