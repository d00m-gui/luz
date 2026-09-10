---
title: Menu
category: Overlays
covers:
  - menu
  - menu-item
---

<button popovertarget="menu-basic">Options</button>
<div id="menu-basic" popover class="menu">
  <a class="list-row"><i class="icon nf nf-cod-edit_code"></i><span class="list-col-grow">Edit</span></a>
  <a class="list-row"><i class="icon nf nf-oct-duplicate"></i><span class="list-col-grow">Duplicate</span></a>
  <a class="list-row" aria-disabled="true"><i class="icon nf nf-fa-lock"></i><span class="list-col-grow">Facturación</span></a>
  <a class="list-row danger"><i class="icon nf nf-fa-trash_can"></i><span class="list-col-grow">Delete</span><span><kbd>Meta</kbd>+<kbd>D</kbd></span></a>
</div>

## Menu item

<button popovertarget="menu-items">Acciones</button>
<div id="menu-items" popover class="menu">
  <button class="menu-item"><i class="icon nf nf-cod-edit_code"></i> Renombrar <kbd>R</kbd></button>
  <button class="menu-item"><i class="icon nf nf-oct-duplicate"></i> Duplicar <kbd>D</kbd></button>
  <a class="menu-item" href="#"><i class="icon nf nf-fa-external_link"></i> Abrir en pestaña nueva</a>
  <button class="menu-item danger"><i class="icon nf nf-fa-trash_can"></i> Borrar <kbd>⌫</kbd></button>
</div>
